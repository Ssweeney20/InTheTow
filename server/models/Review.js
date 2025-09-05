const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        userDisplayName : {
            type: String,
            required: true,
        },
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
        pictures: [String],
        appointmentTime: Date,

        startTime: {
            type: Date,
            required: function () {
                // if endTime is set, then startTime becomes required
                return this.endTime != null;
            },
        },
        endTime: {
            type: Date,
            required: function () {
                // if startTime is set, then endTime becomes required
                return this.startTime != null;
            },
            validate: {
                validator: function (value) {
                    // only validate if both dates are set
                    return value > this.startTime;
                },
                message: "endTime must be after startTime"
            }
        },

        hasLumper: Boolean,

        safety: {
            type: Number,
            min: 1,
            max: 5,
        },

        overnightParking: Boolean,

    },
    {
        timestamps: true
    }
)

ReviewSchema.virtual('loadDuration').get(function () {
    if (this.startTime && this.endTime) {
        return this.endTime - this.startTime;
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