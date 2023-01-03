import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ITownState } from '../../../types/ITownState'

type Payload = {
  client: Client
  tableId: string
}

export class TableAddUserCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, tableId } = data
    const table = this.room.state.tables.get(tableId)
    const clientId = client.sessionId

    if (!table || table.connectedUser.has(clientId)) return
    table.connectedUser.add(clientId)
  }
}

export class TableRemoveUserCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, tableId } = data
    const table = this.state.tables.get(tableId)

    if (tableId.connectedUser.has(client.sessionId)) {
      tableId.connectedUser.delete(client.sessionId)
    }
  }
}
