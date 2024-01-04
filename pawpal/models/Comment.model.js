

const mongoose = require('mongoose');

const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  relatedPet: { 
    type: Schema.Types.ObjectId, 
    ref: 'Pet' 
  },
  content: {
  type: String,
  },
  rating: {
    type: Number,
    min: 0,   
    max: 5, 
    required: true 
  },

});
  
  const Comment = mongoose.model('Comment', commentSchema);

  module.exports = Comment;