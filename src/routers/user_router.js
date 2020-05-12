const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendwelcomeEmail} = require('../Emails/accounts')
const {sendcancelEmail} = require('../Emails/accounts')

const router = new express.Router()

const uploads = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 100000000
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg|doc|docx|pdf)$/)) {
            return cb(new Error('please upload file'))
        }
        cb(undefined, true)
    }


})

//  -------------  Creating User  ------------

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        sendwelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
    // before the async await function  is used

    // user1.save().then(() => {
    //     res.send(user1)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })
})

// ----------- Login using User Credentials ------------ 
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)

    }
})


// ---------------- Upload Profile -------------

router.post('/users/upload/avatar', auth, uploads.single('avatar'), async (req, res) => {
    //const buffer= await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


// ------------------ Upload Documents -------------------

router.post('/users/upload/documents', auth, uploads.single('documents'), async (req, res) => {
    //const buffer= await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.documents=req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



// ------------------ Delete Profile ----------------

router.delete('/users/me/avatar', auth, uploads.any(), async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



// ------------------ Getting Profile --------------

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('user not found!!!')
        }
        res.set('Content-Type', 'image/jpeg' )
        //res.set('Content-Type', 'application/pdf')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


// ------------------- Getting Documents ----------------

router.get('/users/:id/documents', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.documents) {
            throw new Error('user not found!!!')
        }
        res.set('Content-Type', 'application/pdf' )
        //res.set('Content-Type', 'application/pdf')
        res.send(user.documents)
    } catch (e) {
        res.status(404).send()
    }
})


// ----------------- Logging out from Authenticate ---------------

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()

    }
})


router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// ----------------- Getting User details ----------------

router.get('/user/me', auth, async (req, res) => {
    try {
        res.send(req.user)

    } catch (e) {
        res.status(400).send()

    }

    // const users = User.find().then((users) => {
    //     res.send(users)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})

// ------------------ Getting user Details by Id --------------------

router.get('/users/:id', auth, async (req, res) => {

    const _id = req.user.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)

    } catch (e) {
        res.status(500).send(e)

    }
    //req.params will contain all the parameters
    //     const _id=req.params.id
    //     const user = User.findById(_id).then((user) => {
    //         if (!user) {
    //             return res.status(404).send()
    //         }
    //         res.send(user)
    //     }).catch(() => {
    //         res.status(500).send()
    //     })
})


// -------------------- Updating User ---------------------

router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'email', 'age', 'password', 'phone', 'minutes', 'profession']
    const isvalidoperation = updates.every((update) => {
        return allowedupdates.includes(update)
    })
    if (!isvalidoperation) {
        res.status(400).send('invalid operation!!!')
    }
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
            req.user.ttime = new Date().getHours() + " : "+ new Date().getMinutes()+" : "+new Date().getSeconds()
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})


// ----------------------- Delete User --------------------

router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendcancelEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)

    }
})

module.exports = router
