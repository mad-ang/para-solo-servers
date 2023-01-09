import http from 'http'
import express from 'express'
import { ExpressPeerServer, PeerServer } from 'peer'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'
import roomRouter from './routes/room'
import authRouter from './routes/auth'
// import { sequelize } from './DB/db'
import { config } from './envconfig'
// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/Momstown'
import { connectDB } from './DB/db'

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

// require('./models/index')

const server = http.createServer(app)
// const peerServer = ExpressPeerServer(server, {
//   path : '/peerServer'
// })
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: '전민동에 들어가기전',
  description: '동네 친구들을 만나보세요',
  password: null,
  autoDispose: false,
})
gameServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())
app.use('/auth', authRouter)

connectDB()
  .then((db) => {
    // console.log('init!', db)
    gameServer.listen(port)
    // db.collection('users').insertOne({ 이름: 'John', _id: 100 }, function (에러, 결과) {
    //   console.log('저장완료')
    // })
    console.log(`Listening on ws://localhost:${port}`)
  })
  .catch(console.error)
