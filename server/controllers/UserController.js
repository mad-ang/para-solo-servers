const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
import { config } from '../envconfig'
const User = db.users

async function hashPassword(user) {
  const password = user.password
  const saltRounds = config.bcrypt.saltRounds

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return hashedPassword
}

export const signUp = async (req, res) => {
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }

  userInfo.password = await hashPassword(userInfo)

  const user = await User.create(userInfo).catch((err) => console.log(err))
  return res.status(200).json({
    status: 200,
    payload: {
      username: user.username,
      email: user.email,
    },
  })
}

export const login = async (req, res) => {
  try {
    // * Validate user input
    if (!req.body.email) {
      return res.status(400).json({
        status: 400,
        message: '이메일을 입력해주세요.',
      })
    }
    if (!req.body.password) {
      return res.status(400).json({
        status: 400,
        message: '비밀번호를 입력해주세요.',
      })
    }
    const { email, password } = req.body
    // const returnData: serviceReturnForm = await loginService(email, password);
    let foundUser = await User.findOne({ where: { email: email } }).catch((err) => console.log(err))
    if (!foundUser) {
      return res.status(400).json({
        status: 400,
        message: '이메일을 확인해주세요.',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if (isPasswordCorrect) {
      const accessToken = jwt.sign(
        {
          username: foundUser.username,
          email: foundUser.email,
        },
        config.jwt.secretKey,
        {
          expiresIn: config.jwt.expiresInSec,
        }
      )

      const refreshToken = 'refreshToken'

      await User.update(
        {
          refreshToken: refreshToken,
        },
        { where: { email: email } }
      )
      res.append('Set-Cookie', `refreshToken=${refreshToken}; Secure; HttpOnly;`)
      return res.status(200).json({
        status: 200,
        payload: {
          username: foundUser.username,
          email: foundUser.email,
          accessToken: accessToken,
        },
      })
    } else {
      return res.status(400).json({
        status: 400,
        message: '비밀번호가 올바르지 않습니다.',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `서버 오류: ${error}`,
    })
  }
}

export const getAllUsers = async (req, res) => {
  let users = await User.findAll({}).catch((err) => console.log(err))
  res.status(200).send(users)
}

export const getUser = async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({ where: { id: id } }).catch((err) => console.log(err))
  res.status(200).send(user)
}

export const updateUser = async (req, res) => {
  let id = req.params.id
  const user = await User.update(req.body, { where: { id: id } }).catch((err) => console.log(err))
  res.status(200).send(user)
}

export const deleteUser = async (req, res) => {
  let id = req.params.id
  await User.destroy({ where: { id: id } }).catch((err) => console.log(err))
  res.status(200).send('User is deleted')
}
