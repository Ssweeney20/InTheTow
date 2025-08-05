const Warehouse = require('../models/Warehouse');

const getAllWarehouses = async (req, res, next) => {
    try {
        const list = await Warehouse.find()
        res.json(list)
    }
    catch (err) {
        next(err)
    }
}

const getWarehouseByID = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id)
        if (!warehouse) {
            return res.status(404).json({ error: 'ID Not found' })
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
        const warehouse = await Warehouse.find({ name: new RegExp(req.params.name, 'i') })
        if (!warehouse) {
            return res.status(404).json({ error: 'Name Not found' })
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
                    { zipSearchKey: re }
                ]
            })
            .limit(25);
        
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