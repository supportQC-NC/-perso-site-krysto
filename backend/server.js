import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();


// Cookie parser middleware
app.use(cookieParser());

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get("/", (req, res) => {
  res.send("API Krysto is running...");
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Error middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});