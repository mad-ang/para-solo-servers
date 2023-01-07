import express from 'express'
import { signUp } from '../controller/auth'
const router = express.Router()

router.use('/signup', signUp)

router.post('/login', (req, res) => {
  console.log('login!')
})

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router