const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const requireAuth = require('../middleware/requireAuth')

router.get('/', reviewController.getAllReviews)

router.get('/user', requireAuth, reviewController.getReviewsByUser);

router.get('/:id', reviewController.getReviewByID)

router.get('/warehouse/:warehouseID', reviewController.getReviewsByWarehouse);

router.post('/', requireAuth, reviewController.createReview)

module.exports = router 