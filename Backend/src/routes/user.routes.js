import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  deleteCurrentUser,
  updateUserImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for registering a user
router.route("/register").post(
  // Middleware for handling file uploads
  upload.fields([
    {
      name: "image", // Field name for image image
      maxCount: 1, // Maximum number of files allowed
    },
  ]),
  registerUser // Controller function for registering a user
);

router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/delete-account").delete(verifyJWT, deleteCurrentUser);
router
  .route("/image")
  .patch(verifyJWT, upload.single("image"), updateUserImage);

export default router;
