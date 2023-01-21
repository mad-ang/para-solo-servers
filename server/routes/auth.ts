import express from 'express';
import 'express-async-errors';
import {
  signUp,
  login,
  updateUserWithAuth,
  inquireUser,
  deleteUser,
  authenticateUser,
  issueAccessToken,
} from '../controllers/UserControllers';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.patch('/update', updateUserWithAuth);

router.get('/me', inquireUser);

router.get('/isAuth', authenticateUser);

router.post('/issueAccessToken', issueAccessToken);

router.delete('/delete', deleteUser);

router.use((err, res) => {
  console.error(err);
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  });
});

export default router;
