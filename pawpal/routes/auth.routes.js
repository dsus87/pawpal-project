const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const User = require("../models/User.model");

/* GET Signup page */
router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
});

/* POST Signup  */
router.post("/signup", (req, res, next) => {

    const { username, email, password, name, location, role, availability, services, pets, reviews } = req.body;

    bcrypt.hash(password, saltRounds) // encrypt the password
    .then((hash) => {
        console.log('hash', hash)
        return User.create({ username, email, password: hash, name, location, role, availability, services, pets, reviews })
    })
    .then(user => {
        res.render("auth/profile", { user: user });
    })
.catch(err => console.log(err))

});

/* GET Profile page */
router.get("/profile/:username", (req, res, next) => {
    const requestedUsername = req.params.username;
    User.findOne({ username: requestedUsername })
        .then(user => {
            if (user) {
                res.render("auth/profile", { user: user });
            } else {
                res.render("error", { message: "User not found." });
            }
        })
        .catch(err => {
            res.render("error", { message: "An error occurred. Please try again later." });
        });
});



/* GET Log in  page */

router.get("/login", (req, res, next)  =>{
    res.render("auth/login", {errorMessage: 'Password is incorrect'})
})


/* POST Log in  page */

router.post("/login", (req, res)=>{

    const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email }) // --> {email: ..., password:....} || null
  .then(user => {
      if (!user) {
          console.log("Email not registered.");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
          return;
      }

      bcrypt.compare(password, user.password)
          .then(match => {
              if (match) {
                res.redirect(`/profile/${user.username}`);
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

module.exports = router;
