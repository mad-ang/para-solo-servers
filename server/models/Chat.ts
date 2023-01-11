import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import mongoose from 'mongoose'
import { IChat } from '../controllers/ChatControllers/types'

const chat = new Schema<IChat>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
})


const Chat = model<IChatDocument>('chat', chat)
// export default class Chat {
//   chatroomId : string
//   chatSchema : Schema<IChat>
//   chat : Model<IChatDocument>
//   constructor(part1, part2){

//     this.makeChatRoomId(part1, part2)
//     this.chatSchema = chat
//     if (mongoose.modelNames().includes(this.chatroomId)) {
//       this.chat = mongoose.model(this.chatroomId)
//     }
//     else this.chat = model<IChatDocument>(this.chatroomId, this.chatSchema)
//   }

//   setChatRoomId(chatId : string){
//     this.chatroomId = chatId
//   }

//   makeChatRoomId(Id1 : string | undefined, Id2 : string | undefined){
//     if (Id1 == undefined || Id2 == undefined) return 
//     let id1 = Id1 > Id2? Id1 : Id2
//     let id2 = (id1 === Id1)? Id2 : Id1
    
//     let madeRoomId = id1 + '>' + id2
//     console.log(madeRoomId);
    
//     this.setChatRoomId(madeRoomId)
//   }
//   addChatMessage(message : {senderId : string, receiverId : string, content : string}){
//     let createAt = new Date()
//     const result = this.chat.collection.insertOne({
//       senderId: message.senderId,
//       receiverId: message.receiverId,
//       content: message.content,
//       createdAt:createAt
//     })
//   }
// }
// create new User document

export interface IChatDocument extends IChat, Document {}
export interface IChatModel extends Model<IChatDocument> {}
export default Chat