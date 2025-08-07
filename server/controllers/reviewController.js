const Review = require('../models/Review')
const Warehouse = require('../models/Warehouse')

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

        // add review to warehouse
        const wh = await Warehouse.findById(warehouse)
        if (!wh) {
            // Rollback: delete the review we just created
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        wh.reviews = wh.reviews || []
        wh.reviews.push(review._id)
        await wh.save()

        res.status(201).json(review)
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getAllReviews,
    createReview
}