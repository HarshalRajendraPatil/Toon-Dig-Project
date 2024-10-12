import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./Middlewares/errorHandler.js";
import fileUpload from "express-fileupload";
import { config } from "dotenv";

import authRoutes from "./Routes/authRoute.js";
import animeManagementRoutes from "./Routes/animeManagementRoute.js";
import seasonManagementRoutes from "./Routes/seasonManagementRoute.js";
import episodeManagementRoutes from "./Routes/episodeManagementRoute.js";

const app = express();
config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["PUT", "POST", "GET", "DELETE"],
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use("/api/auth", authRoutes);
app.use(
  "/api/admin",
  animeManagementRoutes,
  seasonManagementRoutes,
  episodeManagementRoutes
);

app.use(errorHandler);

export default app;
