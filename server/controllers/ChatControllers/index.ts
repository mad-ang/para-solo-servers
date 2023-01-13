import { config } from '../../envconfig';
import { Request, Response } from 'express';
import Chat from '../../models/Chat';
import { createCollection } from '../../DB/db';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

const rooms: Record<string, string[]> = {};
interface IRoomParams {
  roomId: string;
  host: string;
  guest: string;
}
const time_diff = 9 * 60 * 60 * 1000;

export const chatHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit('room-created', { roomId });
    console.log('chatroom[', roomId, '] created.');
  };
  const joinRoom = ({ roomId, host }: IRoomParams) => {
    if (rooms[roomId]) {
      console.log('user Joined the room.', roomId, host);
      rooms[roomId].push(host);
      socket.to(roomId).emit('user-joined', { host });
      socket.join(roomId);
      socket.emit('get-users', { roomId, participants: rooms[roomId] });
    }

    socket.on('disconnect', () => {
      console.log('user left the room', host);
      // leaveRoom({roomId, host});
    });
  };

  const leaveRoom = ({ roomId, host }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== host);
    socket.to(roomId).emit('user-disconnected', host);
  };
  const startChat = ({ roomId, host }: IRoomParams) => {
    socket.to(roomId).emit('uesr-started-caht', host);
  };
  const stopChat = (roomId: string) => {
    socket.to(roomId).emit('user-stopped-chat');
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startChat);
  socket.on("stop-sharing", stopChat);
};

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
