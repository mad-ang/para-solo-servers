import express from 'express'
import { createChat } from '../controllers/ChatControllers'

const router = express.Router()

router.get('/chat', createChat)

export default router
