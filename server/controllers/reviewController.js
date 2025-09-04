const Review = require('../models/Review')
const Warehouse = require('../models/Warehouse')
const User = require('../models/User')

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
        if (!review) {
            return res.status(404).json({ error: 'Review ID Not found' })
        }
        res.json(review)
    }
    catch (err) {
        next(err)
    }
}

const getReviewsByUser = async (req, res, next) => {

    const userID  = req.user;

    try {
        const exists = await User.exists({ _id: userID });
        if (!exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const reviews = await Review.find({ user: userID }).sort({ createdAt: -1 })
        res.json(reviews)
    }
    catch (err) {
        next(err)
    }
}

const getReviewsByWarehouse = async (req, res, next) => {

    const { warehouseID } = req.params;

    try {
        const exists = await Warehouse.exists({ _id: warehouseID });
        if (!exists) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        const reviews = await Review.find({ warehouse: warehouseID }).sort({ createdAt: -1 })
        res.json(reviews)
    }
    catch (err) {
        next(err)
    }
}

const createReview = async (req, res, next) => {

    console.log('req.user in createReview:', req.user);
    try {
        const {rating, warehouse, reviewText, pictures,
            safety, overnightParking, hasLumper
        } = req.body

        let { startTime, endTime, appointmentTime } = req.body;

        if (!warehouse) {
            return res.status(400).json({ error: "Warehouse is required" })
        }
        if (!rating) {
            return res.status(400).json({ error: "Rating is required" })
        }
        if (startTime) {
            startTime = new Date(startTime);
            if (isNaN(startTime)) {
                return res.status(400).json({ error: 'Invalid startTime' });
            }
        }
        if (endTime) {
            endTime = new Date(endTime);
            if (isNaN(endTime)) {
                return res.status(400).json({ error: 'Invalid endTime' });
            }
        }
        if (appointmentTime) {
            appointmentTime = new Date(appointmentTime);
            if (isNaN(appointmentTime)) {
                return res.status(400).json({ error: 'Invalid appointmentTime' });
            }
        }

        const review = await Review.create({
            rating, warehouse, reviewText, pictures, appointmentTime,
            startTime, endTime, safety, overnightParking, hasLumper, user : req.user
        })

        // add review to user
        account = await User.findById(req.user)
        if (!account){
             throw new Error('User not found')
        }
        account.reviews.addToSet(review._id)
        await account.save()


        // add review to warehouse
        const wh = await Warehouse.findById(warehouse)
        if (!wh) {
            // Rollback: delete the review we just created
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({ error: 'Warehouse not found' })
        }
        
        // update warehouse lumper status
        if (hasLumper == true){
            wh.hasLumper = true
        }
        if (hasLumper == false){
            wh.hasLumper = false
        }

        // update warehouse overnight parking status
        if (overnightParking == true){
            wh.overnightParking = true
        }
        if (overnightParking == false){
            wh.overnightParking = false
        }

        // update average rating
        const newCount = wh.numRatings + 1
        const newAvg = (wh.avgRating * wh.numRatings + rating) / newCount

        // update safety rating
        if (safety){
            const newSafeCount = wh.numSafetyReports + 1
            const newSafetyScore = (wh.safetyScore * wh.numSafetyReports + safety) / newSafeCount
            wh.numSafetyReports = newSafeCount;
            wh.safetyScore = newSafetyScore;
        }

        // update average timespent at dock
        let newTimeReports = wh.numTimeReports
        let newAvgTime = wh.avgTimeAtDock
        if (startTime && endTime) {
            newTimeReports++
            const diffMs = endTime - startTime
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            newAvgTime =
                (wh.avgTimeAtDock * wh.numTimeReports + diffMinutes) /
                newTimeReports
        }

        // update on time percentage
        if (appointmentTime && startTime){
            const newNumAppts = wh.numAppointmentsReported + 1
            const wasOnTime = startTime <= appointmentTime ? 1 : 0
            const newOnTimeCount = wh.appointmentsOnTimeCount + wasOnTime
            const newOnTimePercentage = (newOnTimeCount / newNumAppts) * 100
            wh.numAppointmentsReported = newNumAppts;
            wh.appointmentsOnTimeCount = newOnTimeCount;
            wh.appointmentsOnTimePercentage = newOnTimePercentage;
        }

        wh.reviews = wh.reviews || []
        wh.reviews.push(review._id)
        wh.numRatings = newCount
        wh.avgRating = newAvg
        wh.numTimeReports = newTimeReports
        wh.avgTimeAtDock = newAvgTime
        
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
    getReviewsByUser
}