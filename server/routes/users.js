const express = require('express')
const router = express.Router()

const { loginUser, signupUser, getUserByID } = require('../controllers/userController')

router.get('/:id', getUserByID)

router.post('/login', loginUser)

router.post('/signup', signupUser)

module.exports = router