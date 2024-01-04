const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
router.post("/signup", isLoggedOut, upload.single('photo'), (req, res, next) => {
    const { username, email, password, name, location, role, availability, services, pets, reviews } = req.body;

    User.findOne({ username: username })
    .then(user => {
        if (user) {
            // If a user with the same username exists, render an error message
            return res.render("auth/signup", { errorMessage: "Username already taken." });
        } else {
            // If username is not taken, proceed to hash the password
            return bcrypt.hash(password, saltRounds);
        }
    })

    .then((hash) => {
        const userData = { username, email, password: hash, name, location, role, availability, services, pets, reviews };
        
        if (req.file) {
            userData.photo = req.file.path;
        }

        return User.create(userData);
    })
    .then(user => {
        req.session.currentUser = user;
        res.render('auth/profile', user);
    })
    .catch(err => {
        console.error(err);
        res.render("error", { message: "An error occurred during signup." });
    });
});


/* GET Private Profile page */
router.get("/auth/profile/:username", isLoggedIn, (req, res, next) => {
    const { username } = req.params; 
    User.findOne({ username })
        .populate('pets')  
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



/* POST Private Profile Page  */
router.post('/update-profile', isLoggedIn, upload.single('photo'), (req, res, next) => {
    const { username, email, password, name, location, role, about,  availability, services, pets, reviews } = req.body;
    const userId = req.session.currentUser._id;

    User.findOne({ username: username, _id: { $ne: userId } })
        .then(existingUser => {
            if (existingUser) {
                res.render('auth/profile', { 
                    user: req.session.currentUser,
                    errorMessage: "Username already taken."
                });
            } else {
                const updateData = { username, email, password, name, location, role, about, availability, services, pets, reviews };
                
                if (req.file) {
                    updateData.photo = req.file.path;
                }

                return User.findByIdAndUpdate(userId, updateData, { new: true })
                    .then(updatedUser => {
                        req.session.currentUser = updatedUser;
                        res.redirect('auth/profile/' + updatedUser.username);
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.render("error", { message: "An error occurred during the update." });
        });
});





/* GET Public Profile page */
router.get("/profile/:username",upload.single('photo'), (req, res, next) => {
    const { username } = req.params;
    console.log("Username:", username);  
    User.findOne({ username })
     .populate({
        path: 'reviews', 
        populate: { 
            path: 'author', 
            model: 'User',
            select: 'username' 
        }
    })
        .then(user => {
            console.log("Found user:", user); 
            if (user) {
                res.render('public-profile', user.toObject());
            } else {
                res.render("error", { message: "User not found." });
            }
        })
        .catch(err => {
            console.log("Error:", err); 
            res.render("error", { message: "An error occurred. Please try again later." });
        });
});




/* GET Log in  page */
router.get("/login",isLoggedOut, (req, res, next)  =>{
    res.render("auth/login")
})


/* POST Log in  page */

router.post("/login",isLoggedOut, (req, res)=>{

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

/* POST Logout page */

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



/* GET new Pet (private) page */
router.get("/auth/pet-signup", isLoggedIn, (req, res, next) => {
    res.render('auth/pet-signup', { title: "Pet Signup" });
});

/* Register a new Pet (private) page */  
router.post("/auth/pet-signup", isLoggedIn, upload.single('photo'), (req, res, next) => {
    const { name, animal, breed, age, temperament, about, healthAndDiet } = req.body;
    let createdPetId;

    const petData = { name, animal, breed, age, temperament, about, healthAndDiet };

    if (req.file) {
        petData.photo = req.file.path;
    }

    Pet.create(petData)
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


/* GET Pet (private) page */
router.get("/auth/pet-profile/:_id", isLoggedIn, (req, res, next) => {

    const { _id } = req.params;
    Pet.findById(_id)
        .then(pet => {
            if (pet) {
                res.render('auth/pet-profile', { pet: pet.toObject() });
            } else {
                res.render("error", { message: "Pet not found." });
            }
        })
        .catch(err => {
            res.render("error", { message: "An error occurred. Please try again later." });
        });

});


/* Edit a Pet (private) page */  
router.post("/auth/pet-profile", isLoggedIn, upload.single('photo'), (req, res, next) => {
    console.log(req.body)
    const { name, animal, breed, age, temperament, about, healthAndDiet, _id } = req.body;

    const petData = { name, animal, breed, age, temperament, about, healthAndDiet };

    if (req.file) {
        petData.photo = req.file.path;
    }

    Pet.findByIdAndUpdate(_id, petData )
        .then(() => {
            res.redirect(`/pet/${(_id)}`);
        })
        .catch(err => {
            res.render('error', { message: "An error occurred while editing the pet's profile." });
        });
});

 
/* GET Search Page for Pet Sitter*/
router.get("/all-sitters", async (req, res, next) => {
    try {
        const petSitters = await User.find({ role: 'Pet Sitter' });
        res.render('all-pet-sitters', { title: "All Pet Sitters Search", petSitters });
    } catch (error) {
        next(error);
    }
});


/* POST Comment on Public Profile */
router.post('/profile/:username/comment', isLoggedIn, (req, res, next) => {
    const { username } = req.params;
    const { content, rating } = req.body;
    let profileUser;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                throw new Error('User not found.');
            }
            profileUser = user;

            const newComment = new Comment({
                author: req.session.currentUser._id, // Set the author of the comment to the current logged-in user
                relatedPet: user._id, 
                content,
                rating
            });

            // Save the new comment to the database
            return newComment.save();
        })
        .then((savedComment) => {
            return User.findByIdAndUpdate(profileUser._id, 
                { $push: { reviews: savedComment._id } },
            );
        })
        .then(() => {
            res.redirect(`/profile/${username}`);
        })
        .catch(err => {
            console.error(err);
            res.render("error", { message: "An error occurred while posting the comment." });
        });
});


module.exports = router;
