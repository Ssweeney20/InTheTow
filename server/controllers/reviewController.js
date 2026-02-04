const Review = require('../models/Review')
const Warehouse = require('../models/Warehouse')
const User = require('../models/User')
const Question = require('../models/Question')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, PutObjectCommand, GetObjectCommand, S3TablesBucketType } = require("@aws-sdk/client-s3")
const dontenv = require("dotenv")
const crypto = require("crypto")
const sharp = require("sharp")
const redisClient = require("../config/redis")

dontenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})


const normalizeValue = (min = null, max = null, value, withGrowth = false, midPoint = null, slope = null) => {
    if (withGrowth && midPoint !== null && slope !== null){
        return 1 / (1 + (Math.pow(Math.E, slope * (value - midPoint))))
    }
    else if (min !== null && max !== null){
        return ((value - min) / (max - min))
    }
}

// prior - what score should something have when I don’t trust the data yet?
const calculateConfidence = (prior, confidence, value) => {
    return prior + confidence * (value - prior)
}

const calculateInTheTowScore = (avgRating, numRatings, recentFiveRatings = [],
                                avgTimeAtDock, appointmentsOnTimePercentage, 
                                overnightParking, safetyScore, numSafetyReports, numTimeReports) => 
    {
    // normalize values so all are on same scale
    avgRating = normalizeValue(1, 5, avgRating)
    avgTimeAtDock = normalizeValue(undefined, undefined, avgTimeAtDock, true, 240, 0.012)
    safetyScore = normalizeValue(1, 5, safetyScore)
    // calculate confidences
    const ratingConfidence = normalizeValue(undefined, undefined, numRatings, true, 3, -1.1)
    const safetyConfidence = normalizeValue(undefined, undefined, numSafetyReports, true, 3, -1.1)
    const dockTimeConfidence = normalizeValue(undefined, undefined, numTimeReports, true, 3, -1.1)
    const totalScoreConfidence = ratingConfidence

    // weigh values with confidences
    avgRating = calculateConfidence(0.5, ratingConfidence, avgRating)
    avgTimeAtDock = calculateConfidence(0.5, dockTimeConfidence, avgTimeAtDock)
    safetyScore = calculateConfidence(0.5, safetyConfidence, safetyScore)

    // get average rating to 5 most recent reviews (this score will be weighed more highly then average rating)
    let sum = 0
    for (let i = 0; i < recentFiveRatings.length; i++){
        sum += recentFiveRatings[i]
    }
    let recentAverageRating = sum / recentFiveRatings.length
    recentAverageRating = normalizeValue(1, 5, recentAverageRating)

    // calculate weighted average
    const totalRatingWeight = 0.15
    const recentRatingWeight = 0.4
    const timeWeight = 0.4
    const safeWeight = 0.05

    let weightedAverage = (avgRating * totalRatingWeight) + (avgTimeAtDock * timeWeight) + (safetyScore * safeWeight) + (recentAverageRating * recentRatingWeight)

    // factor in total confidence
    return calculateConfidence(0.5, totalScoreConfidence, weightedAverage) * 100
}

const randomImageName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex')
}
// helper function to generate image urls from array of s3 imagenames
const generateImageURL = async (images) => {

    const imageURL = []
    for (let imageName of images) {

        const getObjectParams = {
            Bucket: bucketName,
            Key: imageName,
        }

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        imageURL.push(url)
    }

    return imageURL
}

const getAllReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 5

        const reviews = await Review.find()
            .skip(page * limit)
            .limit(limit)
            .lean()

        const total = await Review.countDocuments();

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

        const apiResponse = {
            error: false,
            total,
            page: page + 1,
            limit,
            reviews,
        }

        res.json(apiResponse)
    }
    catch (err) {
        next(err)
    }
}

const getReviewByID = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).lean()
        if (!review) {
            return res.status(404).json({ error: 'Review ID Not found' })
        }
        // get image signed urls
        if (review.photos) {
            review.photoURLs = await generateImageURL(review.photos)
        }
        else {
            review.photoURLs = []
        }

        res.json(review)
    }
    catch (err) {
        next(err)
    }
}

