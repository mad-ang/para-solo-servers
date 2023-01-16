import express from 'express'
import { firstdata, loaddata } from '../controllers/LastChatControllers'
import { requestRoom } from '../controllers/ChatControllers'

const router = express.Router()

// router.get('/chat', chatController)
router.post('/roomList', loaddata)
router.post('/joinRoom', requestRoom)
router.post('/addFriend', firstdata)

export default router
