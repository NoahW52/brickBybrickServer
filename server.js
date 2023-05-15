const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const dbConfig = {
    port: process.env.DB_PORT,
    key: process.env.DB_SECRET_KEY,
    dbConnect: process.env.DB_CONNECT
}

const User = require('./schemas/user.js')
const SetList = require('./schemas/setList.js')
const minifigList = require('./schemas/minifigs.js')
const PORT = dbConfig.port

app.use(cors())
app.use(express.json())

mongoose.connect(dbConfig.dbConnect)
.then(() => {
    console.log('connection successful')
}).catch((error) => {
    console.log(error)
})

app.post('/api/register', async (req,res) => {
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    const user = new User ({
        name: name,
        email: email,
        username: username,
        password: password
    })
    
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    user.password = passwordHash
    

    if(user) {
        await user.save()
        const token = jwt.sign({username}, dbConfig.key)
        res.json({token: token, success: true, userId: user._id, message: `${username} is a registered user now!`})
    } else {
        res.json({success: false, message: "User already exists"})
    }
})

app.post('/api/login', async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    //extracting the username & password from the request body and putting them into a variable
    console.log(username, password)
    User.findOne({ username })
    //The findOne method is finding the variable passed to (in this case it's username) in the database
    .then(user => {
        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid user'})
            //This will trigger if a user is not found ok
        }

        bcrypt.compare(password, user.password)
        //this is comparing the plain text password (the first argument passed) to the hashed password to see if they match
        .then(result => {
            if (!result) {
                return res.status(401).json({success: false, message: 'Invalid user'})
                //this error message given if a password doesn't match any user
            }

            const token = jwt.sign({ username }, dbConfig.key)
            res.json({ success: true, token, userId: user._id })
            //If the password matches then it will generate a JSON web token for the user 
            //the jwt.sign method is what's doing this
        })

        .catch(err => {
            return res.status(500).json({ success: false, message: 'Internal server error' })
            //this error message is given if there's an issue with the password comparison
        })
    })

    .catch(err => {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    })
})

app.post('/api/setList/:userId', async (req,res) => {

    const user = await User.findById(req.params.userId)

    const name = req.body.name
    const set_num = req.body.set_num
    const set_img_url = req.body.set_img_url
    const num_parts = req.body.num_parts
    const year = req.body.year

    const sets = new SetList ({
        name: name,
        set_num: set_num,
        set_img_url: set_img_url,
        num_parts: num_parts,
        year: year
    })
    user.listOfSets.push(sets)
    // saving sets as a normal schema and then it's going to push that information in that schema into the listOfSets array that's inside of the User schema
    await user.save()
    await sets.save()
    res.status(201).json(sets)
})

app.get('/api/setList/:userId', async (req,res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)

        const setLists = user.listOfSets
        res.json(setLists)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Error finding list of sets"})
    }
})

app.post('/api/minifigList/:userId', async (req,res) => {

    const user = await User.findById(req.params.userId)

    const name = req.body.name
    const set_img_url = req.body.set_img_url

    const newFig = new minifigList ({
        name: name,
        set_img_url: set_img_url
    })
    user.listOfMinifigs.push(newFig)

    await user.save()
    await newFig.save()
    res.status(201).json(newFig)
})

app.get('/api/minifigList/:userId', async (req,res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)

        const minifigList = user.listOfMinifigs
        res.json(minifigList)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Error finding list of minifigs"})
    }
})

app.listen(PORT, () => {
    console.log('server Running')
})