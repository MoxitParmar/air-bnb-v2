import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//we use this middleware to verify the access token of the user so then we can logout the user
export const verifyJWT = asyncHandler(async (req, _, next) => {
  //get the access token from the request header or cookies
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  //if the token is not present then throw an error
  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }

  //verify the token
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //find the user by the id present in the token
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new apiError(401, "Invalid Access token");
  }

  //set the user in the request object to use it in the next middleware
  req.user = user;
  next();
});
