
const mongoose = require('mongoose');

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    
    location: {
      type: String,
    },
    photo:{ 
      type: String,
    },
    role: [
      {
        type: String,
        enum: ['Pet Sitter', 'Pet Owner'],
      },
    ],

    about: {
      type: String,
    },

    availability: {   // boolean 
      type: String, 
      enum: ['Available', 'Unavailable'] 
    },


    services: [{ 
      type: String, 
      enum: ['Pet Boarding', 'Dog Walking', 'Pet Sitting'],
    }],


    pets: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Pet'       //  the relationship is on pet should be only referring to only owner should not be in the user model
    }],


    reviews: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Comment' 
    }]


  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
