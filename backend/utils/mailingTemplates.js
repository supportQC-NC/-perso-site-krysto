// ==========================================
// TEMPLATES EMAIL POUR LES CAMPAGNES MAILING
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const COMPANY_NAME = "Krysto";
const COMPANY_LOCATION = "Nouvelle-Calédonie 🇳🇨";

// ==========================================
// STYLES COMMUNS
// ==========================================
const colors = {
  promo: {
    primary: "#e53935",
    secondary: "#ff6f60",
    gradient: "linear-gradient(135deg, #e53935, #ff6f60)",
    light: "#ffebee",
  },
  nouveautes: {
    primary: "#2d6a4f",
    secondary: "#40916c",
    gradient: "linear-gradient(135deg, #2d6a4f, #40916c)",
    light: "#e8f5e9",
  },
  destockage: {
    primary: "#f57c00",
    secondary: "#ffb74d",
    gradient: "linear-gradient(135deg, #f57c00, #ffb74d)",
    light: "#fff3e0",
  },
  evenement: {
    primary: "#7b1fa2",
    secondary: "#ba68c8",
    gradient: "linear-gradient(135deg, #7b1fa2, #ba68c8)",
    light: "#f3e5f5",
  },
  newsletter: {
    primary: "#1976d2",
    secondary: "#64b5f6",
    gradient: "linear-gradient(135deg, #1976d2, #64b5f6)",
    light: "#e3f2fd",
  },
  custom: {
    primary: "#455a64",
    secondary: "#78909c",
    gradient: "linear-gradient(135deg, #455a64, #78909c)",
    light: "#eceff1",
  },
};

const icons = {
  promo: "🏷️",
  nouveautes: "✨",
  destockage: "🔥",
  evenement: "🎉",
  newsletter: "📬",
  custom: "💌",
};

// ==========================================
// COMPOSANTS RÉUTILISABLES
// ==========================================

const getBaseStyles = () => `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .content {
    background: #ffffff;
    border-radius: 0 0 16px 16px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  p {
    font-size: 16px;
    color: #333;
    line-height: 1.7;
    margin: 0 0 15px 0;
  }
  .cta-button {
    display: inline-block;
    padding: 16px 40px;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
  }
`;

const getHeader = (template, headline) => {
  const color = colors[template] || colors.newsletter;
  const icon = icons[template] || "📧";

  return `
    <div style="background: ${color.gradient}; padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 50px; margin-bottom: 15px;">${icon}</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; line-height: 1.3;">
        ${headline}
      </h1>
    </div>
  `;
};

const getFooter = (email) => {
  return `
    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e9ecef; text-align: center;">
      <p style="font-size: 13px; color: #888; margin-bottom: 15px;">
        Vous recevez cet email car vous êtes inscrit à notre newsletter.
      </p>
      <div style="margin-bottom: 20px;">
        <a href="${FRONTEND_URL}" style="color: #2d6a4f; text-decoration: none; margin: 0 10px; font-size: 14px;">Site web</a>
        <span style="color: #ddd;">|</span>
        <a href="${FRONTEND_URL}/products" style="color: #2d6a4f; text-decoration: none; margin: 0 10px; font-size: 14px;">Boutique</a>
        <span style="color: #ddd;">|</span>
        <a href="${FRONTEND_URL}/contact" style="color: #2d6a4f; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact</a>
      </div>
      <a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" 
         style="font-size: 12px; color: #999; text-decoration: underline;">
        Se désinscrire de la newsletter
      </a>
      <p style="font-size: 11px; color: #aaa; margin-top: 20px;">
        © ${new Date().getFullYear()} ${COMPANY_NAME} - ${COMPANY_LOCATION}<br>
        Produits éco-responsables en plastique recyclé 🌿
      </p>
    </div>
  `;
};

const getCTAButton = (template, text, url) => {
  const color = colors[template] || colors.newsletter;
  return `
    <div style="text-align: center; margin: 35px 0;">
      <a href="${url || FRONTEND_URL + '/products'}" 
         style="background: ${color.gradient}; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        ${text || "Découvrir"} →
      </a>
    </div>
  `;
};

const getImage = (imageUrl, alt = "Image") => {
  if (!imageUrl) return "";
  return `
    <div style="margin: 25px 0; text-align: center;">
      <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    </div>
  `;
};

