import express from "express";
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    changeUserRole,
 } from "../controller/userController.js";
import fileUpload from "../helper/multer.js";

const userRoute = express.Router();

userRoute.post("/signup", fileUpload.single("profile"), registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/", getAllUsers);
userRoute.get("/:id", getUserProfile);
userRoute.put("/:id", fileUpload.single("profile"), updateUserProfile);
userRoute.delete("/:id", deleteUserAccount);
// For deleteAllUsers, you might need to create that function or adjust based on your needs

export default userRoute;