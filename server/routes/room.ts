import express from 'express'
import fs from 'fs'

// const userDB = JSON.parse(fs.readFileSync(`${__dirname}/../../DB/rooms.json`, 'utf-8'))

const router = express.Router()

router.post('/increase_users_cnt', (req, res) => {
  const { roomId } = req.body

  // console.log('before userDB', userDB)
  if (!roomId) {
    res.status(404).json({ error: 'roomid not found' })
    return
  }

  let newUserCnt = 1
  // if (!userDB.rooms[roomId]) {
  //   userDB.rooms[roomId] = {
  //     userCnt: newUserCnt,
  //   }
  // } else {
  //   newUserCnt = userDB.rooms[roomId].userCnt + 1
  //   userDB.rooms[roomId].userCnt = newUserCnt
  // }
  // console.log('after userDB', userDB)
  res.status(200).json({
    userCnt: newUserCnt,
  })
})

router.post('/decrease_users_cnt', (req, res) => {
  const { roomId } = req.body
  // if (!roomId || !userDB.rooms[roomId]) {
  //   res.status(404).json({ error: 'roomid not found' })
  //   return
  // }
  // console.log('before userDB', userDB)
  // const newUserCnt = userDB.rooms[roomId].userCnt - 1

  // userDB.rooms[roomId].userCnt = newUserCnt
  // if (userDB.rooms[roomId].userCnt === 0) {
  //   delete userDB.rooms[roomId]
  // }
  // console.log('after userDB', userDB)
  // res.status(200).json({
  //   userCnt: newUserCnt,
  // })
})

router.get('/get_users_cnt/:id', (req, res) => {
  const roomId = req.params.id
  // if (!roomId || !userDB.rooms[roomId]) {
  //   res.status(404).json({ error: 'roomid not found' })
  //   return
  // }

  // res.status(200).json({
  //   userCnt: userDB.rooms[roomId].userCnt,
  // })
})

export default router
