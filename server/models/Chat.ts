import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IChat } from '../controllers/ChatControllers/types'

const chat = new Schema<IChat>({
  from: String,
})

const Chat = model<IChatDocument>('chat', chat)
// create new User document

export interface IChatDocument extends IChat, Document {}
export interface IChatModel extends Model<IChatDocument> {}
export default Chat
