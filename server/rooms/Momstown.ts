import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, TownState, Table, Chair } from './schema/TownState'
import { Message } from '../../types/Messages'
import { IRoomData } from '../../types/Rooms'
import { whiteboardRoomIds } from './schema/TownState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import {ChairStatusUpdateCommand} from './commands/ChairStatusUpdateCommand'
import ChatMessageUpdateCommand from './commands/ChatMessageUpdateCommand'
import { TableAddUserCommand, TableRemoveUserCommand } from './commands/TableUpdateArrayCommand'
import { userDB } from '../DB/db'

export class SkyOffice extends Room<TownState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IRoomData) {
    const { name, description, password, autoDispose } = options
    this.name = name
    this.description = description
    this.autoDispose = autoDispose

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }
    this.setMetadata({ name, description, hasPassword })

    this.setState(new TownState())

    for (let i = 0; i < 4; i++) {
      this.state.tables.set(String(i), new Table())
    }
    let j = 0;
    this.state.tables.forEach((table) => {
      j++;
      for (let i = 0; i < 4; i++) {
        const chair = this.state.chairs.set(String(i * j), new Chair())
      }
    })
    
    this.onMessage(Message.CONNECT_TO_TABLE, (client, message: { tableId: string }) => {
      this.dispatcher.dispatch(new TableAddUserCommand(), {
        client,
        tableId: message.tableId,
      })
    })

    this.onMessage(Message.DISCONNECT_FROM_TABLE, (client, message: { tableId: string }) => {
      this.dispatcher.dispatch(new TableRemoveUserCommand(), {
        client,
        tableId: message.tableId,
      })
    })
    // dispatcher 로 관리해야함.
    this.onMessage(Message.UPDATE_CHAIR_STATUS, (client, message: { tableId: string, chairId: string, status : boolean}) =>{
      console.log("message", message);
      this.dispatcher.dispatch(new ChairStatusUpdateCommand(), {
        client,
        tableId: message.tableId,
        chairId: message.chairId,
        status: message.status
      })
    })

    this.onMessage(Message.STOP_TABLE_TALK, (client, message: { tableId: string }) => {
      const table = this.state.tables.get(message.tableId)
      table?.connectedUser.forEach((id) => [
        this.clients.forEach((cli) => {
          if (cli.sessionId === id && cli.sessionId !== client.sessionId) {
            cli.send(Message.STOP_TABLE_TALK, client.sessionId)
          }
        }),
      ])
    })
    // when a player stop sharing screen
    // this.onMessage(Message.STOP_SCREEN_SHARE, (client, message: { computerId: string }) => {
    // const computer = this.state.computers.get(message.computerId)
    // computer.connectedUser.forEach((id) => {
    //   this.clients.forEach((cli) => {
    //     if (cli.sessionId === id && cli.sessionId !== client.sessionId) {
    //       cli.send(Message.STOP_SCREEN_SHARE, client.sessionId)
    //     }
    //   })
    // })
    // })

    // when receiving updatePlayer message, call the PlayerUpdateCommand

    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
      }
    )

    // when receiving updatePlayerName message, call the PlayerUpdateNameCommand
    this.onMessage(Message.UPDATE_PLAYER_NAME, (client, message: { name: string }) => {
      this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
        client,
        name: message.name,
      })
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId)
      if (player) player.readyToConnect = true
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.VIDEO_CONNECTED, (client) => {
      const player = this.state.players.get(client.sessionId)
      if (player) player.videoConnected = true
    })

    // when a player disconnect a stream, broadcast the signal to the other player connected to the stream
    this.onMessage(Message.DISCONNECT_STREAM, (client, message: { clientId: string }) => {
      this.clients.forEach((cli) => {
        if (cli.sessionId === message.clientId) {
          cli.send(Message.DISCONNECT_STREAM, client.sessionId)
        }
      })
    })

    // when a player send a chat message, update the message array and broadcast to all connected clients except the sender
    this.onMessage(Message.ADD_CHAT_MESSAGE, (client, message: { content: string }) => {
      // update the message array (so that players join later can also see the message)
      this.dispatcher.dispatch(new ChatMessageUpdateCommand(), {
        client,
        content: message.content,
      })

      // broadcast to all currently connected clients except the sender (to render in-game dialog on top of the character)
      this.broadcast(
        Message.ADD_CHAT_MESSAGE,
        { clientId: client.sessionId, content: message.content },
        { except: client }
      )
    })
  }

  async onAuth(client: Client, options: { password: string | null }) {
    if (this.password) {
      const validPassword = await bcrypt.compare(options.password!, this.password)
      if (!validPassword) {
        throw new ServerError(403, 'Password is incorrect!')
      }
    }
    return true
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player())
    console.log('this.roomId', this.roomId)
    const rooms = userDB.rooms
    let currentRoomUserCnt = 1
    if (!Object.hasOwnProperty.call(rooms, this.roomId)) {
      userDB.rooms[this.roomId] = {
        userCnt: 1,
      }
    } else {
      const currentRoom = userDB.rooms[this.roomId]
      ;(currentRoomUserCnt = currentRoom.userCnt + 1),
        (userDB.rooms[this.roomId] = {
          ...currentRoom,
          userCnt: currentRoomUserCnt,
        })
    }

    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
      userCnt: currentRoomUserCnt,
    })
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    this.state.tables.forEach((table) => {
      if (table.connectedUser.has(client.sessionId)) {
        table.connectedUser.delete(client.sessionId)
      }
    })

    const currentRoom = userDB.rooms[this.roomId]
    userDB.rooms[this.roomId] = {
      ...currentRoom,
      userCnt: currentRoom.userCnt - 1,
    }
    if (currentRoom.userCnt === 0) {
      delete userDB.rooms[this.roomId]
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
}
