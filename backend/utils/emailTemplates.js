// ==========================================
// TEMPLATES EMAIL - KRYSTO
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const COMPANY_NAME = "Krysto";
const COMPANY_EMAIL = "contact@krysto.nc";

// ==========================================
// HELPER - Base template wrapper
// ==========================================
const baseTemplate = (content, headerColor = "#2d6a4f", headerGradient = "#40916c") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    ${content}
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; margin-top: 20px;">
      <p style="font-size: 12px; color: #999; margin: 0;">
        ${COMPANY_NAME} - Produits éco-responsables en Nouvelle-Calédonie 🌿
      </p>
      <p style="font-size: 12px; color: #999; margin: 5px 0 0;">
        <a href="${FRONTEND_URL}" style="color: #2d6a4f; text-decoration: none;">www.krysto.nc</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// ==========================================
// 1. EMAIL BIENVENUE - Nouvel utilisateur inscrit
// ==========================================
export const welcomeEmailTemplate = (name) => {
  const content = `
    <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">🌿</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bienvenue sur Krysto !</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous sommes ravis de vous accueillir dans la communauté Krysto ! Votre compte a été créé avec succès.
      </p>
      
      <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 25px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #2d6a4f; font-size: 16px;">🎁 Ce qui vous attend :</h3>
        <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 1.8;">
          <li>Des produits éco-responsables uniques</li>
          <li>Fabriqués à partir de plastique recyclé</li>
          <li>Made in Nouvelle-Calédonie</li>
          <li>Livraison dans tout le territoire</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/products" 
           style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Découvrir nos produits →
        </a>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-top: 25px;">
        <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
          💡 <strong>Astuce :</strong> Complétez votre profil pour une expérience personnalisée !
        </p>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        À très bientôt !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ==========================================
// 2. EMAIL BIENVENUE NEWSLETTER - Nouveau prospect
// ==========================================
export const newsletterWelcomeTemplate = (email) => {
  const content = `
    <div style="background: linear-gradient(135deg, #088395, #05bfdb); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">📬</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bienvenue dans notre newsletter !</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour !
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Merci de vous être inscrit à la newsletter Krysto ! Vous recevrez désormais :
      </p>
      
      <div style="background: linear-gradient(135deg, #e0f7fa, #b2ebf2); padding: 25px; border-radius: 12px; margin: 25px 0;">
        <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 2;">
          <li>🌿 Nos dernières créations éco-responsables</li>
          <li>🎁 Des offres exclusives et promotions</li>
          <li>♻️ Des conseils pour un mode de vie durable</li>
          <li>📖 Les coulisses de notre atelier en Nouvelle-Calédonie</li>
        </ul>
      </div>

      <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; font-size: 15px; color: #2d6a4f;">
          🌊 <strong>Saviez-vous ?</strong><br>
          Chaque produit Krysto permet de recycler en moyenne 50 bouchons plastiques collectés sur nos plages.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/products" 
           style="background: linear-gradient(90deg, #088395, #05bfdb); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Découvrir nos produits →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        À très bientôt !<br>
        L'équipe Krysto 🌱
      </p>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
        <a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" 
           style="font-size: 12px; color: #999; text-decoration: underline;">
          Se désinscrire de la newsletter
        </a>
      </div>
    </div>
  `;
  return baseTemplate(content, "#088395", "#05bfdb");
};

// ==========================================
// 3. EMAIL CONFIRMATION DE COMMANDE
// ==========================================
export const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">
          <div style="display: flex; align-items: center;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div>
              <p style="margin: 0; font-weight: 600; color: #333;">${item.name}</p>
              <p style="margin: 5px 0 0; font-size: 13px; color: #666;">Qté: ${item.qty}</p>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: right; color: #333; font-weight: 600;">
          ${(item.price * item.qty).toLocaleString()} XPF
        </td>
      </tr>
    `
    )
    .join("");

  const content = `
    <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande confirmée !</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        N° ${order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${order.user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Merci pour votre commande ! Nous l'avons bien reçue et elle est en cours de préparation.
      </p>

      <!-- Adresse de livraison -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px; color: #2d6a4f; font-size: 14px;">📍 Adresse de livraison</h3>
        <p style="margin: 0; color: #495057; line-height: 1.5; font-size: 14px;">
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>

      <!-- Articles -->
      <h3 style="color: #333; font-size: 16px; margin: 30px 0 15px;">🛒 Récapitulatif de votre commande</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totaux -->
      <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666; font-size: 14px;">
          <span>Sous-total</span>
          <span>${order.itemsPrice.toLocaleString()} XPF</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666; font-size: 14px;">
          <span>Livraison</span>
          <span>${order.shippingPrice === 0 ? 'Gratuite 🎉' : order.shippingPrice.toLocaleString() + ' XPF'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666; font-size: 14px;">
          <span>Taxe</span>
          <span>${order.taxPrice.toLocaleString()} XPF</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 15px 0 5px; margin-top: 10px; border-top: 2px solid #2d6a4f; font-size: 18px; font-weight: 700; color: #2d6a4f;">
          <span>Total</span>
          <span>${order.totalPrice.toLocaleString()} XPF</span>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/order/${order._id}" 
           style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Suivre ma commande →
        </a>
      </div>

      <div style="background: #fff8e1; padding: 20px; border-radius: 12px; margin-top: 25px; border-left: 4px solid #ffc107;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
          📦 <strong>Prochaine étape :</strong> Nous préparons votre commande avec soin. Vous recevrez un email dès qu'elle sera expédiée.
        </p>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Merci de votre confiance !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ==========================================
// 4. EMAIL COMMANDE EN PRÉPARATION
// ==========================================
export const orderProcessingTemplate = (order) => {
  const content = `
    <div style="background: linear-gradient(135deg, #f57c00, #ffb74d); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande en préparation</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        N° ${order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${order.user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonne nouvelle ! Votre commande est actuellement en cours de préparation dans notre atelier.
      </p>

      <!-- Timeline -->
      <div style="margin: 30px 0; padding: 25px; background: #fafafa; border-radius: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Commande reçue</p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #666;">${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #f57c00; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">⏳</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #f57c00;">En préparation</p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #666;">En cours</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px; opacity: 0.4;">
          <div style="width: 30px; height: 30px; background: #e0e0e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">○</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #999;">Expédiée</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; opacity: 0.4;">
          <div style="width: 30px; height: 30px; background: #e0e0e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">○</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #999;">Livrée</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/order/${order._id}" 
           style="background: linear-gradient(90deg, #f57c00, #ffb74d); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Suivre ma commande →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Merci de votre patience !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#f57c00", "#ffb74d");
};

