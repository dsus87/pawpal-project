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
    owner: {  // each pet has only one owner
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    
    comments: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Comment' 
    }]
    
  });
  
  const Pet = mongoose.model('Pet', petSchema);

  module.exports = Pet;