import express from 'express'
import { createUser } from '../controller/auth'
const router = express.Router()

router.use('/signup', createUser)

router.post('/login', (req, res) => {
  console.log('login!')
})

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router