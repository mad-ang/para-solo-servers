import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ITownState } from '../../../types/ITownState'

type Payload = {
  client: Client
  tableId: string
  chairId: string
  status: boolean
}

export class ChairStatusUpdateCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, tableId, chairId, status } = data
    const chair = this.room.state.chairs.get(String(chairId))
    const table = this.room.state.tables.get(String(tableId))
    const clientId = client.sessionId
    if (!chair) return
    chair.occupied = status;
    chair.clientId = clientId;
    console.log(chair.clientId)
  }
}
