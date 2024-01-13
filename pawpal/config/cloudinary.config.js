
// interact with cloudinary and extract information from forms
 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer'); // "interpretor" for the form
require('dotenv').config({path:__dirname+'/../.env'})
console.log(process.env.CLOUDINARY_KEY)

// where to send the file:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({ //where we want to send the files
    // cloudinary: cloudinary,
    cloudinary,
    params: {
      allowed_formats: ['jpg', 'png'],
      folder: 'pawpal-folder' // The name of the folder in cloudinary. It is going to create a folder in cloudinary when pictures are upload
      }
  });

module.exports = multer({ storage });
