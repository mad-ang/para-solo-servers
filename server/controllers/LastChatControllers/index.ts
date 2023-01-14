import Chat from '../../models/Chat';
import LastChat from '../../models/LastChat';
import { Request, Response } from 'express';

const time_diff = 9 * 60 * 60 * 1000;

export const loaddata = async (req : Request, res : Response) => {
  const user = req.body
  console.log("check post req");
  console.log(user);
  console.log("userId = ", user.userId)
  getLastChat(user.userId).then(result => {
    res.status(200).send(result)  
  }).catch(error => {
    console.error(error);
  })
}

export const firstdata = async (req: Request, res: Response) => {
  const user = req.body
  addLastChat({senderId: user.userId, receiverId: user.targetId, content: user.content})
}

export const LastChatControler = (message : {readerId: string, targetId: string, content: string}) => {
  const { readerId, targetId, content } = message;
  checkLast(readerId, targetId).then((res : number) => {
    if (res === 1) {
      updateLastChat({senderId: readerId, receiverId: targetId, content: content})
    }
  });
};

export const addLastChat = (message: { senderId: string; receiverId: string; content: string }) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  const result1 = LastChat.collection.insertOne({
    readerId: message.senderId,
    targetId: message.receiverId,
    content: message.content,
    unread: 0,
    updatedAt: createAt,
  });
  const result2 = LastChat.collection.insertOne({
    readerId: message.receiverId,
    targetId: message.senderId,
    content: message.content,
    unread: 1,
    updatedAt: createAt,
  });
  console.log('in addLastChatresult');
};

export const updateLastChat = async (message: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  const { senderId, receiverId, content } = message;
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  await LastChat.collection.findOneAndUpdate(
    { $and: [{ readerId: senderId }, { targetId: receiverId }] },
    { content: content, updatedAt: createAt }
  );
  let docs = await LastChat.collection.findOneAndUpdate(
    { $and: [{ readerId: receiverId }, { targetId: senderId }] },
    { content: content, updatedAt: createAt },
    { upsert: true }
  );
};

export const getLastChat = async (readerId: string) => {
  let result = new Array();
  try {
    await LastChat.collection
      .find({
        senderId: readerId,
      })
      .limit(20)
      .sort({ createAt: -1 })
      .toArray()
      .then((elem) => {
        elem.forEach((json) => {
          result.push(json);
        });
      });
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const checkLast  = async (readerId : string, targetId : string) => {
  await LastChat.collection
    .count({ $and: [{ readerId: readerId }, { targetId: targetId }] })
    .then((result) => {
      return result;
    }).catch((err) => {
      console.error(err)
      return 0;
    });
    return 0;
};
