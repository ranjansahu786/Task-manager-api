const User=require('../models/user')
const jwt=require('jsonwebtoken')

const auth = async (req,res,next) => {
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const user=await User.findOne({'_id':decode.id,'tokens.token':token})

        if(!user){
            res.status(401).send('please Authenticate!!!!!')
        }
        req.token=token
        req.user=user

    }catch(e){
        res.status('500').send(e)
    }
    next()
}
module.exports=auth