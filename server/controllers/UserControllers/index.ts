const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { config } from '../../envconfig';
const AUTH_ERROR = { message: '사용자 인증 오류' };

import { IUserInfo } from './types';
import { Request, Response } from 'express';
import { Token } from './types';
import User from '../../models/User';
import 'express-async-errors';

async function hashPassword(user: IUserInfo) {
  const password = user.password;
  const saltRounds = config.bcrypt.saltRounds;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err: any, hash: any) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

export const signUp = async (req: Request, res: Response) => {
  const user = req.body;

  if (!user.userId) {
    return res.status(400).json({
      status: 400,
      message: '사용하실 아이디를 입력해주세요.',
    });
  }
  if (!user.password) {
    return res.status(400).json({
      status: 400,
      message: '사용하실 비밀번호를 입력해주세요.',
    });
  }

  const foundUser = await User.findOne({ userId: user.userId });
  if (foundUser) {
    return res.status(409).json({
      status: 409,
      message: '이미 존재하는 아이디입니다.',
    });
  }

  user.password = await hashPassword(user);
  const result = await User.collection.insertOne({
    userId: user.userId,
    password: user.password,
    createdAt: new Date(),
  });
  if (!result) {
    return res.json({ success: false, message: '회원가입 실패' });
  }
  return res.status(200).json({
    status: 200,
    payload: {
      userId: user.userId,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  // * Validate user input
  if (!req.body.userId) {
    return res.status(400).json({
      status: 400,
      message: '아이디를 입력해주세요.',
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      status: 400,
      message: '비밀번호를 입력해주세요.',
    });
  }
  const { userId, password } = req.body;

  const foundUser = await User.findOne({ userId: userId });
  if (!foundUser) {
    return res.status(400).json({
      status: 400,
      message: '아이디를 확인해주세요.',
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
  if (isPasswordCorrect) {
    const accessToken = jwt.sign(
      {
        userId: foundUser.userId,
        username: foundUser.username,
      },
      config.jwt.secretKey
      // {
      //   expiresIn: config.jwt.expiresInSec,
      // }
    );

    const refreshToken = 'refreshToken';
    await User.collection.updateOne(
      { userId: foundUser.userId },
      {
        $set: {
          refreshToken: 'refreshToken',
          lastUpdated: new Date(),
        },
      }
    );

    res.cookie('refreshToken', refreshToken, { path: '/', secure: true });
    res.status(200).json({
      status: 200,
      payload: {
        userId: foundUser.userId,
        accessToken: accessToken,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: '비밀번호가 올바르지 않습니다.',
    });
  }
};

const isAuth = async (req: Request, res: Response): Promise<any> => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader?.startsWith('Bearer '))) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  // 사용자가 주장하는 본인의 토큰 -> id, isAdmin값이 진실인지 아직 모름(위조되었을 수도?)

  return jwt.verify(token, config.jwt.secretKey, async (error: any, decoded: Token) => {
    // secretKey로 디코딩 및 검증
    if (error) return false;
    return decoded;
  });
};

export const authenticateUser = async (req: Request, res: Response): Promise<any> => {
  const decoded = await isAuth(req, res);
  const userId = decoded.userId;
  const foundUser = await User.findOne({ userId: userId });
  if (!foundUser) return res.status(401).json(AUTH_ERROR);
  return res.status(200).json({
    status: 200,
    payload: {
      userId: userId,
    },
  });
};

export const updateUser = async (userId: string, userinfo: IUserInfo) => {
  User.collection
    .updateOne(
      { userId: userId },
      {
        $set: { userProfile: userinfo },
      }
    )
    .then(() => {
      console.log('successfully updated');
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const updateUserWithAuth = async (req: Request, res: Response) => {
  const decoded = await isAuth(req, res);
  if (!decoded) return res.status(401).json(AUTH_ERROR);

  const previousUserId = decoded.userId;

  const newUserData = req.body;

  if (newUserData.password) {
    newUserData.password = await hashPassword(newUserData);
  }
  newUserData.lastUpdated = new Date();

  User.collection
    .updateOne(
      { userId: previousUserId },
      {
        $set: newUserData,
      }
    )
    .then(() => {
      if (newUserData.password) {
        delete newUserData.password;
      }
      return res.status(200).json({
        status: 200,
        payload: newUserData,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 404,
        message: '사용자 정보 변경에 실패했습니다.',
      });
    });
};

export const inquireUser = async (req: Request, res: Response) => {
  const decoded = await isAuth(req, res);
  if (!decoded) return res.status(401).json(AUTH_ERROR);
  const userId = decoded.userId;
  const foundUser = await User.findOne({ userId: userId });

  if (foundUser) {
    return res.status(200).json({
      status: 200,
      payload: {
        userId: foundUser.userId,
        username: foundUser.username,
        // profileImgUrl: foundUser.profileImgUrl,
      },
    });
  }
  return res.status(404).json({
    status: 404,
    message: '조회에 실패했습니다.',
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const decoded = await isAuth(req, res);
  if (!decoded) return res.status(401).json(AUTH_ERROR);

  const previousUserId = decoded.userId;

  User.collection
    .deleteOne({ userId: previousUserId })
    .then(() => {
      return res.status(200).json({
        status: 200,
        payload: {
          userId: previousUserId,
        },
      });
    })
    .catch(function (error) {
      return res.status(404).json({
        status: 404,
        message: '삭제에 실패했습니다.',
      });
    });
};

export const lookupUser = async (req: Request, res: Response) => {
  const user = req.body;
  const result = [];
  // User.collection.findOne().then((uesr)=>{
  //   result.push(user.userId)
  // })
};
