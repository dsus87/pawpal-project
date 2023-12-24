const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
      Type: String,
    },
    role: {
        type: String, 
        enum: ['Pet-sitter', 'Pet-owner'],
        required: true,
    },
    availability: { 
      type: String, 
      enum: ['Available', 'Unavailable'] 
    },
    services: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Service' 
    }],
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