// ==========================================
// 5. EMAIL COMMANDE EXPÉDIÉE
// ==========================================
export const orderShippedTemplate = (order, trackingNumber = null) => {
  const content = `
    <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">🚚</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande expédiée !</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        N° ${order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${order.user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Excellente nouvelle ! Votre commande a été expédiée et est en route vers vous !
      </p>

      ${trackingNumber ? `
      <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Numéro de suivi</p>
        <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1976d2; font-family: monospace;">
          ${trackingNumber}
        </p>
      </div>
      ` : ''}

      <!-- Adresse de livraison -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px; color: #1976d2; font-size: 14px;">📍 Livraison prévue à</h3>
        <p style="margin: 0; color: #495057; line-height: 1.5; font-size: 14px;">
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>

      <!-- Timeline -->
      <div style="margin: 30px 0; padding: 25px; background: #fafafa; border-radius: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Commande reçue</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Préparée</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #1976d2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🚚</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #1976d2;">Expédiée</p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #666;">Aujourd'hui</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; opacity: 0.4;">
          <div style="width: 30px; height: 30px; background: #e0e0e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">○</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #999;">Livrée</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/order/${order._id}" 
           style="background: linear-gradient(90deg, #1976d2, #42a5f5); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Suivre ma livraison →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Votre colis arrive bientôt !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#1976d2", "#42a5f5");
};

// ==========================================
// 6. EMAIL COMMANDE LIVRÉE
// ==========================================
export const orderDeliveredTemplate = (order) => {
  const content = `
    <div style="background: linear-gradient(135deg, #4caf50, #81c784); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande livrée !</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        N° ${order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${order.user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Votre commande a été livrée avec succès ! Nous espérons que vous adorerez vos produits éco-responsables.
      </p>

      <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 16px; color: #2d6a4f;">
          <strong>Merci pour votre engagement écologique ! 🌿</strong>
        </p>
        <p style="margin: 0; font-size: 14px; color: #4caf50;">
          Grâce à votre achat, vous avez contribué au recyclage du plastique en Nouvelle-Calédonie.
        </p>
      </div>

      <!-- Timeline complète -->
      <div style="margin: 30px 0; padding: 25px; background: #fafafa; border-radius: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Commande reçue</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Préparée</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #333;">Expédiée</p>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">✓</div>
          <div style="margin-left: 15px;">
            <p style="margin: 0; font-weight: 600; color: #4caf50;">Livrée</p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #666;">${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      <div style="background: #fff8e1; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
          ⭐ <strong>Votre avis compte !</strong><br>
          N'hésitez pas à nous faire part de votre expérience. Vos retours nous aident à nous améliorer.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/order/${order._id}" 
           style="background: linear-gradient(90deg, #4caf50, #81c784); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; margin-right: 10px;">
          Voir ma commande
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Merci pour votre confiance !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#4caf50", "#81c784");
};

