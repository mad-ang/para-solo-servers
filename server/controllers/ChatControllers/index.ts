import Chat from '../../models/Chat';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

const rooms: Record<string, string[]> = {};
const rooms_chat: Record<string, Array<Object>> = {};
interface IRoomParams {
  roomId: string;
  hostId: string;
  guestId: string;
}

const time_diff = 9 * 60 * 60 * 1000;

export const chatController = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    rooms_chat[roomId] = [];
    // socket.emit('room-created', { roomId });
    console.log('chatroom[', roomId, '] created.');
    return roomId;
  };
  const joinRoom = (host: { hostId: string; guestId: string }) => {
    const { hostId, guestId } = host;
    const roomId = createRoom();
    if (rooms[roomId]) {
      console.log('user Joined the room.', roomId, host);
      rooms[roomId].push(host.hostId);
      socket.to(roomId).emit('get-roomId', { roomId });
      socket.join(roomId);
      // socket.emit('get-users', { roomId, participants: rooms[roomId] });
    }
    socket.on('disconnect', () => {
      console.log('user left the room', host);
      leaveRoom({ roomId, hostId, guestId });
    });
  };

  const leaveRoom = ({ roomId, hostId, guestId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== hostId);
    socket.to(roomId).emit('user-disconnected', hostId);
  };
  const startChat = ({ roomId, hostId, guestId }: IRoomParams) => {
    socket.to(roomId).emit('uesr-started-caht', hostId);
  };
  const stopChat = (roomId: string) => {
    socket.to(roomId).emit('user-stopped-chat');
  };

  const sendMessage = (message: {
    roomId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => {
    const { roomId, senderId, receiverId, content } = message;
    rooms_chat[roomId].push(message);
    addChatMessage({ senderId: senderId, receiverId: receiverId, content: content });
    // LastChat.
    socket.to(roomId).emit('add-message', message);
  };
  // room이 살아 있을 경우.
  // Array를 만들고 거기에 푸쉬. Array를 만들어서 룸 데이터로 가지고 있는다.
  // 메시지를 읽으려 할때 그 array를 리턴.
  // room에 처음 참여하는 경우는 db에서 불러온 값을 그대로 보여줌.
  const readMessage = (message: { roomId: string; requestId: string; targetId: string }) => {
    const { roomId, requestId, targetId } = message;
    // let clientId = String(this.state.players.get(client.sessionId)?.userId)
    // let otherId = String(this.state.players.get(message.senderId)?.userId)
    // let chatMessage = await getChatMessage(requestId, targetId);
    // console.log(chatMessage);
    if (rooms_chat[roomId]) {
      socket.to(roomId).emit('check-private-message', rooms_chat[roomId]);
    } else {
      getChatMessage(requestId, targetId)
        .then((chatMessage) => {
          console.log(chatMessage);
          rooms_chat[roomId] = chatMessage;
          socket.to(roomId).emit('check-private-message', rooms_chat[roomId]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // socket.on("create-room", createRoom);
  socket.on('join-room', joinRoom);
  socket.on('start-chat', startChat);
  socket.on('stop-chat', stopChat);
  socket.on('send-meesage', sendMessage);
  socket.on('read-message', readMessage);
};

export const addChatMessage = (message: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
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
