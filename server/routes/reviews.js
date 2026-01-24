const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', reviewController.getAllReviews)

router.get('/user', requireAuth, reviewController.getReviewsByUser);

router.get('/:id', reviewController.getReviewByID)

router.get('/warehouse/:warehouseID', reviewController.getReviewsByWarehouse);

router.post('/', upload.array('photos', 5), requireAuth, reviewController.createReview)

router.post('/:id/questions', requireAuth, reviewController.createQuestion)

router.patch('/questions/:questionID/answer', reviewController.answerQuestion)

module.exports = router 