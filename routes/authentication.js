const express = require('express');
const app = express()
const router = express.Router();
const bcrypt = require('bcrypt')
const user = require('../models/user')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('../passport-config')
initializePassport(
    passport, 
    email => user.findOne({ email: email })
    //email => user.find(user => user.email === email),
    // id => user.find(user => user.id === id)
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

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

//ROUTE TO LOGIN USER
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    console.log(err)
      if (err) { 
        console.log(err)
        //return next(err);
        res.send(err) 
      }else{
          res.send(user)
      }
    //   if (!user) { return res.redirect('/login'); }
    //   req.logIn(user, function(err) {
    //     if (err) { return next(err); }
    //     return res.redirect('/users/' + user.username);
    //   });
    })(req, res, next);
  });
// router.post('/login', passport.authenticate('local', {
//     successMessage: "user found",
//     failureFlash: true
// }))

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    console.log("Invalid user")
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated) {

    }
}

module.exports = router