// ==========================================
// 7. EMAIL COMMANDE ANNULÉE
// ==========================================
export const orderCancelledTemplate = (order, reason = null) => {
  const content = `
    <div style="background: linear-gradient(135deg, #78909c, #b0bec5); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande annulée</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        N° ${order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${order.user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous vous confirmons que votre commande a bien été annulée.
      </p>

      ${reason ? `
      <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #78909c;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; font-weight: 600;">Motif :</p>
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6;">
          ${reason}
        </p>
      </div>
      ` : ''}

      <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #1976d2;">
          💳 <strong>Remboursement :</strong> Si un paiement a été effectué, le remboursement sera traité sous 5-7 jours ouvrés.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/products" 
           style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Continuer mes achats →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Une question ? Contactez-nous à <a href="mailto:${COMPANY_EMAIL}" style="color: #2d6a4f;">${COMPANY_EMAIL}</a><br><br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#78909c", "#b0bec5");
};

// ==========================================
// 8. EMAIL CONFIRMATION CONTACT
// ==========================================
export const contactConfirmationTemplate = (contact) => {
  const content = `
    <div style="background: linear-gradient(135deg, #9c27b0, #ba68c8); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">✉️</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Message bien reçu !</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${contact.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous avons bien reçu votre message et nous vous en remercions !
      </p>

      <div style="background: #f3e5f5; padding: 20px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin: 0 0 10px 0; color: #7b1fa2; font-size: 14px;">📝 Votre message :</h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;"><strong>Sujet :</strong> ${contact.subject}</p>
        <p style="margin: 0; font-size: 14px; color: #333; font-style: italic; line-height: 1.6;">
          "${contact.message}"
        </p>
      </div>

      <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #2d6a4f;">
          ⏰ <strong>Délai de réponse :</strong> Notre équipe vous répondra sous 24-48h ouvrées.
        </p>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        À très bientôt !<br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#9c27b0", "#ba68c8");
};

// ==========================================
// 9. EMAIL RÉPONSE CONTACT (Admin répond)
// ==========================================
export const contactResponseTemplate = (contact, responseContent) => {
  const content = `
    <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">💬</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Réponse à votre message</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${contact.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous vous répondons concernant votre message.
      </p>

      <!-- Message original -->
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #ccc;">
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #999;">Votre message :</p>
        <p style="margin: 0; font-size: 14px; color: #666; font-style: italic;">
          "${contact.message}"
        </p>
      </div>

      <!-- Notre réponse -->
      <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 25px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #2d6a4f; font-size: 14px;">Notre réponse :</h3>
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.7;">
          ${responseContent}
        </p>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        N'hésitez pas à nous recontacter si vous avez d'autres questions.<br><br>
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ==========================================
// 10. EMAIL MOT DE PASSE OUBLIÉ
// ==========================================
export const resetPasswordTemplate = (name, resetUrl) => {
  const content = `
    <div style="background: linear-gradient(135deg, #ff5722, #ff8a65); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Réinitialisation du mot de passe</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background: linear-gradient(90deg, #ff5722, #ff8a65); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Réinitialiser mon mot de passe →
        </a>
      </div>

      <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ff9800;">
        <p style="margin: 0; font-size: 14px; color: #e65100;">
          ⏰ <strong>Attention :</strong> Ce lien expire dans 1 heure.
        </p>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
      </p>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        L'équipe Krysto 🌱
      </p>
    </div>
  `;
  return baseTemplate(content, "#ff5722", "#ff8a65");
};

// ==========================================
// 11. EMAIL COMMANDE PRO - CONFIRMATION
// ==========================================
export const proOrderConfirmationTemplate = (order, user) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333; text-align: right;">${item.proPrice.toLocaleString()} XPF</td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333; text-align: right; font-weight: 600;">${item.lineTotal.toLocaleString()} XPF</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">🏢</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande Pro confirmée</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        Réf. ${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${user.proInfo?.contactFirstName || user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous avons bien reçu votre commande professionnelle pour <strong>${user.proInfo?.companyName || 'votre entreprise'}</strong>.
      </p>

      <!-- Remise appliquée -->
      <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 5px; font-size: 14px; color: #666;">Remise professionnelle appliquée</p>
        <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1976d2;">-${order.discountRate}%</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Soit ${order.discountAmount?.toLocaleString() || 0} XPF d'économie</p>
      </div>

      <!-- Articles -->
      <h3 style="color: #333; font-size: 16px; margin: 30px 0 15px;">📦 Détail de la commande</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; color: #6c757d; font-size: 12px;">PRODUIT</th>
            <th style="padding: 12px; text-align: center; color: #6c757d; font-size: 12px;">QTÉ</th>
            <th style="padding: 12px; text-align: right; color: #6c757d; font-size: 12px;">P.U. PRO</th>
            <th style="padding: 12px; text-align: right; color: #6c757d; font-size: 12px;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totaux -->
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e9ecef;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666;">
          <span>Sous-total</span>
          <span>${order.subtotal?.toLocaleString()} XPF</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666;">
          <span>Livraison</span>
          <span>${order.shippingCost === 0 ? 'Gratuite' : order.shippingCost?.toLocaleString() + ' XPF'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 10px; border-top: 2px solid #1976d2; font-size: 20px; font-weight: 700; color: #1976d2;">
          <span>Total HT</span>
          <span>${order.totalAmount?.toLocaleString()} XPF</span>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          💳 <strong>Paiement :</strong> ${order.paymentMethod === 'invoice' ? 'Sur facture (30 jours)' : order.paymentMethod}<br>
          🚚 <strong>Livraison :</strong> ${order.shippingMethod === 'pickup' ? 'Retrait sur place' : order.shippingMethod === 'delivery' ? 'Livraison standard' : 'Express'}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/pro/orders/${order._id}" 
           style="background: linear-gradient(90deg, #1976d2, #42a5f5); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Suivre ma commande →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Merci pour votre confiance !<br>
        L'équipe Krysto Pro 🏢
      </p>
    </div>
  `;
  return baseTemplate(content, "#1976d2", "#42a5f5");
};

// ==========================================
// 12. EMAIL COMMANDE PRO - STATUT MIS À JOUR
// ==========================================
export const proOrderStatusUpdateTemplate = (order, user, status, note = null) => {
  const statusLabels = {
    confirmed: { label: "Confirmée", emoji: "✅", color: "#4caf50" },
    processing: { label: "En préparation", emoji: "📦", color: "#f57c00" },
    ready: { label: "Prête", emoji: "🎯", color: "#9c27b0" },
    shipped: { label: "Expédiée", emoji: "🚚", color: "#1976d2" },
    delivered: { label: "Livrée", emoji: "🎉", color: "#4caf50" },
    completed: { label: "Terminée", emoji: "✨", color: "#2d6a4f" },
    cancelled: { label: "Annulée", emoji: "❌", color: "#f44336" },
  };

  const statusInfo = statusLabels[status] || { label: status, emoji: "📋", color: "#666" };

  const content = `
    <div style="background: linear-gradient(135deg, ${statusInfo.color}, ${statusInfo.color}99); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">${statusInfo.emoji}</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande ${statusInfo.label}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
        Réf. ${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${user.proInfo?.contactFirstName || user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Le statut de votre commande professionnelle a été mis à jour.
      </p>

      <div style="background: ${statusInfo.color}15; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid ${statusInfo.color};">
        <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Nouveau statut</p>
        <p style="margin: 0; font-size: 24px; font-weight: 700; color: ${statusInfo.color};">
          ${statusInfo.emoji} ${statusInfo.label}
        </p>
      </div>

      ${note ? `
      <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid ${statusInfo.color};">
        <p style="margin: 0 0 5px; font-size: 12px; color: #999;">Note :</p>
        <p style="margin: 0; font-size: 14px; color: #333;">${note}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/pro/orders/${order._id}" 
           style="background: linear-gradient(90deg, ${statusInfo.color}, ${statusInfo.color}cc); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Voir ma commande →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        L'équipe Krysto Pro 🏢
      </p>
    </div>
  `;
  return baseTemplate(content, statusInfo.color, `${statusInfo.color}99`);
};

// ==========================================
// 13. EMAIL RAPPEL PAIEMENT PRO
// ==========================================
export const proPaymentReminderTemplate = (order, user, daysOverdue = 0) => {
  const content = `
    <div style="background: linear-gradient(135deg, #ff9800, #ffb74d); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">💳</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Rappel de paiement</h1>
    </div>
    <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Bonjour <strong>${user.proInfo?.contactFirstName || user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Nous vous rappelons qu'un paiement est en attente pour votre commande professionnelle.
      </p>

      <div style="background: #fff3e0; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Montant restant à payer</p>
        <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ff9800;">
          ${order.remainingAmount?.toLocaleString()} XPF
        </p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #666;">
          Commande réf. ${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}
        </p>
      </div>

      ${daysOverdue > 0 ? `
      <div style="background: #ffebee; padding: 15px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f44336;">
        <p style="margin: 0; font-size: 14px; color: #c62828;">
          ⚠️ <strong>Attention :</strong> Ce paiement a ${daysOverdue} jour(s) de retard.
        </p>
      </div>
      ` : ''}

      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          📅 <strong>Date d'échéance :</strong> ${new Date(order.paymentDueDate).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/pro/orders/${order._id}" 
           style="background: linear-gradient(90deg, #ff9800, #ffb74d); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
          Voir les détails →
        </a>
      </div>

      <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        Une question ? Contactez-nous à <a href="mailto:pro@krysto.nc" style="color: #ff9800;">pro@krysto.nc</a><br><br>
        L'équipe Krysto Pro 🏢
      </p>
    </div>
  `;
  return baseTemplate(content, "#ff9800", "#ffb74d");
};

// ==========================================
// EXPORT DEFAULT
// ==========================================
export default {
  welcomeEmailTemplate,
  newsletterWelcomeTemplate,
  orderConfirmationTemplate,
  orderProcessingTemplate,
  orderShippedTemplate,
  orderDeliveredTemplate,
  orderCancelledTemplate,
  contactConfirmationTemplate,
  contactResponseTemplate,
  resetPasswordTemplate,
  proOrderConfirmationTemplate,
  proOrderStatusUpdateTemplate,
  proPaymentReminderTemplate,
};