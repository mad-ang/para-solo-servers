import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ITownState } from '../../../types/ITownState'

type Payload = {
  client: Client
  chairId: string
  status: boolean
}

export class ChairStatusUpdateCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, chairId, status } = data
    const chair = this.room.state.chairs.get(String(chairId))
    this.room.state.chairs.forEach((c) => {  
      console.log("chair is occupied?", c.occupied)
    })
    console.log("chairId", chairId);
    console.log("chairbefore", chair?.occupied);

    const clientId = client.sessionId

    if (!chair) return
    chair.occupied = status
    console.log("chairafter", chair?.occupied);
  }
}
