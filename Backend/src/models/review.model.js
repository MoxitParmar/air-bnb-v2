import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    listing: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);
