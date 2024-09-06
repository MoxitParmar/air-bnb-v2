import multer from "multer";

// Create a disk storage configuration for multer
const storage = multer.diskStorage({
  // Specify the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create a multer instance with the configured storage
export const upload = multer({
  storage,
});
