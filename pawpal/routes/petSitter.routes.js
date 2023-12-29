const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn'); //check if a user is logged in.
const PetSitter = require('../models/PetSitter.model'); //Model representing a pet sitter.

// Route to display all pet sitters
router.get('/pet-sitters', (req, res, next) => {
  PetSitter.find() //receive all pet sitters from database
    .then((petSitters) => {
      res.render('all-pet-sitters', { petSitters }); //passes the array of pet sitters as petSitters to be used in the template.
    })
    .catch((err) => {
      next(err);
    });
});

// Route to display detailed information about a specific pet sitter
router.get('/pet-sitters/:id', (req, res, next) => {
  const petSitterId = req.params.id;
  PetSitter.findById(petSitterId)
    .then((petSitter) => {
      if (!petSitter) {
        return res.render('not-found');  // If the pet sitter is not found,'not-found'.
      }
      res.render('pet-sitter-details', { petSitter }); // If the pet sitter is found, 'pet-sitter-details' hbs template.
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;