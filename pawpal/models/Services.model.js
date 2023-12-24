const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
    servicesOffered: { 
      type: String, 
      enum: ['Walking', 'Sitting', 'Cleaning'] 
    },
    petSitter: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });
  
  const Service = mongoose.model('Service', serviceSchema);