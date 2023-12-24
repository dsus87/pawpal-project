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
    healthAndDiet: String,
    photo: String,
    comments: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Comment' 
    }]
  });
  
  const Pet = mongoose.model('Pet', petSchema);