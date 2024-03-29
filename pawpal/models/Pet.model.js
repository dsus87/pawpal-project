const mongoose = require('mongoose');

const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  
    name: String,
    animal: { 
      type: String, 
      enum: ['Dog', 'Cat'] 
    },
    breed: String,
    age: Number,
    temperament: { 
      type: String, 
      enum: ['Playful', 'Energetic', 'Couch Potato'] 
    },
    about: { 
      type: String, 
    },
    photo: {
      type: String
    },
    healthAndDiet: String,
    
    comments: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Comment' 
    }],

    location: { 
      type: String, 
      enum: ['Berlin', 'Amsterdam', 'Lisbon'],
    },
    
  });
  
  const Pet = mongoose.model('Pet', petSchema);

  module.exports = Pet;