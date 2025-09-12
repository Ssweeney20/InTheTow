const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } = require('obscenity');

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    displayName: {
       type: String, 
       require: true,
       maxLength: 20
    },
    companyName: {
       type: String, 
    },
    hash: {
        type: String,
        require: true,
    },
    reviews: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }],
    profilePicture: {
        type: String,
    }

})

UserSchema.statics.signup = async function(email, password, displayName){

    // validation
    if (!email || !password || !displayName){
        throw Error('All fields are required')
    }
    
    if (!validator.isEmail(email)){
        throw Error('Invalid email')
    }

    if (!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    // obscenity filter
    if (matcher.hasMatch(displayName)) {
	    throw Error('Please try another display name')
    }
    
    const exists = await this.findOne({email})

    if (exists){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, hash, displayName})

    return user
}

UserSchema.statics.login = async function(email, password){

    // validation
    if (!email || !password){
        throw Error('All fields are required')
    }
    
    const user = await this.findOne({email})

    if (!user){
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.hash)

    if (!match){
        throw Error('Incorrect password')
    }

    return user

}

const User = mongoose.model("User", UserSchema)

module.exports = User