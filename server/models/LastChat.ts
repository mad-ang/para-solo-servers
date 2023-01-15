import { IUser } from 'colyseus.js/lib/Auth';
import { Schema, model, Document, Model } from 'mongoose';
import { ILastChat, UserResponseDto } from '../controllers/LastChatControllers/type';

const URD = new Schema<UserResponseDto>();

const lastchat = new Schema<ILastChat>({
  myInfo: {
    userId: String,
    username: String,
    profileImgUrl: String,
  },
  friendInfo: {
    userId: String,
    username: String,
    profileImgUrl: String,
  },
  message: { type: String, required: false },
  status: { type: Number, required: true },
  roomId: { type: String, required: false },
  unreadCount: { type: Number, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const LastChat = model<ILastChat>('lastchat', lastchat);
// create new User document

export interface ILastChatDocument extends ILastChat, Document {}
export interface ILastChatModel extends Model<ILastChatDocument> {}
export default LastChat;
