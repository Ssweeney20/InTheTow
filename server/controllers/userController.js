const User = require('../models/User')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)

        // create JWT
        const token = createToken(user._id)

        res.status(200).json({email, token})

    } catch(error){
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res, next) => {
    const {email, password, displayName} = req.body

    try{
        const user = await User.signup(email, password, displayName)

        // create JWT
        const token = createToken(user._id)

        res.status(200).json({email, token})

    } catch(error){
        res.status(400).json({error: error.message})
    }
}

const getUserByID = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: 'User ID Not found' })
        }
        res.json(user)
    }
    catch (err) {
        next(err)
    }
}



module.exports = {loginUser, signupUser, getUserByID}