import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { IUserInfo } from '../../controllers/UserControllers/types';
import { ITownState } from '../../../types/ITownState';
import { MapSchema } from '@colyseus/schema';

type Payload = {
  client: Client;
  userInfo: IUserInfo;
};

export default class PlayerUpdateInfoCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, userInfo } = data;
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;
    let changed = false;
    const newInfomap = new MapSchema<string>();
    const keys = Object.keys(userInfo);
    keys.forEach((key: any) => {
      //@ts-ignore
      if (userInfo[key] && player?.userInfo[key] !== userInfo[key]) {
        changed = true;
        //@ts-ignore
        newInfomap.set(key, userInfo[key]);
      } else {
        //@ts-ignore
        newInfomap.set(key, player?.userInfo[key] || '');
      }
    });
    if (changed) player.userInfo = newInfomap;
  }
}
