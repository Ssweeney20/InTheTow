const express = require('express')
const router = express.Router()

const reviewController = require('../controllers/reviewController')

router.get('/', reviewController.getAllReviews)

router.get('/:id', reviewController.getReviewByID)

router.get('/warehouse/:warehouseID', reviewController.getReviewsByWarehouse);

router.post('/', reviewController.createReview)

module.exports = router