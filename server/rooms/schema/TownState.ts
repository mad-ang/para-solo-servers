import { Schema, ArraySchema, SetSchema, MapSchema, type } from '@colyseus/schema'
import { IPlayer, ITownState, ITable, IChatMessage, IChair } from '../../../types/ITownState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('string') userId = ''
  @type('number') x = 300
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
  @type('boolean') readyToConnect = false
  @type('boolean') videoConnected = false
}

export class ChatMessage extends Schema implements IChatMessage {
  @type('string') author = ''
  @type('number') createdAt = new Date().getTime()
  @type('string') content = ''
}

export class Chair extends Schema implements IChair {
  @type('boolean') occupied = false
  @type('string') clientId = ''
}
export class Table extends Schema implements ITable {
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
  @type({ map: Chair }) containedChairs = new MapSchema<Chair>()
}

export class TownState extends Schema implements ITownState {
  @type({ map: Player })
  players = new MapSchema<Player>()

  @type({ map: Table })
  tables = new MapSchema<Table>()

  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()

  @type({map : Chair})
  chairs = new MapSchema<Chair>()
}


export const whiteboardRoomIds = new Set<string>()
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

function getRoomId() {
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  if (!whiteboardRoomIds.has(result)) {
    whiteboardRoomIds.add(result)
    return result
  } else {
    console.log('roomId exists, remaking another one.')
    getRoomId()
  }
}
