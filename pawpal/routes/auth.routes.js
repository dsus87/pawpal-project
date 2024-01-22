const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const fileUploader = require('../config/cloudinary.config');


const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Comment = require("../models/Comment.model");


const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard');


/* GET Signup page */
router.get("/signup",isLoggedOut, (req, res, next) => {
    console.log("req.session",req.session)
    res.render("auth/signup")
});

/* POST Signup  */
router.post("/signup", isLoggedOut, fileUploader.single('photo'), (req, res, next) => {
    const { username, email, password, name, location, role, availability, services, pets, reviews} = req.body;
    console.log(req.body)
console.log(req.file)


if (!password || password === '') {
    return res.render("auth/signup", { errorMessage: "Please enter a password." });
}

    User.findOne({ username: username })
    .then(user => {
        if (user) {
            return res.render("auth/signup", { errorMessage: "Username already taken." });
        } else {
            return bcrypt.hash(password, saltRounds);
        }
    })

    .then((hash) => {
        const userData = { username, email, password: hash, name, location, role, availability};
        
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
router.get("/auth/profile/:username", fileUploader.single('photo'),isLoggedIn, (req, res, next) => {
    const { username } = req.params; 
    User.findOne({ username })
    .populate('pets') 
    .populate('services')
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
router.post('/update-profile', isLoggedIn, fileUploader.single('photo'), (req, res, next) => {
    const { username, email, password, name, location, role, about,  availability, services, pets, reviews, price } = req.body;
    const userId = req.session.currentUser._id;

    User.findOne({ username: username, _id: { $ne: userId } })
        .then(existingUser => {
            if (existingUser) {
                res.render('auth/profile', { 
                    user: req.session.currentUser,
                    errorMessage: "Username already taken."
                });
            } else {
                const updateData = { username, email, password, name, location, role, about, availability,services,price };
                
                if (req.file) {
                    console.log("Uploaded file info:", req.file); 
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
router.get("/profile/:username", fileUploader.single('photo'), (req, res, next) => {
    const { username } = req.params;
    console.log("Username:", username);  
    User.findOne({ username })
     .populate('pets')
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
  .populate('pets') 
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
                res.redirect(`/`); // interpolation /template literals // get route for render 
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

/* GET Public Pet Page */
router.get("/pet/:_id", (req, res, next) => {
    const { _id } = req.params;

    Pet.findById(_id)
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User',
                select: 'username'
            }
        })
        .then(pet => {
            if (!pet) {
                throw new Error("Pet not found.");
            }

            // Find the owner of the pet by searching the 'User' collection where the pet's id is listed under 'pets'.
            return User.findOne({ pets: _id }).select('username email location')
            .then(owner => {
                console.log(JSON.stringify(pet, null, 2)); // Log to check the pet object
                res.render('public-pet-profile', { pet: pet.toObject(), owner }); // Render the page with pet and owner data
            });
        })
        .catch(err => {
            res.render("error", { message: err.message || "An error occurred. Please try again later." });
        });
});





/* GET new Pet (private) page */
router.get("/auth/pet-signup", isLoggedIn, (req, res, next) => {
    res.render('auth/pet-signup', { title: "Pet Signup" });
});

/* Register a new Pet (private) page */  
router.post("/auth/pet-signup", isLoggedIn, fileUploader.single('photo'), (req, res, next) => {
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
router.post("/auth/pet-profile", isLoggedIn, fileUploader.single('photo'), (req, res, next) => {
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

/* DELETE Pet (private) page */
router.get("/auth/delete-pet/:_id", isLoggedIn, (req, res, next) => {
    const { _id } = req.params;

    // Find the pet by ID and remove it
    Pet.findOneAndDelete({ _id })
        .then((deletedPet) => {
            if (!deletedPet) {
                return res.status(404).render("error", { message: "Pet not found." });
            }

            // Remove the pet ID from the user's pets array
            return User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { pets: _id } });
        })
        .then(() => {
            res.redirect('/auth/profile/' + req.session.currentUser.username); // Redirect to my private profile page
        })
        .catch((err) => {
            console.error(err);
            res.status(500).render("error", { message: "An error occurred while deleting the pet." });
        });
});


 
/* GET Search Page for Pet Sitter*/
router.get("/all-sitters", (req, res, next) => {
    let query = { role: 'Pet Sitter' };
    const { location, availability, services } = req.query;

    if (location) {
        query.location = location;
    }
    if (availability) {
        query.availability = availability;
    }
    if (services) {
        query.services = services;
    }

    User.find(query)
        .then(petSitters => {
            res.render('all-pet-sitters', { petSitters });
        })
        .catch(error => {
            next(error);
        });
});

/* GET - Pets with Filters */
router.get("/find-my-pet", (req, res, next) => {
    let query = {};
    const { animal, temperament } = req.query;

    if (animal) {
        query.animal = animal;
    }
    if (temperament) {
        query.temperament = temperament;
    }
   
    Pet.find(query)
        .then(allPets => {
            res.render('find-my-pet', { allPets });
        })
        .catch(error => {
            next(error);
        });
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
                author: req.session.currentUser._id, 
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

/* POST Comment on Public Pet Profile */
router.post('/pet/:petId/comment', isLoggedIn, (req, res, next) => {
    const { petId } = req.params;
    const { content, rating } = req.body;
    let pet;

    Pet.findById(petId)
        
        .then(foundPet => {
            if (!foundPet) {
                throw new Error('Pet not found.');
            }
            pet = foundPet;

            const newComment = new Comment({
                author: req.session.currentUser._id,
                relatedPet: pet._id,
                content,
                rating
            });

            // Save the new comment to the database
            return newComment.save();
        })
        .then(savedComment => {
            // Update the pet's document with the new comment ID
            return Pet.findByIdAndUpdate(pet._id,
                { $push: { comments: savedComment._id } },
            );
        })
        .then(() => {
            // Redirect to the pet's profile page
            res.redirect(`/pet/${petId}`);
        })
        .catch(err => {
            console.error(err);
            res.render("error", { message: "An error occurred while posting the comment." });
        });
});


module.exports = router;
