import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import connectDB from "./config/db.js";

// Import des routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import universeRoutes from "./routes/universRoutes.js";
import subUniverseRoutes from "./routes/subUniverseRoutes.js";
import prospectRoutes from "./routes/prospectRoutes.js";
import mailingRoutes from "./routes/mailingRoutes.js";
import mailingTemplateRoutes from "./routes/maillingTemplateRoutes.js";
import proRequestRoutes from "./routes/proRequestRoutes.js";
import proOrderRoutes from "./routes/proOrderRoutes.js";
import reapproRequestRoutes from "./routes/reapproRequestRoutes.js";
// NOUVEAU: Import des routes Veille
import veilleRoutes from "./routes/veilleRoutes.js";
import veilleCategoryRoutes from "./routes/veilleCategoryRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

const app = express();

// CORS middleware - IMPORTANT: configurer avec credentials pour les cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Cookie parser middleware
app.use(cookieParser());

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route de base
app.get("/", (req, res) => {
  res.send("API Krysto is running...");
});

// ==========================================
// ROUTES API
// ==========================================

// Produits
app.use("/api/products", productRoutes);

// Utilisateurs & Authentification
app.use("/api/users", userRoutes);

// Commandes
app.use("/api/orders", orderRoutes);

// Messages de contact
app.use("/api/contacts", contactRoutes);

// Upload de fichiers
app.use("/api/upload", uploadRoutes);

// Univers (catégories principales)
app.use("/api/universes", universeRoutes);

// Sous-Univers (sous-catégories)
app.use("/api/subuniverses", subUniverseRoutes);

// Prospects (inscriptions newsletter)
app.use("/api/prospects", prospectRoutes);

// Campagnes Mailing
app.use("/api/mailing", mailingRoutes);

// Templates Mailing (éditeur de blocs)
app.use("/api/mailing-templates", mailingTemplateRoutes);

// Demandes de compte Pro
app.use("/api/pro-requests", proRequestRoutes);

// Commandes Pro (Revendeurs & Dépôt-vente)
app.use("/api/pro-orders", proOrderRoutes);

// Demandes de réapprovisionnement
app.use("/api/reappro-requests", reapproRequestRoutes);

// ==========================================
// NOUVEAU: ROUTES VEILLE (Admin)
// ==========================================
// Veilles (liens, images, vidéos YouTube, documents)
app.use("/api/veilles", veilleRoutes);

// Catégories de veille (Tutos, Idées produits, etc.)
app.use("/api/veille-categories", veilleCategoryRoutes);

// ==========================================
// ERROR MIDDLEWARES
// ==========================================

app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});