const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const requireAuth = require('../middleware/requireAuth')

router.get('/', reviewController.getAllReviews)

router.get('/:id', reviewController.getReviewByID)

router.get('/warehouse/:warehouseID', reviewController.getReviewsByWarehouse);

router.get('/user/:userID', requireAuth, reviewController.getReviewsByUser);

router.post('/', requireAuth, reviewController.createReview)

module.exports = router 