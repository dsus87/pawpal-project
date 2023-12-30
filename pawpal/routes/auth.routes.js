const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard');


/* GET Signup page */
router.get("/signup",isLoggedOut, (req, res, next) => {
    console.log("req.session",req.session)
    res.render("auth/signup")
});

/* POST Signup  */
router.post("/signup", isLoggedOut, (req, res, next) => {

    const { username, email, password, name, location, role, availability, services, pets, reviews } = req.body;

    bcrypt.hash(password, saltRounds) // encrypt the password
    .then((hash) => {
        console.log('hash', hash)
        return User.create({ username, email, password: hash, name, location, role, availability, services, pets, reviews })
    })
    .then(user => {
        req.session.currentUser = user;
        res.render('auth/profile', user);
    })
.catch(err => console.log(err))

});

/* GET Profile page */
router.get("/profile/:username", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
         User.findOne({ username: currentUser.username })
        .then(user => {
            if (user) {
                req.session.currentUser = user;
                res.render('auth/profile', user);
                //res.redirect(`/profile/${user.username}`);
            } else {
                res.render("error", { message: "User not found." });
            }
        })
        .catch(err => {
            res.render("error", { message: "An error occurred. Please try again later." });
        });
});



/* GET Log in  page */
router.get("/login",isLoggedOut, (req, res, next)  =>{
    res.render("auth/login", {errorMessage: 'Password is incorrect'})
})


/* POST Log in  page */

router.post("/login",isLoggedOut,  (req, res)=>{

    const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email }) 
  .then(user => {
      if (!user) {
          console.log("Email not registered.");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
          return;
      }

      bcrypt.compare(password, user.password)
          .then(match => {
              if (match) {
                req.session.currentUser = user;
                res.render('auth/profile', user);
              } else {
                  console.log("Incorrect password.");
                  res.render('auth/login', { errorMessage: 'Incorrect email and/or password.' });
              }
          })
          .catch(err => {
              console.log("Error comparing password", err);
              res.render('auth/login', { errorMessage: 'Something went wrong. Please try again.' });
          });
  })
  .catch(err => {
      console.log(err);
      res.render('auth/login', { errorMessage: 'Something went wrong. Please try again.' });
  });
});


router.post('/logout', isLoggedIn, (req, res, next) => {
    console.log("Logout route accessed. Current session: ", req.session);
    if (!req.session.currentUser) {
        console.log("User already logged out, redirecting to home.");
        res.redirect('/');
        return;
    }

    req.session.destroy(err => {
        if (err) {
            console.log("Error destroying session: ", err);
            next(err);
        } else {
            console.log("Session destroyed, redirecting to home.");
            res.redirect('/');
        }
    });
});


module.exports = router;
