const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Comment = require("../models/Comment.model");
const Services = require("../models/Services.model");
const PetSitter = require("../models/PetSitter.model");

const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard');


/* GET Signup page */
router.get("/signup",isLoggedOut, (req, res, next) => {
    console.log("req.session",req.session)
    res.render("auth/signup")
});

/* POST Signup  */
router.post("/signup", isLoggedOut, (req, res, next) => {

    const { username, email, password, name, location, role, availability, services, pets, reviews } = req.body;

    bcrypt.hash(password, saltRounds) 
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

/* GET Private Profile page */
router.get("/profile/:username", isLoggedIn, (req, res, next) => {
    const { username } = req.params; 
    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/profile', user);
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
    res.render("auth/login")
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


/* POST Private Profile Page  */
router.post('/update-profile', isLoggedIn, (req, res, next) => {
    const { username, email, name, location } = req.body;
    const userId = req.session.currentUser._id;

    User.findByIdAndUpdate(userId, { username, email, name, location }, { new: true })
        .then(updatedUser => {
            // Update the session information
            req.session.currentUser = updatedUser;
            res.redirect('/profile/' + updatedUser.username);
        })
        .catch(err => {
            console.log(err);
            res.render("error", { message: "An error occurred during the update." });
        });
});


/* GET Public Pet Profile page */
router.get("/pet/:_id", (req, res, next) => {
    const { _id } = req.params;
    Pet.findById(_id)
        .then(pet => {
            if (pet) {
                res.render('public-pet-profile', { pet: pet.toObject() });
            } else {
                res.render("error", { message: "Pet not found." });
            }
        })
        .catch(err => {
            res.render("error", { message: "An error occurred. Please try again later." });
        });
});



/* GET  a new Pet (private) page */
router.get("/auth/pet-signup", isLoggedIn, (req, res, next) => {
    res.render('auth/pet-signup', { title: "Pet Signup" });
});

/* Register a new Pet (private) page */  
router.post("/auth/pet-signup", isLoggedIn, (req, res, next) => {
    const { name, animal, breed, age, temperament, about, healthAndDiet } = req.body;
    let createdPetId;

    Pet.create({ name, animal, breed, age, temperament, about, healthAndDiet })
        .then(newPet => {
            createdPetId = newPet._id;
            return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { pets: createdPetId } });
        })
        .then(() => {
            res.redirect(`/pet/${createdPetId}`);
        })
        .catch(err => {
            res.render('error', { message: "An error occurred while creating the pet's profile." });
        });
});


module.exports = router;
