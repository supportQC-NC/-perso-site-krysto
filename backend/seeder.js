import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// Models
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

// Data
import users from "./data/users.js";
import products from "./data/products.js";
import orders from "./data/orders.js";

// Config
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // 1. Nettoyer la base de données
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🗑️  Base de données nettoyée".yellow);

    // 2. Insérer les utilisateurs
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log(`✅ ${createdUsers.length} utilisateurs créés`.green);

    // 3. Insérer les produits (avec l'admin comme créateur si besoin)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    console.log(`✅ ${createdProducts.length} produits créés`.green);

    // 4. Insérer les commandes avec les vrais ObjectIds
    const sampleOrders = orders.map((order) => {
      // Remplacer userIndex par le vrai ObjectId
      const userId = createdUsers[order.userIndex]._id;

      // Remplacer productIndex par le vrai ObjectId dans chaque orderItem
      const orderItems = order.orderItems.map((item) => {
        const { productIndex, ...rest } = item;
        return {
          ...rest,
          product: createdProducts[productIndex]._id,
        };
      });

      // Retourner la commande avec les vrais IDs
      const { userIndex, ...orderData } = order;
      return {
        ...orderData,
        user: userId,
        orderItems,
      };
    });

    const createdOrders = await Order.insertMany(sampleOrders);

    console.log(`✅ ${createdOrders.length} commandes créées`.green);

    console.log("🎉 Données importées avec succès !".green.bold);
    process.exit();
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🗑️  Toutes les données ont été supprimées !".red.bold);
    process.exit();
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Commandes CLI
// npm run data:import  → Importer les données
// npm run data:destroy → Supprimer les données

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}