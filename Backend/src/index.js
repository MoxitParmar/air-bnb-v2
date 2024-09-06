import connectDB from "./db/index.db.js";
import { app } from "./app.js";

process.loadEnvFile(".env");

//Error handling after Connection to the database
connectDB()
  .then(() => {
    // Handle any errors that occur in the express app
    app.on("error", (error) => {
      console.log(error);
      throw error;
    });

    // Start the express server and listen for incoming requests
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });
