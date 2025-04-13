import express from "express";
import fileUpload from "../helper/multer.js";
import { normalUserAuthentication,adminAuthorization } from "../middleware/Authentication.js";



import { 
    addReply,
    getAll,
    getReply,
    deleteReply,
 } from "../controller/replyController.js";

const replyRoute = express.Router();
replyRoute.post("/replies/add/:id",normalUserAuthentication,fileUpload.single("postImage"),addReply);
replyRoute.get("/replies/all", getAll);
replyRoute.get("/replies/single/:id", getReply);
replyRoute.delete("/replies/delete/:id",adminAuthorization,deleteReply);

export default replyRoute;