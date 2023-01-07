const db = require('../models')

const User = db.User

// TODO: bcrypt
export const addUser = async (req, res) => {
  const userInfo = {
    username: req.body.username,
    password: req.body.password,
  }
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
