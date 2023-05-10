const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./schemas/user.js')
const SetList = require('./schemas/setList.js')
const PORT = 8080

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://headbaash:fe4fOUNSZ62LNiM0@legogroups.qb2a94g.mongodb.net/?retryWrites=true&w=majority')
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

    if(user) {
        await user.save()

        const token = jwt.sign((username), 'THISMYSECRETKEY')
        res.json({token: token, success: true, message: `${username} is a registered user now!`})
    } else {
        res.json({success: false, message: "User already exists"})
    }
})

app.post('/api/login', async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    //extracting the username and password from the request body and putting them into a variable

    User.findOne({ username })
    //The findOne method is finding the variable passed to (in this case it's username) in the database
    .then(user => {
        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid user'})
            //This will trigger if a user is not found
        }

        bcrypt.compare(password, user.password)
        //this is comparing the plain text password (the first argument passed) to the hashed password to see if they match
        .then(result => {
            if (!result) {
                return res.status(401).json({success: false, message: 'Invalid user'})
                //this error message given if a password doesn't match any user
            }

            const token = jwt.sign({ username }, 'THISISMYSECRETKEY')
            res.json({ success: true, token, user: user._id })
            //If the password matches then it will generate a JSON web token for the user 
            //the jwt.sign method is what's doing this
            console.log('login successful!')
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
    const set_img_url = req.body.set_img_url
    const num_parts = req.body.num_parts
    const year = req.body.year

    const sets = new SetList ({
        name: name,
        set_img_url: set_img_url,
        num_parts: num_parts,
        year: year
    })
    await sets.save()
    user.listOfSets.push(sets)
    // line 99 & 100 is saving sets as a normal schema and then it's going to push that information in that schema into the listOfSets array that's inside of the User schema
    await user.save()
    res.status(201).json(sets)
})

app.listen(PORT, () => {
    console.log('server Running')
})