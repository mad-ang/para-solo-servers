import express from 'express'
import fs from 'fs'

// const userDB = JSON.parse(fs.readFileSync(`${__dirname}/DB/rooms.json`, 'utf-8'))

const router = express.Router()
let userCnt = 0
router.post('/increase_users_cnt', (req, res) => {
  const { roomId } = req.body
  userCnt += 1

  console.log('set user_cnt', userCnt)
  res.status(200).json({
    userCnt: userCnt,
  })
})

router.post('/decrease_users_cnt', (req, res) => {
  userCnt -= 1

  console.log('set user_cnt', userCnt)
  res.status(200).json({
    userCnt: userCnt,
  })
})

router.get('/get_users_cnt', (req, res) => {
  res.status(200).json({
    userCnt: userCnt,
  })
})

export default router
