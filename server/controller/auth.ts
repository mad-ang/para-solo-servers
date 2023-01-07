import User from '../model/user'
import { config } from '../envconfig'

export const signUp = (req, res) => {
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
      userInfo: userInfo,
    })
  })
}
export const login = (req, res) => {
  //   const user = new User(req.body)
  //   user.save((err, userInfo) => {
  //     if (err) return res.json({ success: false, err })
  //     return res.status(200).json({ success: true })
  //   })
}
