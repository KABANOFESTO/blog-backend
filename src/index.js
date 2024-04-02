import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";


// importing routes

import userRoute from "./routes/userRoute";
import postRoute from "./routes/postRoute";
import messagesRoute from "./routes/messageRoute";
import commentRoute from "./routes/commentRoute";
import replyRoute from "./routes/replyRoute";
import likeRoute from "./routes/likeRoute";
import dislikeRoute from "./routes/dislikeRoute";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { Sequelize } from "sequelize";
dotenv.config();
const db = new Sequelize(process.env.DbConnection);
const connectToDatabase = async () => {
    try {
        await db.authenticate();
        console.log("Database connected successfully")
        
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
connectToDatabase()

const app = express();
//Documentation Side

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PostgreSQL Blog API Node JS",
      version: "1.0.0",
    },
    servers: [
      {
        
        url: "https://blogbeckend.onrender.com/",
        // url: "http://localhost:2400/",
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/docs/*.js"], //determination of path
};
const swaggerSpec = swaggerJSDoc(options)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Require app to use imported routes

app.use("/PostgreSQL/API", userRoute);
app.use("/PostgreSQL/API", postRoute);
app.use("/PostgreSQL/API", commentRoute);
app.use("/PostgreSQL/API", replyRoute);
app.use("/PostgreSQL/API", likeRoute);
app.use("/PostgreSQL/API", dislikeRoute);
app.use("/PostgreSQL/API", messagesRoute);
app.get("/", (req, res) =>{
    res.status(200).json({
        status: "200",
        author: "cedro",
        message: "Welcome to postgresql API",

    });
});
const PORT = process.env.PORT || 2300;
app.listen(PORT, () =>{
    console.log(`Server is running on port:http://localhost:${PORT}`);

});
