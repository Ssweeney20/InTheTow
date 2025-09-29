const Warehouse = require('../models/Warehouse');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const dontenv = require("dotenv")

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

// helper function to generate image urls from array of s3 imagenames, because this is for warehouse
// previews we only want to generate 4 urls max (4 newest)
const generateImageURL = async (images) => {

    const imageURL = []
    for (let i = images.length - 1; i >= 0 && imageURL.length < 8; i--) {
        const imageName = images[i]
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

const getAllWarehouses = async (req, res, next) => {
    try {
        const warehouses = await Warehouse.find().lean()

        for (let warehouse of warehouses) {
            if (warehouse.photos) {
                warehouse.photoURLs = await generateImageURL(warehouse.photos)
            }
            else {
                warehouse.photoURLs = []
            }
        }
        res.json(warehouses)
    }
    catch (err) {
        next(err)
    }
}

const getWarehouseByID = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id).lean()
        if (!warehouse) {
            return res.status(404).json({ error: 'ID Not found' })
        }

        if (warehouse.photos) {
            warehouse.photoURLs = await generateImageURL(warehouse.photos)
        }
        else {
            warehouse.photoURLs = []
        }

        res.json(warehouse)
    }
    catch (err) {
        next(err)
    }
}

const updateWarehouseByID = async (req, res, next) => {
    try {
        const updated = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updated) {
            return res.status(404).json({ error: 'ID Not found' })
        }

        // here to save search keys
        await updated.save();

        res.status(200).json({ updated })

    }
    catch (err) {
        next(err)
    }
}

const getWarehouseByName = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.find({ name: new RegExp(req.params.name, 'i') }).lean()
        if (!warehouse) {
            return res.status(404).json({ error: 'Name Not found' })
        }
        if (warehouse.photos) {
            warehouse.photoURLs = await generateImageURL(warehouse.photos)
        }
        else {
            warehouse.photoURLs = []
        }

        res.json(warehouse)
    }
    catch (err) {
        next(err)
    }
}

const createWarehouse = async (req, res, next) => {
    try {
        const { name, streetAddress, city, state, zipCode,
            phoneNumber, googlePlaceID, hasLumper
        } = req.body

        if (!name) {
            res.status(400).json({ error: "Name is required" })
        }
        if (!streetAddress) {
            res.status(400).json({ error: "Street Address is required" })
        }
        if (!city) {
            res.status(400).json({ error: "City is required" })
        }
        if (!zipCode) {
            res.status(400).json({ error: "Zip Code is required" })
        }

        const warehouse = await Warehouse.create({
            name, streetAddress, city, state, zipCode,
            phoneNumber, googlePlaceID, hasLumper
        })

        res.status(201).json(warehouse)
    }
    catch (err) {
        next(err)
    }
}

const deleteWarehouseByID = async (req, res, next) => {
    try {
        const deleted = await Warehouse.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ error: 'ID Not found' })
        }
        res.status(200).json({ message: 'Warehouse deleted succesfully' })
    }
    catch (err) {
        next(err)
    }
}

const searchWarehouses = async (req, res, next) => {
    try {
        const { q } = req.query
        if (!q) {
            return res.status(400).json({ error: "query is required" })
        }

        const searchQuery = q.trim()
        searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(searchQuery, 'i')

        const results = await Warehouse.find({
            $or: [
                { nameSearchKey: re },
                { addressSearchKey: re },
                { citySearchKey: re },
                { zipSearchKey: re },
                { stateSearchKey: re }
            ]
        }).limit(25).lean();

        for (let result of results) {
            if (result.photos) {
                result.photoURLs = await generateImageURL(result.photos)
            }
            else {
                result.photoURLs = []
            }
        }

        res.json(results)
    }
    catch (err) {
        next(err)
    }
}




module.exports = {
    getAllWarehouses,
    getWarehouseByID,
    getWarehouseByName,
    createWarehouse,
    deleteWarehouseByID,
    updateWarehouseByID,
    searchWarehouses
}