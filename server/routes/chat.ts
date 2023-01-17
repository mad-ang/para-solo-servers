import express from 'express';
import { firstdata, loaddata, setfriend } from '../controllers/LastChatControllers';

const router = express.Router();

// router.get('/chat', chatController)
router.post('/roomList', loaddata);
router.post('/addFriend', firstdata);
router.post('/acceptFriend', setfriend);

export default router;
