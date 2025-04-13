import express from "express";
import { getAllMessages, addMessage, deleteMessage } from "../controller/messagesController.js";

const messagesRoute = express.Router();

messagesRoute.get("/messages/get/all", getAllMessages);
messagesRoute.post("/messages/add", addMessage);
messagesRoute.delete("/messages/delete/:id", deleteMessage);

export default messagesRoute;