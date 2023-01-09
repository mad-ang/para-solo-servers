import express from 'express'
//... for dm route

const router = express.Router()

router.get('/get:id', (req, res) => {
  const { id } = req.params
  const { senderId, receiverId, contents, createdAt } = req.body
  res.status(200).json({
    id,
    senderId,
    receiverId,
    contents,
    createdAt,
  })
})

router.post('/post:id', (req, res) => {
    const { id } = req.params
    const { senderId, receiverId, contents, createdAt } = req.body
    res.status(200).json({
        id,
        senderId,
        receiverId,
        contents,
        createdAt,
    })
})

router.patch('/update:id', (req, res) => {
})

export default router
