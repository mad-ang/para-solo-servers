import express from 'express';
import 'express-async-errors';
import { signUp, login, updateUser, inquireUser, deleteUser } from '../controllers/UserControllers';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.patch('/update', updateUser);

router.get('/me', inquireUser);

router.delete('/delete', deleteUser);

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  });
});

export default router;
