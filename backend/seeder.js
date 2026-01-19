import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// Models
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import Universe from "./models/universeModel.js";
import SubUniverse from "./models/subUniverseModel.js";
import Prospect from "./models/prospectModel.js";

// Data
import users from "./data/users.js";
import products from "./data/products.js";
import orders from "./data/orders.js";
import universes from "./data/universe.js";
import subUniverses from "./data/subUniverses.js";
import prospects from "./data/prospects.js";

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
    await Universe.deleteMany();
    await SubUniverse.deleteMany();
    await Prospect.deleteMany();

    console.log("🗑️  Base de données nettoyée".yellow);

    // 2. Insérer les utilisateurs
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log(`✅ ${createdUsers.length} utilisateurs créés`.green);

    // 3. Insérer les univers (un par un pour déclencher le pre-save qui génère le slug)
    const createdUniverses = [];
    for (const universeData of universes) {
      const universe = await Universe.create(universeData);
      createdUniverses.push(universe);
    }
    console.log(`✅ ${createdUniverses.length} univers créés`.green);

    // Créer un map nom → ObjectId pour les univers
    const universeMap = {};
    createdUniverses.forEach((u) => {
      universeMap[u.name] = u._id;
    });

    // 4. Insérer les sous-univers
    const createdSubUniverses = [];
    for (const subUniverseData of subUniverses) {
      const universeId = universeMap[subUniverseData.universeName];
      if (universeId) {
        const subUniverse = await SubUniverse.create({
          name: subUniverseData.name,
          description: subUniverseData.description,
          image: subUniverseData.image,
          universe: universeId,
          isActive: subUniverseData.isActive,
          displayOrder: subUniverseData.displayOrder,
        });
        createdSubUniverses.push(subUniverse);
      }
    }
    console.log(`✅ ${createdSubUniverses.length} sous-univers créés`.green);

    // Créer un map nom → ObjectId pour les sous-univers
    const subUniverseMap = {};
    createdSubUniverses.forEach((su) => {
      subUniverseMap[su.name] = su._id;
    });

    // 5. Insérer les produits
    const sampleProducts = products.map((product) => {
      const universeId = product.universe ? universeMap[product.universe] : null;
      const subUniverseId = product.subUniverse ? subUniverseMap[product.subUniverse] : null;
      return {
        ...product,
        user: adminUser,
        universe: universeId,
        subUniverse: subUniverseId,
      };
    });

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${createdProducts.length} produits créés`.green);

    // Afficher les stats des produits
    const destockageCount = createdProducts.filter(p => p.isDestockage).length;
    const comingSoonCount = createdProducts.filter(p => p.isComingSoon).length;
    const newProductsCount = createdProducts.filter(p => p.isNewProduct).length;
    console.log(`   - ${destockageCount} produits en déstockage`.cyan);
    console.log(`   - ${comingSoonCount} produits "bientôt disponible"`.cyan);
    console.log(`   - ${newProductsCount} nouveaux produits`.cyan);

    // 6. Insérer les commandes
    const sampleOrders = orders.map((order) => {
      const userId = createdUsers[order.userIndex]._id;
      const orderItems = order.orderItems.map((item) => {
        const { productIndex, ...rest } = item;
        return {
          ...rest,
          product: createdProducts[productIndex]._id,
        };
      });
      const { userIndex, ...orderData } = order;
      return {
        ...orderData,
        user: userId,
        orderItems,
      };
    });

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ ${createdOrders.length} commandes créées`.green);

    // 7. Insérer les prospects
    const createdProspects = await Prospect.insertMany(prospects);
    console.log(`✅ ${createdProspects.length} prospects créés`.green);

    console.log("\n🎉 Données importées avec succès !".green.bold);
    process.exit();
  } catch (error) {
    console.error(`\n❌ Erreur: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Universe.deleteMany();
    await SubUniverse.deleteMany();
    await Prospect.deleteMany();

    console.log("🗑️  Toutes les données ont été supprimées !".red.bold);
    process.exit();
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}