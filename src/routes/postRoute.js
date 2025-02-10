import express from "express";
import fileUpload from "../helper/multer";
import { adminAuthorization } from "../middleware/Authentication";
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
} from "../controller/postController";

const multer = require('multer');
const videoController = require('../controller/videoController');
const storage = multer.diskStorage({});
const upload = multer({ storage });

const postRoute = express.Router();


postRoute.post("/posts/add", adminAuthorization, fileUpload.single("postImage"), addPost);
postRoute.get("/posts/get/all", getAllPosts);
postRoute.get("/posts/single/post/:id", getSinglePost);
postRoute.put("/posts/update/:id", adminAuthorization, fileUpload.single("postImage"), updatePost);
postRoute.delete("/posts/delete/:id", adminAuthorization, deletePost);
postRoute.post('/posts/upload', adminAuthorization, upload.single('video'), videoController.uploadVideo);

postRoute.get('/categories', getCategories);
postRoute.get('/posts/category/:category', getPostsByCategory);

export default postRoute;
