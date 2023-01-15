import Chat from '../../models/Chat';
import LastChat from '../../models/LastChat';
import { UserResponseDto, IChatRoomStatus } from './type';
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

  addLastChat({
    myInfo: user.myInfo,
    friendInfo: user.friendInfo,
    status: user.status,
    message: user.message,
  })
    .then((result) => {
      console.log(result);
      if (result) res.status(200).send('add frieds');
      else res.status(200).send('already exist');
    })
    .catch((err) => {
      console.error(err);
    });
};

export const LastChatControler = async (obj: {
  myId: string;
  friendId: string;
  message: string;
}) => {
  const { myId, friendId, message } = obj;
  checkLast(myId, friendId).then((res) => {
    if (res) {
      updateLastChat({ myId, friendId, message });
    }
  });
};

export const addLastChat = async (obj: {
  myInfo: UserResponseDto;
  friendInfo: UserResponseDto;
  status: IChatRoomStatus;
  message: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;

  const res = await checkLast(obj.myInfo.userId, obj.friendInfo.userId);
  try {
    if (res) return false;
    LastChat.collection.insertOne({
      myInfo: obj.myInfo,
      friendInfo: obj.friendInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unread: 0,
      updatedAt: createAt,
    });
    LastChat.collection.insertOne({
      myInfo: obj.friendInfo,
      friendInfo: obj.myInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unread: 1,
      updatedAt: createAt,
    });

    console.log('in addLastChatresult');
    return true;
  } catch (err) {
    console.error(err);
  }
};

export const updateLastChat = async (obj: { myId: string; friendId: string; message: string }) => {
  const { myId, friendId, message } = obj;
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  await LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { message: message, updatedAt: createAt } }
  );
  let docs = await LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { message: message, updatedAt: createAt }, $inc: { unreadCount: 1 } }
  );
  docs.value?.set();
};

export const updateRoomId = async (obj: { myId: string; friendId: string; roomId: string }) => {
  const { myId, friendId, roomId } = obj;
  await LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { roomId: roomId } }
  );
  await LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { roomId: roomId } }
  );
};

export const getLastChat = async (myId: string) => {
  let result = new Array();
  try {
    await LastChat.collection
      .find({
        myInfo: { userId: myId },
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

export const checkLast = async (myId: string, friendId: string) => {
  try {
    const res = await LastChat.collection.count({
      $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }],
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};
