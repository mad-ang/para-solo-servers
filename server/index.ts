import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'

// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/SkyOffice'

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

let userCnt = 0

app.post('/api/post/increase_user_cnt', (req, res) => {
  userCnt += 1

  console.log('set user_cnt', userCnt)
  res.status(200).json({
    userCnt: userCnt,
  })
})

app.post('/api/post/decrease_user_cnt', (req, res) => {
  userCnt -= 1

  console.log('set user_cnt', userCnt)
  res.status(200).json({
    userCnt: userCnt,
  })
})

app.get('/api/get/get_user_cnt', (req, res) => {
  res.status(200).json({
    userCnt: userCnt,
  })
})

const server = http.createServer(app)
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

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
