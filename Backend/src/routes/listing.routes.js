import { Router } from "express";
import {
  getAllListings,
  getSearchedListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/search").get(getSearchedListings);

router
  .route("/")
  .get(getAllListings)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    createListing
  );

router
  .route("/:listingId")
  .get(verifyJWT, getListingById)
  .delete(verifyJWT, deleteListing)
  .patch(verifyJWT, upload.single("image"), updateListing);

export default router;
