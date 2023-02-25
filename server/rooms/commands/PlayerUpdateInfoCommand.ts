import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { IUserInfo, IUserProfile } from '../../controllers/UserControllers/types';
import { ITownState } from '../../../types/ITownState';
import { MapSchema } from '@colyseus/schema';

type Payload = {
  client: Client;
  userProfile: IUserProfile;
};

export default class PlayerUpdateInfoCommand extends Command<ITownState, Payload> {
  execute(data: Payload) {
    const { client, userProfile } = data;
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;
    let changed = false;
    if (!userProfile) {
      player.userProfile = player.userProfile;
      return;
    }
    const newInfomap = new MapSchema<string>();
    const keys = Object.keys(userProfile);
    keys.forEach((key: string) => {
      if (
        userProfile[key as string] &&
        player.userProfile.get(key) !== userProfile[key as string]
      ) {
        changed = true;
        newInfomap.set(key as string, userProfile[key as string] || '');
      } else {
        newInfomap.set(key as string, player?.userProfile.get(key) || '');
      }
    });
    if (changed) player.userProfile = newInfomap;
  }
}
