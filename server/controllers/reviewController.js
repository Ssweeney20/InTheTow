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

const getReviewByID = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
        if (!review){
            return res.status(404).json({ error: 'Review ID Not found' })
        }
        res.json(review)
    }
    catch (err) {
        next(err)
    }
}

const getReviewsByWarehouse = async (req, res, next) => {

    const { warehouseID } = req.params;

    try {
        const exists = await Warehouse.exists({_id: warehouseID});
        if (!exists) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        const reviews = await Review.find({warehouse: warehouseID}).sort({createdAt: -1})
        res.json(reviews)
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
    createReview,
    getReviewByID,
    getReviewsByWarehouse,
}