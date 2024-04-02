import express from "express";
import { getAllMessages,addMessage,deleteMessage} from "../controller/messagesController";


const postRoute = express.Router();

postRoute.get("/mesages/get/all",getAllMessages);
postRoute.post("/mesages/add",addMessage);
postRoute.delete("/mesages/delete/:id",deleteMessage);

export default postRoute;


