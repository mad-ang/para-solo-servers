import Chat from '../../models/Chat';
import LastChat from '../../models/LastChat';
import { Request, Response } from 'express';

const time_diff = 9 * 60 * 60 * 1000;

export const loaddata = async (req: Request, res: Response) => {
  const user = req.body;
  console.log('check post req');
  console.log(user);
  console.log('userId = ', user.userId);
  getLastChat(user.userId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const firstdata = async (req: Request, res: Response) => {
  const user = req.body;
  console.log(user);
  let result: boolean[] = [];
  result.push(true);
  await addLastChat(
    { senderId: user.userId, receiverId: user.receiverId, content: user.content },
    result
  ).then(() => {
    console.log(result[0]);
    if (result[0]) res.status(200).send('add frieds');
    else res.status(200).send('already exist');
  });
};

export const LastChatControler = async (message: {
  readerId: string;
  targetId: string;
  content: string;
}) => {
  const { readerId, targetId, content } = message;
  let result: boolean[] = [];
  result.push(true);
  checkLast(readerId, targetId, result).then(() => {
    if (result) {
      updateLastChat({ senderId: readerId, receiverId: targetId, content: content });
    }
  });
};

export const addLastChat = async (
  message: { senderId: string; receiverId: string; content: string },
  result: boolean[]
) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  checkLast(message.senderId, message.receiverId, result).then(() => {
    console.log('in addLastChat', result[0]);

    if (!result[0]) return;
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
  });
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
        readerId: readerId,
      })
      .limit(20)
      .sort({ _id: -1 })
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

export const checkLast = async (readerId: string, targetId: string, result: boolean[]) => {
  await LastChat.collection
    .count({ $and: [{ readerId: readerId }, { targetId: targetId }] })
    .then((cnt) => {
      console.log("cnt", cnt);
      
      console.log("in cnt", result);
      if (cnt > 0) result[0] = false;
    })
    .catch((err) => {
      console.error(err);
    })
    .then(() => {
      return -1;
    });
};
