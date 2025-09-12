const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const { loginUser, signupUser, getUserByID, getCurrentUser } = require('../controllers/userController')

router.get('/:id', getUserByID)

router.get('/', requireAuth, getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', signupUser)

module.exports = router