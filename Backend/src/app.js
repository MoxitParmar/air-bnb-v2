import express from "express"; // Importing the Express framework
import cors from "cors"; // Importing the CORS middleware
import cookieParser from "cookie-parser"; // Importing the cookie-parser middleware

const app = express(); // Creating an instance of the Express application

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allowing requests from the specified origin
    credentials: true, // Allowing credentials to be included in requests
  })
);

app.use(express.json({ limit: "16kb" })); // Parsing JSON requests with a maximum size of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parsing URL-encoded requests with a maximum size of 16kb
app.use(express.static("public")); // Serving static files from the "public" directory
app.use(cookieParser()); // Parsing cookies from incoming requests

import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import listingRouter from "./routes/listing.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);

export { app }; // Exporting the Express application
