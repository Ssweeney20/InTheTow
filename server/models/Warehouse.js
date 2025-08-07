const mongoose = require('mongoose')

function normalize(str = '') {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, '')   
    .replace(/\s+/g, ' ')          
    .trim();
}

const WarehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        streetAddress: {
            type: String,
            unique: true,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        phoneNumber: String,
        googlePlaceId: {
            type: String,
            unique: true,
            sparse: true,
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
        avgRating: {
            type: Number,
            default : 0
        },
        numRatings: {
            type: Number,
            default : 0
        },
        avgTimeAtDock: {
            type: Number,
            default : 0
        },
        numTimeReports: {
            type: Number,
            default : 0
        },
        hasLumper: Boolean,
        nameSearchKey: { 
            type: String, 
            index: true 
        },
        addressSearchKey: { 
            type: String, 
            index: true 
        },
        citySearchKey:{ 
            type: String, 
            index: true 
        },
        stateSearchKey:{ 
            type: String, 
            index: true 
        },
        zipSearchKey:{ 
            type: String, 
            index: true 
        }
    },
    {
        timestamps: true 
    }
)

WarehouseSchema.pre('save', function(next) {
  this.nameSearchKey    = normalize(this.name);
  this.addressSearchKey = normalize(this.streetAddress);
  this.citySearchKey    = normalize(this.city);
  this.stateSearchKey    = normalize(this.state);
  this.zipSearchKey     = normalize(this.zipCode);
  next();
});

const Warehouse = mongoose.model("Warehouse", WarehouseSchema)

module.exports = Warehouse