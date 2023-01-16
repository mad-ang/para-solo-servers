import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { IUserInfo } from '../../controllers/UserControllers/types';
import { ITownState } from '../../../types/ITownState';

type Payload = {
  client: Client;
  userInfo: IUserInfo;
};

export default class PlayerUpdateInfoCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, userInfo } = data;
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;
    console.log(333333);
    const keys = Object.keys(userInfo);
    keys.forEach((key) => {
      console.log(99999, key, userInfo[key]);
      if (userInfo[key]) player.userInfo.set(key, userInfo[key]);
    });
  }
}
