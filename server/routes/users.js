const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const { loginUser, signupUser, getUserByID, getCurrentUser, uploadProfilePic, changeDisplayName, changePassword} = require('../controllers/userController')

router.get('/:id', getUserByID)

router.get('/', requireAuth, getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.post('/profile-photo', upload.single('photo'), requireAuth, uploadProfilePic)

router.post('/display-name', requireAuth, changeDisplayName)

router.post('/change-password', requireAuth, changePassword)

module.exports = router