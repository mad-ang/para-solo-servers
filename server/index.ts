import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server, LobbyRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import { RoomType } from '../types/Rooms';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
// import { sequelize } from './DB/db'
import { config } from './envconfig';
// import socialRoutes from "@colyseus/social/express"
import 'express-async-errors';

import { SkyOffice } from './rooms/Momstown';
import { connectDB, createCollection } from './DB/db';
const mongoose = require('mongoose');

const port = Number(process.env.PORT || 2567);
// const socketPort = Number(process.env.SOCKET_PORT || 5002);
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static('dist'))

// require('./models/index')
const server = http.createServer(app);
// const peerServer = ExpressPeerServer(server, {
//   path : '/peerServer'
// })
const gameServer = new Server({
  server,
});

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom);
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: '전민동에 들어가기전',
  description: '동네 친구들을 만나보세요',
  password: null,
  autoDispose: false,
});
gameServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing();

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
// app.use('/colyseus', monitor())
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  });
});

connectDB()
  .then((db) => {
    // console.log('init!', db)
    gameServer.listen(port);

    console.log(`Listening on ws://localhost:${port}`);
  })
  .catch(console.error);

// const socketServer = http.createServer(app);
// const io = require('socket.io')(socketServer, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });
// io.on('connection', (socket) => {
//   console.log(111111);
//   socket.on('join', async (gameId) => {
//     console.log(222222);
//   });
//   socket.on('message', (message) => {
//     console.log(333333);
//   });
// });

// io.of('/chat-id').on('connection', (socket) => {
//   console.log('chat id에 접속');
//   socket.on('chatId', async (senderId) => {
//     console.log('보내는 사람 아이디', senderId);
//   });
//   socket.on('message', (message) => {
//     console.log('메시지 내용', message);
//   });
// });

// socketServer.listen(socketPort, () => console.log(`socketServer is running on ${socketPort}`));
