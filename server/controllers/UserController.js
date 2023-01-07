const bcrypt = require('bcrypt')
const db = require('../models')

const User = db.users

async function hashPassword(user) {
  const password = user.password
  const saltRounds = 8

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return hashedPassword
}

// TODO: bcrypt
export const addUser = async (req, res) => {
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }

  userInfo.password = await hashPassword(userInfo)

  const user = await User.create(userInfo).catch((err) => console.log(err))
  return res.status(200).json({ success: true, payload: user })
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
