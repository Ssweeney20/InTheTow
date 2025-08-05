const Review = require('../models/Review')

const getAllReviews = async (req, res, next) => {
    try {
        const list = await Review.find()
        res.json(list)
    }
    catch (err) {
        next(err)
    }
}

const createReview = async (req, res, next) => {
    try {
        const {rating, warehouse, reviewText, pictures, appointmentTime,
            startTime, safety, overnightParking, hasLumper
        } = req.body

        if (!warehouse) {
            res.status(400).json({ error: "Warehouse is required" })
        }
        if (!rating) {
            res.status(400).json({ error: "Rating is required" })
        }

        const review = await Review.create({
            rating, warehouse, reviewText, pictures, appointmentTime,
            startTime, safety, overnightParking, hasLumper
        })

        res.status(201).json(warehouse)
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getAllReviews,
    createReview
}