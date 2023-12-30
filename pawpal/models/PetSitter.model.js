const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const petSitterSchema = new Schema({
  name: String,
  aboutMe: String,
  availability: String,
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  //localization ?? More stuff??
});

const PetSitter = mongoose.model('PetSitter', petSitterSchema);

module.exports = PetSitter;