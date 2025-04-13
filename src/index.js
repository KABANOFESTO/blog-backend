import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
// Import database configuration
import connectDB from "../src/Database/config/config.js";
// importing routes
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messagesRoute from "./routes/messageRoute.js";
import commentRoute from "./routes/commentRoute.js";
import replyRoute from "./routes/replyRoute.js";
import likeRoute from "./routes/likeRoute.js";
import dislikeRoute from "./routes/dislikeRoute.js";
import quoteRoute from "./routes/quoteRoute.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

// Initialize Express app
const app = express();

// Database connection
connectDB(); // Connect to the database

// Documentation Setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MongoDB Blog API Node JS",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:2400/",
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
  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/PostgreSQL/API", userRoute);
app.use("/PostgreSQL/API", postRoute);
app.use("/PostgreSQL/API", commentRoute);
app.use("/PostgreSQL/API", replyRoute);
app.use("/PostgreSQL/API", likeRoute);
app.use("/PostgreSQL/API", dislikeRoute);
app.use("/PostgreSQL/API", messagesRoute);
app.use("/PostgreSQL/API", quoteRoute);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "200",
    author: "cedro",
    message: "Welcome to MongoDB API",
  });
});

// Server startup
const PORT = process.env.PORT || 2300;
app.listen(PORT, () => {
  console.log(`Server is running on port:http://localhost:${PORT}`);
});