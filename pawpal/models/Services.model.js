
const mongoose = require('mongoose');

const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  servicesOffered: [{ 
    type: String, 
    enum: ['Boarding', 'Sitting', 'Walking']
}],
    petSitter: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });

  // add an interaction services taken or not?
  // clients when you take a service the user takes it becomes a client //provider/client 
  
  const Service = mongoose.model('Service', serviceSchema);

  module.exports = Service;