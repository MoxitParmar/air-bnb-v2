import mongoose, { isValidObjectId } from "mongoose";
import { Review } from "../models/review.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getListingReviews = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.aggregate([
    {
      $match: { listing: new mongoose.Types.ObjectId(listingId) },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit, 10),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        rating: 1,
        createdAt: 1,
        owner: 1,
      },
    },
  ]);

  res.json(new apiResponce(200, reviews, "reviews retrieved successfully"));
});

const addReview = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  if (!isValidObjectId(listingId)) {
    throw new apiError(400, "invalid listing id");
  }

  const { text } = req.body;
  const { number } = req.body;

  const review = await Review.create({
    rating: number,
    content: text,
    listing: listingId,
    owner: req.user._id,
  });

  const createdReview = await Review.findById(review._id);
  if (!createdReview) {
    throw new apiError(500, "review not created");
  }

  res.json(new apiResponce(200, createdReview, "review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { text } = req.body;

  const { number } = req.body;
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $set: { content: text, rating: number } },
    { new: true }
  );

  if (!review) {
    throw new apiError(500, "review not updated");
  }

  res.json(new apiResponce(200, review, "review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);

  res.json(new apiResponce(200, null, "review deleted successfully"));
});

export { getListingReviews, addReview, updateReview, deleteReview };