// ==========================================
// TEMPLATE PROMO
// ==========================================
export const generatePromoTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;
  const color = colors.promo;

  const promoCodeSection = content.promoCode
    ? `
    <div style="background: ${color.light}; border: 2px dashed ${color.primary}; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Votre code promo exclusif</p>
      <p style="margin: 0; font-size: 36px; font-weight: 800; color: ${color.primary}; letter-spacing: 3px; font-family: monospace;">${content.promoCode}</p>
      ${content.promoDiscount ? `<p style="margin: 12px 0 0 0; font-size: 18px; color: #333; font-weight: 600;">${content.promoDiscount}</p>` : ""}
      ${content.promoExpiry ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">Valable jusqu'au ${new Date(content.promoExpiry).toLocaleDateString("fr-FR")}</p>` : ""}
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        ${getHeader("promo", content.headline || "Offre Spéciale ! 🎁")}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${getImage(content.imageUrl, "Promotion")}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          ${promoCodeSection}
          
          ${getCTAButton("promo", content.ctaText || "Profiter de l'offre", content.ctaUrl)}
          
          <div style="background: #fff8e1; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 25px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              ⏰ <strong>Offre limitée</strong> - Ne manquez pas cette occasion !
            </p>
          </div>
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE NOUVEAUTÉS
// ==========================================
export const generateNouveautesTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;
  const color = colors.nouveautes;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        ${getHeader("nouveautes", content.headline || "Découvrez nos nouveautés ! ✨")}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${getImage(content.imageUrl, "Nouveautés")}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: ${color.light}; padding: 20px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: ${color.primary};">
              🌿 Comme tous nos produits, fabriqué à partir de plastique 100% recyclé en Nouvelle-Calédonie
            </p>
          </div>
          
          ${getCTAButton("nouveautes", content.ctaText || "Voir les nouveautés", content.ctaUrl)}
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE DÉSTOCKAGE
// ==========================================
export const generateDestockageTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;
  const color = colors.destockage;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        ${getHeader("destockage", content.headline || "Déstockage Massif ! 🔥")}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <div style="background: ${color.gradient}; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 48px; font-weight: 800; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
              ${content.promoDiscount || "JUSQU'À -50%"}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">
              Sur une sélection d'articles
            </p>
          </div>
          
          ${getImage(content.imageUrl, "Déstockage")}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: ${color.light}; border-left: 4px solid ${color.primary}; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 14px; color: #e65100;">
              ⚡ <strong>Stock très limité</strong> - Premier arrivé, premier servi !
            </p>
          </div>
          
          ${getCTAButton("destockage", content.ctaText || "Voir le déstockage", content.ctaUrl)}
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE ÉVÉNEMENT
// ==========================================
export const generateEvenementTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;
  const color = colors.evenement;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        ${getHeader("evenement", content.headline || "Événement Spécial ! 🎉")}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${getImage(content.imageUrl, "Événement")}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          <div style="background: linear-gradient(135deg, ${color.light}, #fce4ec); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px; color: ${color.primary};">
              🎊 Rejoignez-nous pour cet événement exceptionnel !
            </p>
          </div>
          
          ${getCTAButton("evenement", content.ctaText || "En savoir plus", content.ctaUrl)}
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE NEWSLETTER CLASSIQUE
// ==========================================
export const generateNewsletterTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        ${getHeader("newsletter", content.headline || "Actualités Krysto 📬")}
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${getImage(content.imageUrl, "Newsletter")}
          
          <div style="font-size: 16px; color: #333; line-height: 1.7;">
            ${content.body}
          </div>
          
          ${content.ctaUrl ? getCTAButton("newsletter", content.ctaText || "En savoir plus", content.ctaUrl) : ""}
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// TEMPLATE PERSONNALISÉ (HTML libre)
// ==========================================
export const generateCustomTemplate = (campaign, recipientEmail) => {
  const { content } = campaign;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${campaign.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${content.body}
          
          ${content.ctaUrl ? getCTAButton("custom", content.ctaText || "En savoir plus", content.ctaUrl) : ""}
          
          ${getFooter(recipientEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// FONCTION PRINCIPALE - Génère le template approprié
// ==========================================
export const generateMailingTemplate = (campaign, recipientEmail) => {
  switch (campaign.template) {
    case "promo":
      return generatePromoTemplate(campaign, recipientEmail);
    case "nouveautes":
      return generateNouveautesTemplate(campaign, recipientEmail);
    case "destockage":
      return generateDestockageTemplate(campaign, recipientEmail);
    case "evenement":
      return generateEvenementTemplate(campaign, recipientEmail);
    case "custom":
      return generateCustomTemplate(campaign, recipientEmail);
    case "newsletter":
    default:
      return generateNewsletterTemplate(campaign, recipientEmail);
  }
};

// Labels pour l'interface admin
export const templateLabels = {
  promo: { label: "Promotion", icon: "🏷️", color: "#e53935" },
  nouveautes: { label: "Nouveautés", icon: "✨", color: "#2d6a4f" },
  destockage: { label: "Déstockage", icon: "🔥", color: "#f57c00" },
  evenement: { label: "Événement", icon: "🎉", color: "#7b1fa2" },
  newsletter: { label: "Newsletter", icon: "📬", color: "#1976d2" },
  custom: { label: "Personnalisé", icon: "💌", color: "#455a64" },
};

export const recipientLabels = {
  all: "Tous (utilisateurs + prospects)",
  users: "Utilisateurs uniquement",
  prospects: "Prospects uniquement",
  newsletter_subscribers: "Abonnés newsletter uniquement",
};

export default generateMailingTemplate;