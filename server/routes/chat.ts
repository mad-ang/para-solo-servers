import express from 'express'
import { chatController } from '../controllers/ChatControllers'
import { loaddata } from '../controllers/LastChatControl'

const router = express.Router()

// router.get('/chat', chatController)
router.post('/roomList', loaddata)

export default router
