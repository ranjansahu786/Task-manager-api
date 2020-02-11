const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

// me.save().then(() => {  
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

// //Tasks5432 is the collection name
// const Task23 = mongoose.model('Tasks5432', {
//     descript: {
//         type: String
//     }, completed: {
//         type: Boolean
//     }, num: {
//         type: Number
//     }
// })
// const task4 = new Task23({
//     descript: 'clean the house',
//     completed: true, num: 122
// })
// task4.save().then(() => {
//     console.log(task1)
// }).catch((error) => {
//     console.log('Error!' + error)
// })



