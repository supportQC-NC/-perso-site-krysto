// ==========================================
// TEMPLATES EMAIL CAMPAGNES NEWSLETTER
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Couleurs par type de campagne
const campaignColors = {
  promo: { primary: "#e53935", secondary: "#ff6f60", accent: "#ffcdd2" },
  nouveautes: { primary: "#43a047", secondary: "#76d275", accent: "#c8e6c9" },
  destockage: { primary: "#fb8c00", secondary: "#ffbd45", accent: "#ffe0b2" },
  evenement: { primary: "#8e24aa", secondary: "#c158dc", accent: "#e1bee7" },
  newsletter: { primary: "#2d6a4f", secondary: "#40916c", accent: "#e8f5e9" },
  custom: { primary: "#1976d2", secondary: "#63a4ff", accent: "#bbdefb" },
};

// Icônes par type
const campaignIcons = {
  promo: "🏷️",
  nouveautes: "✨",
  destockage: "🔥",
  evenement: "🎉",
  newsletter: "📬",
  custom: "💌",
};

// Header commun
const getHeader = (type, title) => {
  const colors = campaignColors[type] || campaignColors.newsletter;
  const icon = campaignIcons[type] || "📧";

  return `
    <div style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 15px;">${icon}</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${title}</h1>
    </div>
  `;
};

// Footer commun
const getFooter = (email) => {
  return `
    <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #e9ecef;">
      <p style="font-size: 13px; color: #6c757d; margin-bottom: 15px;">
        Vous recevez cet email car vous êtes inscrit à notre newsletter.
      </p>
      <div style="margin-bottom: 15px;">
        <a href="${FRONTEND_URL}" style="color: #2d6a4f; text-decoration: none; margin: 0 10px;">Site web</a>
        <span style="color: #ccc;">|</span>
        <a href="${FRONTEND_URL}/products" style="color: #2d6a4f; text-decoration: none; margin: 0 10px;">Boutique</a>
        <span style="color: #ccc;">|</span>
        <a href="${FRONTEND_URL}/contact" style="color: #2d6a4f; text-decoration: none; margin: 0 10px;">Contact</a>
      </div>
      <a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" 
         style="font-size: 12px; color: #999; text-decoration: underline;">
        Se désinscrire de la newsletter
      </a>
      <p style="font-size: 11px; color: #aaa; margin-top: 15px;">
        © ${new Date().getFullYear()} Krysto - Nouvelle-Calédonie 🇳🇨
      </p>
    </div>
  `;
};

