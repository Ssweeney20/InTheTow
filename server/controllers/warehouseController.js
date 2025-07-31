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


//const getWarehouseByID = (req,res) => {
//  
//}

module.exports = {
    getAllWarehouses,
}