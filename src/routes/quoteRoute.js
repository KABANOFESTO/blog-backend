import express from "express";
import { adminAuthorization } from "../middleware/Authentication";
import {
  addQuote,
  getAllQuotes,
  getSingleQuote,
  updateQuote,
  deleteQuote
} from "../controller/quoteController";

const quoteRoute = express.Router();

// Quote routes
quoteRoute.post("/quotes/add", adminAuthorization, addQuote);
quoteRoute.get("/quotes/get/all", getAllQuotes);
quoteRoute.get("/quotes/single/:id", getSingleQuote);
quoteRoute.put("/quotes/update/:id", adminAuthorization, updateQuote);
quoteRoute.delete("/quotes/delete/:id", adminAuthorization, deleteQuote);

export default quoteRoute;