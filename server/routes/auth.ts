import express from 'express'
const router = express.Router()

router.post('/signup', (req, res) => {
  console.log('signup!')
})

router.post('/login', (req, res) => {
  console.log('login!')
})

router.get('/me', (req, res) => {
  console.log('me!')
})

export default router
