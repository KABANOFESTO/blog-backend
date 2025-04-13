    import express from "express";
    import fileUpload from "../helper/multer.js";
    import { normalUserAuthentication } from "../middleware/Authentication.js";
    import { 
        disLikePost,
    } from "../controller/unlikeController.js";

    const dislikeRoute = express.Router();
    dislikeRoute.post("/posts/dislike/:postId",normalUserAuthentication,fileUpload.single("postImage"),disLikePost);
    export default dislikeRoute;
