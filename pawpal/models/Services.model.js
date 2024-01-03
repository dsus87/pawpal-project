
const mongoose = require('mongoose');

const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
    servicesOffered: { 
      type: String, 
      enum: ['Boarding', 'Sitting', 'Walking'] 
    },
    petSitter: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });
  
  const Service = mongoose.model('Service', serviceSchema);

  module.exports = Service;