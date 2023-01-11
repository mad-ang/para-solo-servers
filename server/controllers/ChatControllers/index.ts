import { config } from '../../envconfig';
import { Request, Response } from 'express';
import Chat from '../../models/Chat';
import { createCollection } from '../../DB/db';

export const createChat = () => {
  //   console.log(343434)
  //   const chat = new Chat({})
  //   chat.save()
};
const time_diff = 9 * 60 * 60 * 1000;

export const addChatMessage = (message: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = new Date(utc + time_diff);
  const result = Chat.collection.insertOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    createdAt: createAt,
  });
  console.log('in addChatresult', createAt);
};

export const getChatMessage = async (sender: string, recipient: string) => {
  let result = new Array();
  await Chat.collection
    .find({
      $or: [
        { $and: [{ senderId: sender }, { receiverId: recipient }] },
        { $and: [{ senderId: recipient }, { receiverId: sender }] },
      ],
    })
    .limit(100)
    .sort({ _id: -1 })
    .toArray()
    .then((elem) => {
      elem.forEach((json) => {
        result.push(json);
      });
    });
  return result;
};
