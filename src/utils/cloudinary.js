require('dotenv').config();
const Cloudinary = require('cloudinary').v2;
const fs = require('fs');
Cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret,
});



const uploadImage = async (filePath) => {
    try {
        if(!filePath) return null
        const result = await Cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        fs.unlinkSync(filePath)
        return result;
} catch (error) {
        console.error('Error uploading image:', error);
       
        fs.unlinkSync(filePath)
        throw error;
       
         
    }
}
module.exports = {
    uploadImage,
    Cloudinary
};