const User = require('../models/User')
const jwt = require('jsonwebtoken')
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
const generateImageURL = async (imageName) => {

    const getObjectParams = {
        Bucket: bucketName,
        Key: imageName,
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url
}

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        // create JWT
        const token = createToken(user._id)

        res.status(200).json({ email, token })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res, next) => {
    const { email, password, displayName } = req.body

    try {
        const user = await User.signup(email, password, displayName)

        // create JWT
        const token = createToken(user._id)

        res.status(200).json({ email, token })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getUserByID = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id).lean()
        if (!user) {
            return res.status(404).json({ error: 'User ID Not found' })
        }

        if (user.profilePicture) {
            user.photoURL = await generateImageURL(user.profilePicture)
        }
        else {
            user.photoURL = ''
        }

        res.json(user)
    }
    catch (err) {
        next(err)
    }
}

const getCurrentUser = async (req, res, next) => {

    const userID = req.user;

    try {
        const user = await User.findById(userID).lean()
        if (!user) {
            return res.status(404).json({ error: 'User ID Not found' })
        }

        if (user.profilePicture) {
            user.photoURL = await generateImageURL(user.profilePicture)
        }
        else {
            user.photoURL = ''
        }

        res.json(user)
    }
    catch (err) {
        next(err)
    }
}

const uploadProfilePic = async (req, res, next) => {

    const userID = req.user;

    try {

        const photoName = randomImageName()
        const resizedImage = await sharp(req.file.buffer)
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
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)
        await s3.send(command)


        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ error: 'User ID Not found' })
        }

        user.profilePicture = photoName
        await user.save()

        res.json(user)
    }
    catch (err) {
        next(err)
    }
}

const changeDisplayName = async (req, res, next) => {

    const userID = req.user;
    const { displayName } = req.body;

    try {

        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ error: 'User ID Not found' })
        }

        user.displayName = displayName;
        await user.save()

        res.json(user)
    }
    catch (err) {
        next(err)
    }
}

const changePassword = async (req, res, next) => {

    const userID = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.changePassword(userID, currentPassword, newPassword)

        res.status(200).json(user)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



module.exports = { loginUser, signupUser, getUserByID, getCurrentUser, uploadProfilePic, changeDisplayName, changePassword }