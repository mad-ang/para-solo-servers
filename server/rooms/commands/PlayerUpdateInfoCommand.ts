import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { IUserInfo } from '../../controllers/UserControllers/types';
import { ITownState } from '../../../types/ITownState';

type Payload = {
  client: Client;
  userinfo: IUserInfo;
};

export default class PlayerUpdateInfoCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, userinfo } = data;

    const player = this.room.state.players.get(client.sessionId);

    if (!player) return;
    player.userinfo = userinfo;
  }
}
