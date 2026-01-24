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
import Contact from "./models/contactModel.js";
import ProRequest from "./models/proRequestModel.js";
import ProOrder from "./models/proOrderModel.js";
import ReapproRequest from "./models/reapproRequestModel.js";
import MailingCampaign from "./models/mailingCampaignModel.js";
import NewsletterCampaign from "./models/newsletterCampaignModel.js";

// Data
import users from "./data/users.js";
import products from "./data/products.js";
import orders from "./data/orders.js";
import universes from "./data/universes.js";
import subUniverses from "./data/subUniverses.js";
import prospects from "./data/prospects.js";
import contacts from "./data/contacts.js";
import proRequests from "./data/proRequests.js";
import proOrders from "./data/proOrders.js";
import reapproRequests from "./data/reapproRequests.js";

// Config
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // ============================================
    // 1. NETTOYER LA BASE DE DONNÉES
    // ============================================
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Universe.deleteMany();
    await SubUniverse.deleteMany();
    await Prospect.deleteMany();
    await Contact.deleteMany();
    await ProRequest.deleteMany();
    await ProOrder.deleteMany();
    await ReapproRequest.deleteMany();
    await MailingCampaign.deleteMany();
    await NewsletterCampaign.deleteMany();

    console.log("🗑️  Base de données nettoyée".yellow);

    // ============================================
    // 2. INSÉRER LES UTILISATEURS
    // ============================================
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log(`✅ ${createdUsers.length} utilisateurs créés`.green);

    // Stats utilisateurs
    const adminCount = createdUsers.filter(u => u.isAdmin).length;
    const proCount = createdUsers.filter(u => u.isPro).length;
    const pendingProCount = createdUsers.filter(u => u.proStatus === "pending").length;
    const suspendedProCount = createdUsers.filter(u => u.proStatus === "suspended").length;
    console.log(`   - ${adminCount} admins`.cyan);
    console.log(`   - ${proCount} utilisateurs Pro actifs`.cyan);
    console.log(`   - ${pendingProCount} demandes Pro en attente`.cyan);
    console.log(`   - ${suspendedProCount} comptes Pro suspendus`.cyan);

    // ============================================
    // 3. INSÉRER LES UNIVERS
    // ============================================
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

    // ============================================
    // 4. INSÉRER LES SOUS-UNIVERS
    // ============================================
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
      } else {
        console.log(`   ⚠️  Univers "${subUniverseData.universeName}" non trouvé pour le sous-univers "${subUniverseData.name}"`.yellow);
      }
    }
    console.log(`✅ ${createdSubUniverses.length} sous-univers créés`.green);

    // Créer un map nom → ObjectId pour les sous-univers
    const subUniverseMap = {};
    createdSubUniverses.forEach((su) => {
      subUniverseMap[su.name] = su._id;
    });

    // ============================================
    // 5. INSÉRER LES PRODUITS
    // ============================================
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

    // Stats produits
    const destockageCount = createdProducts.filter(p => p.isDestockage).length;
    const comingSoonCount = createdProducts.filter(p => p.isComingSoon).length;
    const newProductsCount = createdProducts.filter(p => p.isNewProduct).length;
    const featuredCount = createdProducts.filter(p => p.isFeatured).length;
    const onSaleCount = createdProducts.filter(p => p.isOnSale).length;
    console.log(`   - ${destockageCount} en déstockage`.cyan);
    console.log(`   - ${comingSoonCount} bientôt disponibles`.cyan);
    console.log(`   - ${newProductsCount} nouveautés`.cyan);
    console.log(`   - ${featuredCount} mis en avant`.cyan);
    console.log(`   - ${onSaleCount} en promotion`.cyan);

    // Créer un map pour retrouver les produits par index
    const productMap = {};
    createdProducts.forEach((p, index) => {
      productMap[index] = p._id;
    });

    // ============================================
    // 6. INSÉRER LES COMMANDES STANDARDS
    // ============================================
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

    // Stats commandes
    const paidOrders = createdOrders.filter(o => o.isPaid).length;
    const deliveredOrders = createdOrders.filter(o => o.isDelivered).length;
    console.log(`   - ${paidOrders} payées`.cyan);
    console.log(`   - ${deliveredOrders} livrées`.cyan);

    // ============================================
    // 7. INSÉRER LES PROSPECTS
    // ============================================
    const createdProspects = await Prospect.insertMany(prospects);
    console.log(`✅ ${createdProspects.length} prospects créés`.green);

    // Stats prospects
    const activeProspects = createdProspects.filter(p => p.status === "active").length;
    const convertedProspects = createdProspects.filter(p => p.status === "converted").length;
    console.log(`   - ${activeProspects} actifs`.cyan);
    console.log(`   - ${convertedProspects} convertis`.cyan);

    // ============================================
    // 8. INSÉRER LES CONTACTS
    // ============================================
    const sampleContacts = contacts.map((contact) => {
      const result = { ...contact };
      // Si response.respondedBy est un index, le remplacer par l'ObjectId
      if (contact.response && contact.response.respondedByIndex !== undefined) {
        result.response = {
          ...contact.response,
          respondedBy: createdUsers[contact.response.respondedByIndex]._id,
        };
        delete result.response.respondedByIndex;
      }
      return result;
    });

    const createdContacts = await Contact.insertMany(sampleContacts);
    console.log(`✅ ${createdContacts.length} contacts créés`.green);

    // Stats contacts
    const unreadContacts = createdContacts.filter(c => !c.isRead).length;
    const pendingContacts = createdContacts.filter(c => c.status === "nouveau" || c.status === "lu").length;
    console.log(`   - ${unreadContacts} non lus`.cyan);
    console.log(`   - ${pendingContacts} en attente de traitement`.cyan);

    // ============================================
    // 9. INSÉRER LES DEMANDES PRO
    // ============================================
    const sampleProRequests = proRequests.map((request) => {
      const result = { ...request };
      // Remplacer userIndex par l'ObjectId
      if (request.userIndex !== null && request.userIndex !== undefined) {
        result.user = createdUsers[request.userIndex]._id;
      }
      delete result.userIndex;
      // Remplacer processedByIndex par l'ObjectId
      if (request.processedByIndex !== null && request.processedByIndex !== undefined) {
        result.processedBy = createdUsers[request.processedByIndex]._id;
      }
      delete result.processedByIndex;
      return result;
    });

    const createdProRequests = await ProRequest.insertMany(sampleProRequests);
    console.log(`✅ ${createdProRequests.length} demandes Pro créées`.green);

    // Stats demandes Pro
    const pendingRequests = createdProRequests.filter(r => r.status === "pending").length;
    const approvedRequests = createdProRequests.filter(r => r.status === "approved").length;
    const rejectedRequests = createdProRequests.filter(r => r.status === "rejected").length;
    console.log(`   - ${pendingRequests} en attente`.cyan);
    console.log(`   - ${approvedRequests} approuvées`.cyan);
    console.log(`   - ${rejectedRequests} rejetées`.cyan);

    // ============================================
    // 10. INSÉRER LES COMMANDES PRO
    // ============================================
    const sampleProOrders = proOrders.map((order) => {
      const result = { ...order };
      // Remplacer userIndex par l'ObjectId
      result.user = createdUsers[order.userIndex]._id;
      delete result.userIndex;
      // Remplacer processedByIndex par l'ObjectId
      if (order.processedByIndex !== null && order.processedByIndex !== undefined) {
        result.processedBy = createdUsers[order.processedByIndex]._id;
      }
      delete result.processedByIndex;
      // Remplacer productIndex dans les items
      result.items = order.items.map((item) => {
        const { productIndex, ...rest } = item;
        return {
          ...rest,
          product: createdProducts[productIndex]._id,
        };
      });
      return result;
    });

    // Insérer un par un pour déclencher le pre-save (génération orderNumber)
    const createdProOrders = [];
    for (const proOrderData of sampleProOrders) {
      const proOrder = await ProOrder.create(proOrderData);
      createdProOrders.push(proOrder);
    }
    console.log(`✅ ${createdProOrders.length} commandes Pro créées`.green);

    // Stats commandes Pro
    const completedProOrders = createdProOrders.filter(o => o.status === "completed").length;
    const pendingProOrders = createdProOrders.filter(o => o.status === "pending" || o.status === "confirmed").length;
    console.log(`   - ${completedProOrders} terminées`.cyan);
    console.log(`   - ${pendingProOrders} en cours`.cyan);

    // ============================================
    // 11. INSÉRER LES DEMANDES DE RÉAPPRO
    // ============================================
    const sampleReapproRequests = reapproRequests.map((request) => {
      const result = { ...request };
      // Remplacer userIndex par l'ObjectId
      result.user = createdUsers[request.userIndex]._id;
      delete result.userIndex;
      // Remplacer processedByIndex par l'ObjectId
      if (request.processedByIndex !== null && request.processedByIndex !== undefined) {
        result.processedBy = createdUsers[request.processedByIndex]._id;
      }
      delete result.processedByIndex;
      // Remplacer productIndex dans les items
      result.items = request.items.map((item) => {
        const { productIndex, ...rest } = item;
        return {
          ...rest,
          product: createdProducts[productIndex]._id,
        };
      });
      return result;
    });

    // Insérer un par un pour déclencher le pre-save (génération requestNumber)
    const createdReapproRequests = [];
    for (const reapproData of sampleReapproRequests) {
      const reapproRequest = await ReapproRequest.create(reapproData);
      createdReapproRequests.push(reapproRequest);
    }
    console.log(`✅ ${createdReapproRequests.length} demandes de réappro créées`.green);

    // Stats réappro
    const pendingReappro = createdReapproRequests.filter(r => r.status === "pending").length;
    const urgentReappro = createdReapproRequests.filter(r => r.priority === "urgent").length;
    console.log(`   - ${pendingReappro} en attente`.cyan);
    console.log(`   - ${urgentReappro} urgentes`.cyan);

    // ============================================
    // RÉSUMÉ FINAL
    // ============================================
    console.log("\n" + "=".repeat(50).green);
    console.log("🎉 DONNÉES IMPORTÉES AVEC SUCCÈS !".green.bold);
    console.log("=".repeat(50).green);
    console.log(`
📊 Résumé:
   - ${createdUsers.length} utilisateurs
   - ${createdUniverses.length} univers
   - ${createdSubUniverses.length} sous-univers
   - ${createdProducts.length} produits
   - ${createdOrders.length} commandes standards
   - ${createdProspects.length} prospects
   - ${createdContacts.length} contacts
   - ${createdProRequests.length} demandes Pro
   - ${createdProOrders.length} commandes Pro
   - ${createdReapproRequests.length} demandes de réappro
    `.cyan);

    process.exit();
  } catch (error) {
    console.error(`\n❌ Erreur: ${error.message}`.red.bold);
    console.error(error.stack);
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
    await Contact.deleteMany();
    await ProRequest.deleteMany();
    await ProOrder.deleteMany();
    await ReapproRequest.deleteMany();
    await MailingCampaign.deleteMany();
    await NewsletterCampaign.deleteMany();

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
