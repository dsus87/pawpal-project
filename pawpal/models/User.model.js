
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
      // required: [true, "Name is required."],
    },
    
    location: { 
      type: String, 
      enum: ['Berlin', 'Amsterdam', 'Portugal'],
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

    availability: {
      type: Boolean,
  
    },

    services: [{ 
      type: String, 
      enum: ['Pet Boarding', 'Dog Walking', 'Pet Sitting'],
    }],

    price: { 
      type: Number,
    },

    pets: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Pet'       
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
