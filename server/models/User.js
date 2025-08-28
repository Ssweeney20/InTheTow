const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    hash: {
        type: String,
        require: true,
    },

})

UserSchema.statics.signup = async function(email, password){

    // validation
    if (!email || !password){
        throw Error('All fields are required')
    }
    
    if (!validator.isEmail(email)){
        throw Error('Invalid email')
    }

    if (!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    
    const exists = await this.findOne({email})

    if (exists){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, hash, salt})

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