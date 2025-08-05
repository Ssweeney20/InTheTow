const express = require('express')
const router = express.Router()

const warehouseController = require('../controllers/warehouseController')

router.get('/', warehouseController.getAllWarehouses)

router.post('/', warehouseController.createWarehouse)

router.get('/:id', warehouseController.getWarehouseByID)

router.get('/name/:name', warehouseController.getWarehouseByName)

module.exports = router