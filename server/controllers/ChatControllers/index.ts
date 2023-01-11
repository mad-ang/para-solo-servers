import { config } from '../../envconfig';
import { Request, Response } from 'express';
import Chat from '../../models/Chat';
import { createCollection } from '../../DB/db';

export const createChat = () => {
  //   console.log(343434)
  //   const chat = new Chat({})
  //   chat.save()
};

export const addChatMessage = (message: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  let createAt = new Date();
  const result = Chat.collection.insertOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    createdAt: createAt,
  });
};

export const getChatMessage = (
  sender: string,
  recipient: string) => {
  let result = Chat.collection.find({
    $or: [
      { $and: [{ senderId: sender }, { receiverId: recipient }] },
      { $and: [{ senderId: recipient }, { receiverId: sender }] },
    ]
  })
  .sort({ _id: -1 })
  console.log(result);
  return result
}
