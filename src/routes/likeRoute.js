import express from "express";
import fileUpload from "../helper/multer.js";
import { normalUserAuthentication } from "../middleware/Authentication.js";


import { 
    likePost,
 } from "../controller/likesController.js";
 

 const likeRoute = express.Router();
 likeRoute.post("/posts/like/:postId",normalUserAuthentication,fileUpload.single("postImage"), likePost);


 export default likeRoute;