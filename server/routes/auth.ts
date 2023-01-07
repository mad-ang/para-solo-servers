import express from 'express'
import { signUp } from '../controller/auth'
import { login } from '../controller/auth'
const router = express.Router()

router.use('/signup', signUp)

router.use('/login', login)

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router
