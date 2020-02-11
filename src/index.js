const express = require('express')
const User = require('./models/user')
const Tasks = require('./models/task')
const userrouter=require('./routers/user_router')
const taskrouter=require('./routers/task_router')
const path=require('path')
require('./db/mongoose')

const port = process.env.PORT
const app = express()

// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('GET request is disabled')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('server is down for a moment. check back soon')
//     next()
// })
app.use(express.json())
app.use(userrouter)
app.use(taskrouter)
app.listen(port, () => {
    console.log('the server is up on ' + port)
})
