const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Warehouse'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        reviewText: {
            type: String,
        },
        pictures: {
            type: String,
        },
        appointmentTime: Date,

        startTime: Date,

        endTime: Date,

        hasLumper: Boolean,

        safety: Boolean,

        overnightParking: Boolean,

        dateCreated : Date
    },
    {
        timestamps: true
    }
)

ReviewSchema.virtual('loadDuration').get(function () {
    if (this.startTime && this.endTime) {
        return this.startTime - this.endTime;
    }
    return null;
});

ReviewSchema.virtual('onTime').get(function () {
    if (this.startTime && this.appointmentTime) {
        return this.startTime <= this.appointmentTime;
    }
});

const Review = mongoose.model("Review", ReviewSchema)

module.exports = Review