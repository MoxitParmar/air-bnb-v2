import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    price: Number,
    location: String,
    country: String,

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
