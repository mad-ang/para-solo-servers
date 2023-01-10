import express from 'express';
import { signUp, login, updateUser, inquireUser, deleteUser } from '../controllers/UserControllers';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.patch('/update', updateUser);

router.get('/me', inquireUser);

router.delete('/delete', deleteUser);

export default router;
