const mongoose = require('mongoose')

const WarehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        address: {
            type: String,
            unique: true,
            required: true,
        },
        phoneNumber: String,
        googlePlaceId: {
            type: String,
            unique: true,
            sparse: true,
        },
        hasLumper: Boolean,

    },
    {
        timestamps: true 
    }
)

const Warehouse = mongoose.model("Warehouse", WarehouseSchema)

module.exports = Warehouse