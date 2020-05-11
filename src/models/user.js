const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const Tasks=require('../models/task')

// -------------------model to create user -----------------

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    age: {
        type: Number,
        default: 0,
        Validate(value) {
            if (value < 0) {
                throw new Error('age should be greater then 0')
            }

        }

    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Provided email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.includes("password")) {
                throw new Error('this password is not accepted')

            }
        },
        minlength: 6
    },
    phone:{
        type:Number,
        required:true,
        minlength:10
    },

    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer
    },
    documents:{
        type:Buffer
    }
    
},{
    timestamps:true
})
userSchema.virtual('task',{
ref:'Tasks',
localField:'_id',
foreignField:'owner'
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('user not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('unable to login')
    }

    return user
}


userSchema.methods.generateAuthToken = async function(){
    const user=this 
    const id=user._id.toString()
    const token=jwt.sign({id},process.env.JWT_SECRET_KEY)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
    
}
// --------------- hash the password before saving the password ---------------

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

    }

    next()
})
userSchema.pre('remove',async function(next){
    try{
        const user=this
        Tasks.deleteMany({owner:user._id})    
        next()
    }catch(e){
        res.status(500).send()
    }
   
})


const User = mongoose.model('User', userSchema)
module.exports = User
