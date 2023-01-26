import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server, LobbyRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import { RoomType } from '../types/Rooms';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import imageRouter from './routes/image';
const fs = require('fs');
// import { sequelize } from './DB/db'
import { config } from './envconfig';
// import socialRoutes from "@colyseus/social/express"
import 'express-async-errors';

import { SkyOffice } from './rooms/Momstown';
import { connectDB, createCollection } from './DB/db';
import { chatController } from './controllers/ChatControllers';
import { Socket } from 'socket.io';
import S3 from './s3';
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const port = Number(process.env.PORT || 8080);
const socketPort = Number(process.env.SOCKET_PORT || 5002);
const app = express();
app.get('/', (req, res) => {
  res.json({ message: `Server is running on ${req.secure ? 'HTTPS' : 'HTTP'}` });
});
app.use(cookieParser());

const allowedOrigins = [
  'https://parasolo-so.link/',
  'https://www.parasolo-so.link/',
  'https://www.momstown.site',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5173',
  'http://localhost:5174',
];

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'authorization',
    '*',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: allowedOrigins,
  preflightContinue: false,
};

app.use(cors(options));
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
app.use('/image', imageRouter);

connectDB()
  .then((db) => {
    gameServer.listen(port);

    console.log(`Listening on ws://localhost:${port}`);
  })
  .catch(console.error);

// const certOptions = {
//   key: fs.readFileSync('./keys/rootca.key'),
//   cert: fs.readFileSync('./keys/rootca.crt'),
// };

const socketServer = http.createServer(app);
socketServer.listen(socketPort, () => console.log(`socketServer is running on ${socketPort}`));
export const io = require('socket.io')(socketServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

export const userMap = new Map<string, Socket>();

io.on('connection', (socket: Socket) => {
  console.log('here comes new challenger !!', socket.id);
  socket.on('whoAmI', (userId) => {
    console.log('whoAmI');

    userMap.set(userId, socket);
  });
  chatController(socket);
  socket.on('disconnect', () => {
    console.log('the challenger disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

S3.init();

app.use((err, res) => {
  console.error(err);
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  });
});
