const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        warehouse: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Warehouse'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        body: {
            type: String,
        },
        pictures: {
            type: String,
        },
        appointmentTime: Date,

        startTime: Date,

        endTime: Date,

        hasLumper: Boolean,

        saftey: Boolean,

        overnightParking: Boolean,
    },
    {
        timestamps: true
    }
)

reviewSchema.virtual('loadDuration').get(function () {
    if (this.startTime && this.endTime) {
        return this.startTime - this.endTime;
    }
    return null;
});

reviewSchema.virtual('onTime').get(function () {
    if (this.startTime && this.appointmentTime) {
        return this.startTime <= this.appointmentTime;
    }
});

const Review = mongoose.model("Review", ReviewSchema)

module.exports = Review