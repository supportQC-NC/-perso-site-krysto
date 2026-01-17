// Template email de bienvenue
export const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bienvenue sur Krysto ! 🌿</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Bonjour <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Nous sommes ravis de vous accueillir dans la communauté Krysto ! Votre compte a été créé avec succès.
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Vous pouvez dès maintenant :
          </p>
          <ul style="font-size: 16px; color: #333; line-height: 1.8;">
            <li>Découvrir nos produits éco-responsables</li>
            <li>Passer vos commandes en toute simplicité</li>
            <li>Suivre vos livraisons</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
               style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Découvrir nos produits
            </a>
          </div>
          <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            Si vous avez des questions, n'hésitez pas à nous contacter.<br>
            À bientôt !<br><br>
            L'équipe Krysto 🌱
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template email de confirmation de commande
export const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333;">
          ${item.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333; text-align: center;">
          ${item.qty}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333; text-align: right;">
          ${(item.price * item.qty).toLocaleString()} XPF
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Commande confirmée ! ✅</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Commande #${order._id}
          </p>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Bonjour <strong>${order.user.name}</strong>,
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Merci pour votre commande ! Nous l'avons bien reçue et elle est en cours de traitement.
          </p>

          <!-- Adresse de livraison -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">📍 Adresse de livraison</h3>
            <p style="margin: 0; color: #495057; line-height: 1.5;">
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>

          <!-- Articles -->
          <h3 style="color: #333; font-size: 16px; margin: 30px 0 15px;">🛒 Vos articles</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; color: #6c757d; font-size: 12px;"></th>
                <th style="padding: 12px; text-align: left; color: #6c757d; font-size: 12px;">PRODUIT</th>
                <th style="padding: 12px; text-align: center; color: #6c757d; font-size: 12px;">QTÉ</th>
                <th style="padding: 12px; text-align: right; color: #6c757d; font-size: 12px;">PRIX</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totaux -->
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #495057;">
              <span>Sous-total</span>
              <span>${order.itemsPrice.toLocaleString()} XPF</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #495057;">
              <span>Livraison</span>
              <span>${order.shippingPrice === 0 ? 'Gratuit' : order.shippingPrice.toLocaleString() + ' XPF'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #495057;">
              <span>Taxe</span>
              <span>${order.taxPrice.toLocaleString()} XPF</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 10px; border-top: 2px solid #2d6a4f; font-size: 18px; font-weight: 700; color: #1a1a2e;">
              <span>Total</span>
              <span>${order.totalPrice.toLocaleString()} XPF</span>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${order._id}" 
               style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Suivre ma commande
            </a>
          </div>

          <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            Merci de votre confiance !<br><br>
            L'équipe Krysto 🌱
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};