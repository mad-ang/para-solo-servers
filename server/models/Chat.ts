import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IChat } from '../controllers/ChatControllers/types'

const chat = new Schema<IChat>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
})

const Chat = model<IChatDocument>('chat', chat)
// create new User document

export interface IChatDocument extends IChat, Document {}
export interface IChatModel extends Model<IChatDocument> {}
export default Chat
