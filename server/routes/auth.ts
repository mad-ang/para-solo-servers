import express from 'express'
import { signUp, login, updateUser} from '../controllers/UserController'

const router = express.Router()

router.post('/signup', signUp)

router.post('/login', login)

router.patch('/update', updateUser)

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router
