import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema';
// import { User } from '../server/rooms/schema/TownState';

export interface IPlayer extends Schema {
  name: string;
  x: number;
  y: number;
  anim: string;
  readyToConnect: boolean;
  videoConnected: boolean;
  userId: string;
  userInfo: MapSchema<string>;
  userProfile: MapSchema<string>;
}
export interface IChair extends Schema {
  occupied: boolean;
  clientId: string;
}
export interface ITable extends Schema {
  connectedUser: SetSchema<string>;
  containedChairs: MapSchema<IChair>;
}
export interface IChatMessage extends Schema {
  author: string;
  createdAt: number;
  content: string;
}

export interface ITownState extends Schema {
  players: MapSchema<IPlayer>;
  chatMessages: ArraySchema<IChatMessage>;
  tables: MapSchema<ITable>;
  chairs: MapSchema<IChair>;
}
