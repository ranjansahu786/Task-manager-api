const mongoose=require('mongoose')
const bcryptjs=require('bcryptjs')
//const validator=require('validator')
const userSchema=new mongoose.Schema({
    

    completed:{
        type:Boolean,
        default:false
    },
    description:{
        required:true,
        trim:true,
        type:String

    },
    owner:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
},{
    timestamps:true
})


const Tasks = mongoose.model('Tasks',userSchema)
module.exports=Tasks