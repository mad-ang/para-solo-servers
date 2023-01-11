import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IPlayer, ITownState } from '../../../types/ITownState'

type Payload = {
  client: Client
  chatId: string
  receiver: string
  content: string
}

export default class PlayerUpdateCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client ,chatId, receiver, content } = data
    
    const player = this.room.state.players.get(client.sessionId)

    if (!player) return
    player.x = x
    player.y = y
    player.anim = anim
  }
}