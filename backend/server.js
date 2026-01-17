import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get("/", (req, res) => {
  res.send("API Krysto is running...");
});

// Routes
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});