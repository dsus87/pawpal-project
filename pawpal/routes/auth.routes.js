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
        res.redirect(`/profile`)
    })
.catch(err => console.log(err))

});

/* GET Profile page */
router.get("/profile", (req, res, next) => {
    res.render("auth/private-profile");  // public if not same user
});



module.exports = router;