// ==========================================
// TEMPLATE PROMO
// ==========================================
export const promoTemplate = (campaign, email) => {
  const { content } = campaign;
  const colors = campaignColors.promo;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${getHeader("promo", content.title)}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.subtitle ? `<p style="font-size: 18px; color: #333; text-align: center; margin-bottom: 25px;">${content.subtitle}</p>` : ""}
          
          ${
            content.promoCode
              ? `
            <div style="background: linear-gradient(135deg, ${colors.accent}, #fff); border: 2px dashed ${colors.primary}; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase;">Code promo</p>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: ${colors.primary}; letter-spacing: 3px;">${content.promoCode}</p>
              ${content.promoDiscount ? `<p style="margin: 10px 0 0; font-size: 16px; color: #333;">${content.promoDiscount}</p>` : ""}
            </div>
          `
              : ""
          }
          
          ${content.image ? `<img src="${content.image}" alt="Promotion" style="width: 100%; border-radius: 12px; margin: 20px 0;">` : ""}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${content.ctaUrl || FRONTEND_URL + '/products'}" 
               style="background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);">
              ${content.ctaText || "Profiter de l'offre"} →
            </a>
          </div>
          
          <p style="font-size: 13px; color: #999; text-align: center; margin-top: 20px;">
            ⏰ Offre limitée - Ne tardez pas !
          </p>
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE NOUVEAUTÉS
// ==========================================
export const nouveautesTemplate = (campaign, email) => {
  const { content } = campaign;
  const colors = campaignColors.nouveautes;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${getHeader("nouveautes", content.title)}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.subtitle ? `<p style="font-size: 18px; color: #555; text-align: center; margin-bottom: 25px;">${content.subtitle}</p>` : ""}
          
          ${
            content.image
              ? `
            <div style="position: relative; margin: 25px 0;">
              <img src="${content.image}" alt="Nouveauté" style="width: 100%; border-radius: 12px;">
              <span style="position: absolute; top: 15px; left: 15px; background: ${colors.primary}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">NOUVEAU</span>
            </div>
          `
              : ""
          }
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: ${colors.accent}; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: ${colors.primary};">
              🌿 Comme tous nos produits, fabriqué à partir de plastique 100% recyclé en Nouvelle-Calédonie
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${content.ctaUrl || FRONTEND_URL + '/products'}" 
               style="background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
              ${content.ctaText || "Découvrir les nouveautés"} →
            </a>
          </div>
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE DÉSTOCKAGE
// ==========================================
export const destockageTemplate = (campaign, email) => {
  const { content } = campaign;
  const colors = campaignColors.destockage;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${getHeader("destockage", content.title)}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <div style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 48px; font-weight: 800; color: white;">
              ${content.promoDiscount || "JUSQU'À -50%"}
            </p>
            <p style="margin: 10px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">
              Sur une sélection de produits
            </p>
          </div>
          
          ${content.subtitle ? `<p style="font-size: 18px; color: #555; text-align: center; margin-bottom: 25px;">${content.subtitle}</p>` : ""}
          
          ${content.image ? `<img src="${content.image}" alt="Déstockage" style="width: 100%; border-radius: 12px; margin: 20px 0;">` : ""}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: #fff3e0; border-left: 4px solid ${colors.primary}; padding: 15px 20px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #e65100;">
              ⚡ <strong>Stock limité</strong> - Ces prix exceptionnels sont valables dans la limite des stocks disponibles !
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${content.ctaUrl || FRONTEND_URL + '/products'}" 
               style="background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(251, 140, 0, 0.4);">
              ${content.ctaText || "Voir le déstockage"} 🔥
            </a>
          </div>
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE ÉVÉNEMENT
// ==========================================
export const evenementTemplate = (campaign, email) => {
  const { content } = campaign;
  const colors = campaignColors.evenement;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${getHeader("evenement", content.title)}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.subtitle ? `<p style="font-size: 20px; color: ${colors.primary}; text-align: center; margin-bottom: 25px; font-weight: 600;">${content.subtitle}</p>` : ""}
          
          ${
            content.image
              ? `
            <div style="position: relative; margin: 25px 0;">
              <img src="${content.image}" alt="Événement" style="width: 100%; border-radius: 12px;">
            </div>
          `
              : ""
          }
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: linear-gradient(135deg, ${colors.accent}, #f3e5f5); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: ${colors.primary};">
              🎊 Un événement à ne pas manquer !<br>
              <span style="font-size: 13px; color: #666;">Rejoignez-nous et partagez ce moment avec nous.</span>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${content.ctaUrl || FRONTEND_URL}" 
               style="background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
              ${content.ctaText || "En savoir plus"} →
            </a>
          </div>
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE NEWSLETTER CLASSIQUE
// ==========================================
export const newsletterClassicTemplate = (campaign, email) => {
  const { content } = campaign;
  const colors = campaignColors.newsletter;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${getHeader("newsletter", content.title)}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.subtitle ? `<p style="font-size: 18px; color: #555; text-align: center; margin-bottom: 25px;">${content.subtitle}</p>` : ""}
          
          ${content.image ? `<img src="${content.image}" alt="Newsletter" style="width: 100%; border-radius: 12px; margin: 20px 0;">` : ""}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          ${
            content.ctaUrl
              ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${content.ctaUrl}" 
                 style="background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
                ${content.ctaText || "En savoir plus"} →
              </a>
            </div>
          `
              : ""
          }
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE CUSTOM (HTML libre)
// ==========================================
export const customTemplate = (campaign, email) => {
  const { content } = campaign;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.body}
          
          ${getFooter(email)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// FONCTION PRINCIPALE - Sélectionne le bon template
// ==========================================
export const getCampaignTemplate = (campaign, email) => {
  switch (campaign.type) {
    case "promo":
      return promoTemplate(campaign, email);
    case "nouveautes":
      return nouveautesTemplate(campaign, email);
    case "destockage":
      return destockageTemplate(campaign, email);
    case "evenement":
      return evenementTemplate(campaign, email);
    case "custom":
      return customTemplate(campaign, email);
    case "newsletter":
    default:
      return newsletterClassicTemplate(campaign, email);
  }
};

// Labels pour l'interface
export const campaignTypeLabels = {
  promo: "🏷️ Promotion",
  nouveautes: "✨ Nouveautés",
  destockage: "🔥 Déstockage",
  evenement: "🎉 Événement",
  newsletter: "📬 Newsletter",
  custom: "💌 Personnalisé",
};

export default getCampaignTemplate;
