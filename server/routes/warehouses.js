const express = require('express')
const router = express.Router()

const warehouseController = require('../controllers/warehouseController')

router.get('/search', warehouseController.searchWarehouses)

router.get('/active-warehouses', warehouseController.getActiveWarehouses)

router.get('/', warehouseController.getAllWarehouses)

router.post('/', warehouseController.createWarehouse)

router.get('/:id', warehouseController.getWarehouseByID)

router.delete('/:id', warehouseController.deleteWarehouseByID)

router.patch('/:id', warehouseController.updateWarehouseByID)

router.get('/name/:name', warehouseController.getWarehouseByName)




module.exports = router