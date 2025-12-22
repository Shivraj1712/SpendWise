import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connect from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import helmet from "helmet";
dotenv.config();
connect();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at port :${port}`);
});
