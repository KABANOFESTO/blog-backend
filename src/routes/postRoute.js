import express from "express";
import multerPkg from 'multer';
const { diskStorage } = multerPkg;

import { adminAuthorization } from "../middleware/Authentication.js";
import {
  addPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getCategories,
  getPostsByCategory,
  likePost,
  unLikePost
} from "../controller/postController.js";
import videoController from "../controller/videoController.js";

// Multer setup
const storage = diskStorage({});
const fileUpload = multerPkg({ storage });
const upload = multerPkg({ storage });

const postRoute = express.Router();

postRoute.post("/posts/add", adminAuthorization, fileUpload.single("postImage"), addPost);
postRoute.get("/posts/get/all", getAllPosts);
postRoute.get("/posts/single/post/:id", getSinglePost);
postRoute.put("/posts/update/:id", adminAuthorization, fileUpload.single("postImage"), updatePost);
postRoute.delete("/posts/delete/:id", adminAuthorization, deletePost);

postRoute.post("/posts/upload", adminAuthorization, upload.single("video"), videoController.uploadVideo);

postRoute.get("/categories", getCategories);
postRoute.get("/posts/category/:category", getPostsByCategory);

// 🆕 Like & Unlike routes
postRoute.put("/posts/:id/like", likePost);
postRoute.put("/posts/:id/unlike", unLikePost);

export default postRoute;
