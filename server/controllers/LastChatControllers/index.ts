import Chat from '../../models/Chat';
import { userMap } from '../..';
import LastChat from '../../models/LastChat';
import { UserResponseDto, IChatRoomStatus } from './type';
import { Request, Response } from 'express';
import User from '../../models/User';

const time_diff = 9 * 60 * 60 * 1000;

export const loaddata = async (req: Request, res: Response) => {
  const user = req.body;

  if (!user.userId)
    return res.status(404).json({
      status: 404,
      message: 'not found',
    });

  getLastChat(user.userId)
    .then((result) => {
      res.status(200).json({
        status: 200,
        payload: result,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: '서버 오류',
      });
    });
};

export const firstdata = async (req: Request, res: Response) => {
  console.log('???????');
  try {
    const user = req.body;
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'not found',
      });
    }
    if (!(user.myInfo && user.friendInfo && user.message)) {
      return res.status(400).json({
        status: 400,
        message: 'invalid input',
      });
    }
    /*예외처리*/
    const userId = user.myInfo.userId;
    // DB에서 이 유저의 userCoin을 찾아온다
    const foundUser = await User.findOne({
      userId: userId,
    });
    if (!foundUser || foundUser?.userCoin === undefined) {
      return res.status(400).json({
        status: 400,
        message: '유효한 사용자가 아닙니다.',
      });
    }

    const alreadyFriend = await checkLast(user.myInfo.userId, user.friendInfo.userId);
    console.log(alreadyFriend, 'alreadyFriend???????????');
    if (alreadyFriend) {
      // 이미 친구였다면
      return res.status(200).json({
        status: 409,
        message: '이미 친구입니다.',
      });
    }

    // 새로운 친구요청

    // 만약에 유저코인이 0이면 리턴 404
    if (foundUser!.userCoin <= 0) {
      return res.status(200).json({
        status: 404,
        message: '코인이 부족합니다.',
      });
    }

    const result = await addLastChat({
      myInfo: user.myInfo,
      friendInfo: user.friendInfo,
      status: user.status,
      message: user.message,
    });

    if (!result) {
      // 친구맺기 실패 -> 다양한 이유를 포괄하도록 해야 함
      return res.status(200).json({
        status: 404,
        message: '친구맺기 실패',
      });
    }

    User.collection.updateOne(
      { userId: userId },
      {
        $inc: {
          userCoin: -1,
        },
      }
    );
    console.log('emit한다!', user.myInfo, user.friendInfo);
    userMap.get(user.friendInfo.userId)?.emit('request-friend', user.myInfo as any);
    console.log('emit 완료')
    return res.status(200).json({
      status: 200,
      payload: {
        myInfo: user.myInfo,
        friendInfo: user.friendInfo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: `서버 오류: ${error}`,
    });
  }
};

export const chargingCoin = async (req: Request, res: Response) => {
  // 유효성검사 필요할 듯
  const user = req.body;
  const userId = user.myInfo.userId; // DB에서 이 유저의 userCoin을 찾아온다

  const foundUser = await User.findOne({
    userId: userId,
  })
    .then(async () => {
      //코인충전 3개
      User.collection.updateOne(
        { userId: userId },
        {
          $inc: {
            userCoin: 100,
          },
        }
      );
      res.status(200).json({
        status: 200,
        message: '코인이 충전되었습니다',
        payload: {
          myInfo: user.myInfo,
          friendInfo: user.friendInfo,
        },
      });
    })
    .catch((err) => {
      //에러
      console.error(err);
      res.status(500).json({
        status: 500,
        message: `서버 오류: ${err}`,
      });
    });
};

export const setfriend = async (req: Request, res: Response) => {
  const { myInfo, friendInfo, isAccept } = req.body;
  if (!myInfo || !friendInfo) return res.status(404).send('not found');

  acceptFriend({ myId: myInfo.userId, friendId: friendInfo.userId, isAccept: isAccept }).then(
    (resultStatus) => {
      res.status(200).json({
        status: 200,
        payload: {
          resultStatus: resultStatus,
          myInfo: myInfo,
          friendInfo: friendInfo,
        },
      });

      console.log('setfriend => accept-friend emit ', myInfo.username);

      //for alarm
      userMap.get(friendInfo.userId)?.emit('accept-friend', myInfo.username);
      // res.status(200).send(resultStatus)
    }
  );
};
const addLastChat = async (obj: {
  myInfo: UserResponseDto;
  friendInfo: UserResponseDto;
  status: IChatRoomStatus;
  message: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  if (obj.myInfo.userId === obj.friendInfo.userId) return false;
  const alreadyFriend = await checkLast(obj.myInfo.userId, obj.friendInfo.userId);

  try {
    if (alreadyFriend) {
      return false;
    }

    console.log('오면 안됨!!!!');
    // 이제 처음 친구 요청한 경우
    LastChat.collection.insertOne({
      myInfo: obj.myInfo,
      friendInfo: obj.friendInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unreadCount: 0,
      updatedAt: createAt,
    });
    LastChat.collection.insertOne({
      myInfo: obj.friendInfo,
      friendInfo: obj.myInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unreadCount: 1,
      updatedAt: createAt,
    });

    console.log('in addLastChatresult');
    return true;
  } catch (err) {
    console.error(err);
  }
};

const acceptFriend = async (obj: { myId: string; friendId: string; isAccept: number }) => {
  const { myId, friendId, isAccept } = obj;
  let status = IChatRoomStatus.SOCKET_OFF;
  if (!isAccept) {
    status = IChatRoomStatus.REJECTED;
  }
  await updateRoomStatus({ myId, friendId, status, isAccept });
  return status;
};

export const updateRoomStatus = async (obj: {
  myId: string;
  friendId: string;
  status: IChatRoomStatus;
  isAccept: number;
}) => {
  const { myId, friendId, status, isAccept } = obj;

  if (!isAccept) {
    LastChat.collection.deleteOne({
      $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }],
    });
    LastChat.collection.deleteOne({
      $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }],
    });

    return;
  }

  updateUnread({ myId: myId, friendId: friendId }, 0);

  LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { status: status } }
  );
  LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { status: status } }
  );
};

export const updateRoomImg = async (userId: string, profileImgUrl: string) => {
  await LastChat.collection.findAndModify(
    { 'friendInfo.userId': userId },
    { $set: { 'friendInfo.profileImgUrl': profileImgUrl } }
  );
  await LastChat.collection.findAndModify(
    { 'myInfo.userId': userId },
    { $set: { 'myInfo.profileImgUrl': profileImgUrl } }
  );
};

const deleteChatRoom = async (obj: { myId: string; friendId: string }) => {
  const { myId, friendId } = obj;
  let docs = await LastChat.collection.findOne({
    $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }],
  });
  // 삭제한 상대방에게 상대방이 채팅방에서 나갔음을 알림.
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
};

export const updateRoomId = async (obj: { myId: string; friendId: string; roomId: string }) => {
  const { myId, friendId, roomId } = obj;

  LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { roomId: roomId, unreadCount: 0 } }
  );
  LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { roomId: roomId } }
  );
};

export const updateUnread = async (
  obj: {
    myId: string;
    friendId: string;
  },
  targetCnt: number = 0
) => {
  const { myId, friendId } = obj;

  LastChat.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { unreadCount: targetCnt } }
  );
};

export const getLastChat = async (myId: string) => {
  let result = new Array();
  try {
    await LastChat.collection
      .find({ 'myInfo.userId': myId })
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

    console.log('이미 친구인가??', res);
    return res;
  } catch (err) {
    console.error(err);
  }
};
