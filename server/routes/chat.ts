import express from 'express'
import { firstdata, loaddata } from '../controllers/LastChatControllers'

const router = express.Router()

// router.get('/chat', chatController)
router.post('/roomList', loaddata)
router.post('/addFriend', firstdata)

export default router
