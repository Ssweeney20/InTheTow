const Review = require('../models/Review')
const Warehouse = require('../models/Warehouse')
const User = require('../models/User')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, PutObjectCommand, GetObjectCommand, S3TablesBucketType } = require("@aws-sdk/client-s3")
const dontenv = require("dotenv")
const crypto = require("crypto")
const sharp = require("sharp")

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
        const reviews = await Review.find().lean()

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

        res.json(reviews)
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
        const exists = await User.exists({ _id: userID });
        if (!exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const reviews = await Review.find({ user: userID }).sort({ createdAt: -1 }).lean()

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

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
        const reviews = await Review.find({ warehouse: warehouseID }).sort({ createdAt: -1 }).lean()

        for (let review of reviews) {
            if (review.photos) {
                review.photoURLs = await generateImageURL(review.photos)
            }
            else {
                review.photoURLs = []
            }
        }

        res.json(reviews)
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
                .jpeg({quality: 75})
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
        console.log(account)

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
        wh.numRatings = newCount
        wh.avgRating = newAvg
        wh.numTimeReports = newTimeReports
        wh.avgTimeAtDock = newAvgTime

        await wh.save()

        res.status(201).json(review)
    }
    catch (err) {
        console.error('createReview error:', err);
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