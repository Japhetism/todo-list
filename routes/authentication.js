const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const user = require('../models/user')

// //ROUTE TO REGISTER USER
router.post('/register', async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new user({ firstName, lastName, email, phoneNumber, password: hashedPassword })

    newUser.save(err => {
        if(err) {
            next(new Error("Something went wrong"))
            console.log("Something went wrong")
        }else{
            console.log("User successfully registered")

        }
    })

})

module.exports = router

