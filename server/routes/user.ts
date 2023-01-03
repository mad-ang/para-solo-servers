import express from 'express'

const router = express.Router()
let userCnt = 0
router.post('/increase_users_cnt', (req, res) => {
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
