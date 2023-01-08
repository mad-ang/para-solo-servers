import express from 'express'
import { addUser } from '../controllers/UserController'

const router = express.Router()

router.post('/signup', addUser)

router.get('/login', (req, res) => {
  console.log('login!')
})

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router
