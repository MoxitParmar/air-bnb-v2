import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
process.loadEnvFile(".env");

// Configure cloudinary with the provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);

    return null;
  }
};

// Function to extract the public ID from a cloudinary URL
const extractPublicId = (cloudinaryUrl) => {
  const splitUrl = cloudinaryUrl.split("/");

  const publicId = splitUrl[splitUrl.length - 1].split(".")[0];

  return publicId;
};

// function to delete an image from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicId };
