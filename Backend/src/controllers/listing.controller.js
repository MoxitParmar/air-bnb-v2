import { Listing } from "../models/listing.model.js";
process.loadEnvFile(".env");
import { apiError } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
import {
  uploadOnCloudinary,
  extractPublicId,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const getAllListings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 2,
    sortBy = "createdAt",
    sortType = -1,
  } = req.query;

  const getlistings = await Listing.aggregate([
    {
      // join with users table to get the owner details
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      // unwind the owner array to get the owner details as an object
      $unwind: "$owner",
    },
    {
      // sort the listings by the sortBy field in the sortType order
      $sort: { [sortBy]: sortType },
    },
    {
      // skip the listings based on the page number if it is page 2 then
      // it skips the listings of page 1 and shows the listings of page 2
      $skip: (page - 1) * limit,
    },
    {
      // limit the number of listings on the current page
      $limit: parseInt(limit, 10),
    },
    {
      $project: {
        title: 1,
        description: 1,
        image: 1,
        owner: {
          _id: 1,
          username: 1,
        },
      },
    },
  ]);

  if (!getlistings) {
    throw new apiError(404, "listings not found");
  }

  return res
    .status(200)
    .json(new apiResponce(200, getlistings, "searched listings found"));
});

// Get all listings by search query
const getSearchedListings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 2,
    query,
    sortBy = "createdAt",
    sortType = -1,
  } = req.query;

  const getlistings = await Listing.aggregate([
    {
      // search by title or description
      $match: {
        $or: [
          { title: { $regex: query || "", $options: "i" } },
          { description: { $regex: query || "", $options: "i" } },
        ],
      },
    },
    {
      // join with users table to get the owner details
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      // unwind the owner array to get the owner details as an object
      $unwind: "$owner",
    },
    {
      // sort the listings by the sortBy field in the sortType order
      $sort: { [sortBy]: sortType },
    },
    {
      // skip the listings based on the page number if it is page 2 then
      // it skips the listings of page 1 and shows the listings of page 2
      $skip: (page - 1) * limit,
    },
    {
      // limit the number of listings on the current page
      $limit: parseInt(limit, 10),
    },
    {
      $project: {
        title: 1,
        description: 1,
        image: 1,
        owner: {
          _id: 1,
          username: 1,
        },
      },
    },
  ]);

  if (!getlistings) {
    throw new apiError(404, "listings not found");
  }

  return res
    .status(200)
    .json(new apiResponce(200, getlistings, "searched listings found"));
});

// Publish a listing
const createListing = asyncHandler(async (req, res) => {
  const { title, description, location, price, country } = req.body;

  let responce = await geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();
  console.log(responce.body.features[0].geometry);
  const geometry = responce.body.features[0].geometry;
  // Get the local path for the listing and image
  const listingLocalPath = req.files?.image?.[0].path;

  if (!listingLocalPath) {
    throw new apiError(400, "image required");
  }

  // Upload the listing and image to cloudinary
  const image = await uploadOnCloudinary(listingLocalPath, "listing");

  if (!image) {
    throw new apiError(400, "Upload failed");
  }

  // Create a new listing
  const listing = await Listing.create({
    title,
    description,
    image: image.url,
    owner: req.user._id,
    price,
    location,
    geometry: geometry,
    country,
  });

  //  Retrieve the created listing from the database
  const createdListing = await Listing.findById(listing._id);

  // Check if the listing was successfully created
  if (!createdListing) {
    throw new apiError(500, "listing not created");
  }

  // Return a success response with the created listing
  return res
    .status(201)
    .json(new apiResponce(200, createdListing, "listing created successfully"));
});

// Get a listing by id and set view and watch history
const getListingById = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  if (!isValidObjectId(listingId)) {
    throw new apiError(400, "invalid listing id");
  }

  // set views and watch history
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new apiError(404, "Listing not found");
  }

  return res.status(200).json(new apiResponce(200, listing, "Listing found"));
});

// Update the listing details
const updateListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  if (!isValidObjectId(listingId)) {
    throw new apiError(400, "invalid listing id");
  }

  const { title, description, location, price, country } = req.body;
  let responce = await geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new apiError(404, "Listing not found");
  }

  const publicId = await extractPublicId(listing.image);
  await deleteFromCloudinary(publicId);

  // upload the new image
  const imageLocalPath = req.file?.path;
  // console.log(req.file?.path);
  const image = await uploadOnCloudinary(imageLocalPath);
  // const image = await uploadOnCloudinary(imageLocalPath, "image");

  if (!image) {
    throw new apiError(400, "Error while Uploading image");
  }

  const geometry = responce.body.features[0].geometry;
  // update the listing details
  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    {
      $set: {
        title,
        description,
        image: image.url,
        location,
        price,
        country,
        geometry: geometry,
      },
    },
    { new: true }
  );

  if (!updatedListing) {
    throw new apiError(500, "listing not updated");
  }

  return res
    .status(200)
    .json(new apiResponce(200, updatedListing, "listing updated successfully"));
});

// Delete a listing by listingId
const deleteListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  if (!isValidObjectId(listingId)) {
    throw new apiError(400, "invalid listing id");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new apiError(404, "Listing not found");
  }

  // delete the image and listing from cloudinary

  const publicId0 = await extractPublicId(listing.image);
  await deleteFromCloudinary(publicId0);

  // delete the listing from the database
  await Listing.findByIdAndDelete(listingId);

  return res
    .status(200)
    .json(new apiResponce(200, {}, "listing deleted successfully"));
});

export {
  getAllListings,
  getSearchedListings,
  createListing,
  getListingById,
  updateListing,
  deleteListing,
};
