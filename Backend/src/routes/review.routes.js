import { Router } from "express";
import {
  addReview,
  deleteReview,
  getListingReviews,
  updateReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:listingId").get(getListingReviews).post(addReview);
router.route("/c/:reviewId").delete(deleteReview).patch(updateReview);

export default router;
