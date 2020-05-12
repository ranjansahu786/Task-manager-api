const express = require('express')
const Tasks = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks', auth, async (req, res) => {
    const Task1 = new Tasks({
        ...req.body,
        owner: req.user.id
    })
    try {
        await Task1.save()
        res.send(Task1)
    } catch (e) {
        res.status(400).send(e)
    }
    // before the async await function

    // Task1.save().then(() => {
    //     res.send(Task1)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })

})

router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}

        if(req.query.completed){
            match.completed=req.query.completed==='true'
            
        }
        const sort={}
        if(req.query.sortBy){
            const parts=req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
       

        //const tasks = await Tasks.find({owner:req.user.id})
        await req.user.populate({
            path: 'task',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }

        }).execPopulate()
        res.send(req.user.task)

    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(404).send('404 Error!')
        }
        res.send(task)

    } catch (e) {
        res.status(500).send(e)

    }

})
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdates = ['friends', 'chats']
    const isvalidoperation =
        updates.every((update) => {
            return allowedupdates.includes(update)
        })
    if (!isvalidoperation) {
        return res.status(400).send('inavlid operation!!')

    }
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save()
        // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(task)
    } catch (e) {
        res.status(500).send(e)

    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            res.status(404).send('task not found')
        }
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router