const getReviewsByUser = async (req, res, next) => {

    const userID = req.user;

    try {

        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 5

        const exists = await User.exists({ _id: userID });
        if (!exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const reviews = await Review.find({ user: userID }).sort({ createdAt: -1 })
            .populate({
                path: 'questions',
                populate: [{
                    path: 'askedBy',
                    select: 'displayName'
                },
                {
                    path: 'originalReviewAuthor',
                    select: 'displayName',
                }]
            })
            .skip(page * limit)
            .limit(limit)
            .lean()

        const total = await Review.countDocuments({ user: userID });

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

        const apiResponse = {
            error: false,
            total,
            page: page + 1,
            limit,
            reviews,
        }

        res.json(apiResponse)
    }
    catch (err) {
        next(err)
    }
}

const getReviewsByWarehouse = async (req, res, next) => {

    const { warehouseID } = req.params;

    try {
        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 5

        const exists = await Warehouse.exists({ _id: warehouseID });
        if (!exists) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        const reviews = await Review.find({ warehouse: warehouseID }).sort({ createdAt: -1 })
            .populate({
                path: 'questions',
                populate: [{
                    path: 'askedBy',
                    select: 'displayName'
                },
                {
                    path: 'originalReviewAuthor',
                    select: 'displayName',
                }]
            })
            .skip(page * limit)
            .limit(limit)
            .lean()

        const total = await Review.countDocuments({ warehouse: warehouseID });

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

        const apiResponse = {
            error: false,
            total,
            page: page + 1,
            limit,
            reviews,
        }

        res.json(apiResponse)
    }
    catch (err) {
        next(err)
    }
}

const createReview = async (req, res, next) => {

    // all values come in as strings
    try {
        let { rating, warehouse, reviewText,
            safety, overnightParking, hasLumper,
            startTime, endTime, appointmentTime
        } = req.body

        const photos = []
        // look through all files and upload to s3
        for (let file of req.files) {
            const photoName = randomImageName()

            const resizedImage = await sharp(file.buffer)
                .rotate()
                .resize({
                    width: 1280,
                    withoutEnlargement: true,
                })
                .jpeg({ quality: 75 })
                .toBuffer();

            params = {
                Bucket: bucketName,
                Key: photoName,
                Body: resizedImage,
                ContentType: file.mimetype,
            }

            const command = new PutObjectCommand(params)
            await s3.send(command)

            photos.push(photoName)
        }

        // convert strings to proper types (multi-part form data)
        rating = rating ? Number(rating) : undefined;
        safety = safety ? Number(safety) : undefined;

        hasLumper = hasLumper === 'true' || hasLumper === 'on';
        overnightParking = overnightParking === 'true' || overnightParking === 'on';

        startTime = startTime ? new Date(startTime) : null;
        endTime = endTime ? new Date(endTime) : null;
        appointmentTime = appointmentTime ? new Date(appointmentTime) : null;

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

        account = await User.findById(req.user)

        const review = await Review.create({
            rating, warehouse, reviewText, appointmentTime,
            startTime, endTime, safety, photos, overnightParking, hasLumper, user: req.user, userDisplayName: account.displayName
        })

        // add review to user
        if (!account) {
            throw new Error('User not found')
        }
        account.reviews.addToSet(review._id)
        await account.save()
        // console.log(account)

        // add review to warehouse
        const wh = await Warehouse.findById(warehouse)
        if (!wh) {
            // Rollback: delete the review we just created
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({ error: 'Warehouse not found' })
        }

        // update warehouse lumper status
        if (hasLumper == true) {
            wh.hasLumper = true
        }
        if (hasLumper == false) {
            wh.hasLumper = false
        }

        // update warehouse overnight parking status
        if (overnightParking == true) {
            wh.overnightParking = true
        }
        if (overnightParking == false) {
            wh.overnightParking = false
        }

        // update average rating
        const newCount = wh.numRatings + 1
        const newAvg = (wh.avgRating * wh.numRatings + rating) / newCount

        // update safety rating
        if (safety) {
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
        if (appointmentTime && startTime) {
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
        wh.photos = wh.photos || []
        wh.photos.push(...photos)
        wh.numRatings = newCount
        wh.avgRating = newAvg
        wh.numTimeReports = newTimeReports
        wh.avgTimeAtDock = newAvgTime

        // recalculate in the towScore
        await wh.populate({
            path: "reviews",
            options : { sort : { createdAt: -1 } }
        })

        const recentRatings = []
        for (let i = 0; i < wh.reviews.length; i++){
            recentRatings.push(wh.reviews[i].rating)
        }

        wh.inTheTowScore = calculateInTheTowScore(wh.avgRating, wh.numRatings, recentRatings, 
            wh.avgTimeAtDock, wh.appointmentsOnTimePercentage, wh.overnightParking,
            wh.safetyScore, wh.numSafetyReports, wh.numTimeReports
        )

        await wh.save()

        // update redis activity score

        const redisRes = await redisClient.ZINCRBY('activity_score', 5, warehouse)

        res.status(201).json(review)
    }
    catch (err) {
        console.error('createReview error:', err);
        next(err)
    }
}

const createQuestion = async (req, res, next) => {
    try {
        const { reviewID,
            questionText, originalReviewAuthor
        } = req.body
        const askedBy = req.user;

        if (askedBy === originalReviewAuthor) {
            return res.status(404).json({ message: "Cannot ask question on your own review" })
        }

        const review = await Review.findById(reviewID)

        // do input validation here
        if (!review) return res.status(404).json({ message: "Review not found" });

        // create question
        const question = await Question.create({
            reviewID, askedBy, questionText, originalReviewAuthor
        })

        // save question to review
        review.questions.addToSet(question._id)
        await review.save()


        res.status(201).json(question)
    }
    catch (err) {
        console.error('createQuestion error: ', err);
        next(err)
    }
}

const answerQuestion = async (req, res, next) => {
    try {
        const { answerText, questionID } = req.body

        const question = await Question.findById(questionID)
        question.answerText = answerText
        await question.save()

        res.status(201).json(question)
    }
    catch (err) {
        console.error('answerQuestion error: ', err);
        next(err)
    }
}

module.exports = {
    getAllReviews,
    createReview,
    getReviewByID,
    getReviewsByWarehouse,
    getReviewsByUser,
    createQuestion,
    answerQuestion,
    calculateInTheTowScore
}