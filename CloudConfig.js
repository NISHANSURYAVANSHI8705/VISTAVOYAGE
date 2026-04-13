const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//iske andar hum configuration details pass karte hein,kisi cheez ko configure karne ka matlab hota hein ki cheezon ko jodna so here we are going to connect our backend with cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//cloudinary ka account bana liya par usmein bhi kaha kis folder mein files store ya upload karne hein isgiven in storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats:["png","jpg","jpeg"]// supports promises as well
  },
});

module.exports = {
    cloudinary,
    storage
}