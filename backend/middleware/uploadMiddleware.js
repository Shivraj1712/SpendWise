import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const createStorage = (
  folderName,
  width = 200,
  height = 200,
  cropType = "limit"
) => {
  return new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      return {
        folder: `SpendWise/${folderName}/${req.user._id}/`,
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width, height, crop: cropType }],
      };
    },
  });
};

const profileStorage = createStorage("profilePics", 200, 200, "limit");

const upload = multer({ storage: profileStorage });
export default upload;
