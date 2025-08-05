const Warehouse = require('../models/Warehouse');

const getAllWarehouses = async (req,res, next) => {
    try{
        const list = await Warehouse.find()
        res.json(list)
    }
    catch(err){
        next(err)
    }
}

const getWarehouseByID = async (req,res, next) => {
    try{
        const warehouse = await Warehouse.findById(req.params.id)
        if (!warehouse){
            return res.status(404).json({error: 'ID Not found'})
        }
        res.json(warehouse)
    }
    catch(err){
        next(err)
    }
}

const getWarehouseByName = async (req,res, next) => {
    try{
        const warehouse = await Warehouse.find({name : new RegExp(req.params.name, 'i')})
        if (!warehouse){
            return res.status(404).json({error: 'Name Not found'})
        }
        res.json(warehouse)
    }
    catch(err){
        next(err)
    }
}

const createWarehouse = async (req,res, next) => {
    try{
        const {name, address, phoneNumber, googlePlaceID} = req.body

        if (!name){
            res.status(400).json({error: "Name is required"})
        }
        if (!address){
            res.status(400).json({error: "Address is required"})
        }

        const warehouse = await Warehouse.create({name, address, phoneNumber, googlePlaceID})

        res.status(201).json(warehouse)
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    getAllWarehouses,
    getWarehouseByID,
    getWarehouseByName,
    createWarehouse,
}