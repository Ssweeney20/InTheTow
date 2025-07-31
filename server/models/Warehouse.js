const mongoose = require('mongoose')

const WarehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        address: String,
        googlePlaceId: {
            type: String,
            required: true,
            unique: true
        }

    },
    {
        timestamps: true 
    }
)

const Warehouse = mongoose.model("Warehouse", WarehouseSchema)

module.exports = Warehouse