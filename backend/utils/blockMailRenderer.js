// ==========================================
// BLOCK EMAIL RENDERER
// Convertit la structure de blocs JSON en HTML email compatible
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Convertit les styles d'un bloc en CSS inline
const getBlockStyles = (styles = {}) => {
  const {
    backgroundColor = "transparent",
    paddingTop = 20,
    paddingBottom = 20,
    paddingLeft = 20,
    paddingRight = 20,
    marginTop = 0,
    marginBottom = 0,
    borderRadius = 0,
    borderWidth = 0,
    borderColor = "#e0e0e0",
    borderStyle = "solid",
  } = styles;

  let css = `
    background-color: ${backgroundColor};
    padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
    margin-top: ${marginTop}px;
    margin-bottom: ${marginBottom}px;
  `;

  if (borderRadius > 0) {
    css += `border-radius: ${borderRadius}px;`;
  }

  if (borderWidth > 0) {
    css += `border: ${borderWidth}px ${borderStyle} ${borderColor};`;
  }

  return css.replace(/\s+/g, " ").trim();
};

// Alignement en style CSS
const getAlignmentStyle = (alignment) => {
  const alignMap = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify",
  };
  return alignMap[alignment] || "left";
};

// ==========================================
// BLOCK RENDERERS
// ==========================================

// Render Header Block
const renderHeaderBlock = (block) => {
  const {
    logoUrl,
    logoWidth = 150,
    logoAlt = "Logo",
    title,
    subtitle,
    alignment = "center",
    backgroundColor = "#2d6a4f",
    titleColor = "#ffffff",
    subtitleColor = "#e0e0e0",
    titleFontSize = 28,
    subtitleFontSize = 16,
    showIcon = false,
    icon = "📬",
  } = block.data;

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="${logoAlt}" width="${logoWidth}" style="max-width: 100%; height: auto; margin-bottom: 15px;" />`
    : "";

  const iconHtml = showIcon && icon ? `<div style="font-size: 50px; margin-bottom: 15px;">${icon}</div>` : "";

  const titleHtml = title
    ? `<h1 style="color: ${titleColor}; margin: 0; font-size: ${titleFontSize}px; font-weight: 700; line-height: 1.3;">${title}</h1>`
    : "";

  const subtitleHtml = subtitle
    ? `<p style="color: ${subtitleColor}; margin: 10px 0 0 0; font-size: ${subtitleFontSize}px; line-height: 1.4;">${subtitle}</p>`
    : "";

  return `
    <div style="background-color: ${backgroundColor}; text-align: ${alignment}; ${getBlockStyles(block.styles)}">
      ${logoHtml}
      ${iconHtml}
      ${titleHtml}
      ${subtitleHtml}
    </div>
  `;
};

// Render Text Block
const renderTextBlock = (block) => {
  const {
    content = "",
    alignment = "left",
    textColor = "#333333",
    fontSize = 16,
    lineHeight = 1.6,
    fontWeight = "normal",
  } = block.data;

  return `
    <div style="text-align: ${getAlignmentStyle(alignment)}; color: ${textColor}; font-size: ${fontSize}px; line-height: ${lineHeight}; font-weight: ${fontWeight}; ${getBlockStyles(block.styles)}">
      ${content}
    </div>
  `;
};

// Render Image Block
const renderImageBlock = (block) => {
  const {
    src,
    alt = "Image",
    width = "100%",
    maxWidth = 600,
    alignment = "center",
    linkUrl,
    borderRadius = 8,
    caption,
    captionColor = "#666666",
  } = block.data;

  if (!src) {
    return `<div style="${getBlockStyles(block.styles)}"></div>`;
  }

  const imgStyle = `max-width: ${typeof maxWidth === "number" ? maxWidth + "px" : maxWidth}; width: ${width}; height: auto; border-radius: ${borderRadius}px; display: block;`;

  const alignStyle = {
    left: "margin-right: auto;",
    center: "margin: 0 auto;",
    right: "margin-left: auto;",
  };

  let imgHtml = `<img src="${src}" alt="${alt}" style="${imgStyle} ${alignStyle[alignment] || alignStyle.center}" />`;

  if (linkUrl) {
    imgHtml = `<a href="${linkUrl}" target="_blank" style="display: block;">${imgHtml}</a>`;
  }

  const captionHtml = caption
    ? `<p style="text-align: ${alignment}; color: ${captionColor}; font-size: 14px; margin-top: 10px; margin-bottom: 0;">${caption}</p>`
    : "";

  return `
    <div style="text-align: ${alignment}; ${getBlockStyles(block.styles)}">
      ${imgHtml}
      ${captionHtml}
    </div>
  `;
};

// Render Button Block
const renderButtonBlock = (block) => {
  const {
    text = "Cliquez ici",
    url = "#",
    alignment = "center",
    backgroundColor = "#2d6a4f",
    textColor = "#ffffff",
    fontSize = 16,
    fontWeight = "bold",
    paddingVertical = 14,
    paddingHorizontal = 32,
    borderRadius = 25,
    fullWidth = false,
    icon = "",
    iconPosition = "right",
  } = block.data;

  const buttonWidth = fullWidth ? "width: 100%; box-sizing: border-box;" : "";

  const iconHtml = icon ? (iconPosition === "left" ? `${icon} ` : ` ${icon}`) : "";
  const buttonText = iconPosition === "left" ? `${iconHtml}${text}` : `${text}${iconHtml}`;

  const buttonStyle = `
    display: inline-block;
    background-color: ${backgroundColor};
    color: ${textColor};
    font-size: ${fontSize}px;
    font-weight: ${fontWeight};
    padding: ${paddingVertical}px ${paddingHorizontal}px;
    border-radius: ${borderRadius}px;
    text-decoration: none;
    text-align: center;
    ${buttonWidth}
  `.replace(/\s+/g, " ");

  return `
    <div style="text-align: ${alignment}; ${getBlockStyles(block.styles)}">
      <a href="${url}" target="_blank" style="${buttonStyle}">${buttonText}</a>
    </div>
  `;
};

// Render Divider Block
const renderDividerBlock = (block) => {
  const {
    style = "solid",
    color = "#e0e0e0",
    thickness = 1,
    width = "100%",
    alignment = "center",
  } = block.data;

  const alignStyle = {
    left: "margin-right: auto; margin-left: 0;",
    center: "margin: 0 auto;",
    right: "margin-left: auto; margin-right: 0;",
  };

  return `
    <div style="${getBlockStyles(block.styles)}">
      <hr style="border: none; border-top: ${thickness}px ${style} ${color}; width: ${width}; ${alignStyle[alignment] || alignStyle.center}" />
    </div>
  `;
};

// Render Spacer Block
const renderSpacerBlock = (block) => {
  const { height = 30 } = block.data;

  return `
    <div style="height: ${height}px; ${getBlockStyles(block.styles)}"></div>
  `;
};

// Render Social Block
const renderSocialBlock = (block) => {
  const {
    links = [],
    alignment = "center",
    iconSize = 32,
    iconStyle = "colored",
    spacing = 10,
  } = block.data;

  const enabledLinks = links.filter((link) => link.enabled && link.url);

  if (enabledLinks.length === 0) {
    return `<div style="${getBlockStyles(block.styles)}"></div>`;
  }

  // URLs des icônes sociales (à remplacer par vos propres icônes)
  const socialIcons = {
    facebook: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
    linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
    tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    whatsapp: "https://cdn-icons-png.flaticon.com/512/124/124034.png",
    email: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
    website: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
  };

  const linksHtml = enabledLinks
    .map(
      (link) => `
      <a href="${link.url}" target="_blank" style="display: inline-block; margin: 0 ${spacing / 2}px;">
        <img src="${socialIcons[link.platform] || socialIcons.website}" alt="${link.platform}" width="${iconSize}" height="${iconSize}" style="display: block;" />
      </a>
    `
    )
    .join("");

  return `
    <div style="text-align: ${alignment}; ${getBlockStyles(block.styles)}">
      ${linksHtml}
    </div>
  `;
};

// Render Promo Code Block
const renderPromoCodeBlock = (block) => {
  const {
    code = "CODE10",
    description = "Votre code promo exclusif",
    discount = "-10%",
    expiryDate,
    showExpiry = true,
    backgroundColor = "#fff8e1",
    borderColor = "#ffc107",
    codeColor = "#e53935",
    textColor = "#333333",
  } = block.data;

  const expiryHtml =
    showExpiry && expiryDate
      ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">Valable jusqu'au ${new Date(expiryDate).toLocaleDateString("fr-FR")}</p>`
      : "";

  const discountHtml = discount
    ? `<p style="margin: 12px 0 0 0; font-size: 18px; color: ${textColor}; font-weight: 600;">${discount}</p>`
    : "";

  return `
    <div style="${getBlockStyles(block.styles)}">
      <div style="background-color: ${backgroundColor}; border: 2px dashed ${borderColor}; padding: 25px; border-radius: 12px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">${description}</p>
        <p style="margin: 0; font-size: 36px; font-weight: 800; color: ${codeColor}; letter-spacing: 3px; font-family: monospace;">${code}</p>
        ${discountHtml}
        ${expiryHtml}
      </div>
    </div>
  `;
};

// Render Product Card Block
const renderProductCardBlock = (block) => {
  const {
    imageUrl,
    name = "Nom du produit",
    description = "",
    price = "",
    oldPrice = "",
    buttonText = "Voir le produit",
    buttonUrl = "#",
    showPrice = true,
    showButton = true,
    layout = "vertical",
    backgroundColor = "#ffffff",
    borderColor = "#e0e0e0",
  } = block.data;

  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${name}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto 15px;" />`
    : "";

  const priceHtml = showPrice && price
    ? `
      <p style="margin: 10px 0; font-size: 20px; font-weight: 700; color: #2d6a4f;">
        ${oldPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 16px; margin-right: 8px;">${oldPrice}</span>` : ""}
        ${price}
      </p>
    `
    : "";

  const buttonHtml = showButton
    ? `
      <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2d6a4f; color: #ffffff; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 20px; text-decoration: none; margin-top: 10px;">
        ${buttonText}
      </a>
    `
    : "";

  const descHtml = description ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666; line-height: 1.5;">${description}</p>` : "";

  return `
    <div style="${getBlockStyles(block.styles)}">
      <div style="background-color: ${backgroundColor}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 20px; text-align: center;">
        ${imageHtml}
        <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #333;">${name}</h3>
        ${descHtml}
        ${priceHtml}
        ${buttonHtml}
      </div>
    </div>
  `;
};

// Render Columns Block
const renderColumnsBlock = (block) => {
  const {
    columnCount = 2,
    gap = 20,
    columns = [],
    verticalAlignment = "top",
  } = block.data;

  const columnWidth = Math.floor(100 / columnCount);
  const vAlign = { top: "top", middle: "middle", bottom: "bottom" };

  const renderColumnContent = (col) => {
    if (!col || !col.type) return "";

    switch (col.type) {
      case "text":
        return `<div style="font-size: 16px; line-height: 1.6; color: #333;">${col.data?.content || ""}</div>`;
      case "image":
        return col.data?.src
          ? `<img src="${col.data.src}" alt="${col.data.alt || "Image"}" style="max-width: 100%; height: auto; border-radius: 8px;" />`
          : "";
      case "button":
        return `<a href="${col.data?.url || "#"}" target="_blank" style="display: inline-block; background-color: #2d6a4f; color: #fff; padding: 12px 24px; border-radius: 20px; text-decoration: none; font-weight: 600;">${col.data?.text || "Cliquez"}</a>`;
      default:
        return "";
    }
  };

  const columnsHtml = columns
    .slice(0, columnCount)
    .map(
      (col, index) => `
      <td style="width: ${columnWidth}%; vertical-align: ${vAlign[verticalAlignment]}; padding: ${gap / 2}px;">
        ${renderColumnContent(col)}
      </td>
    `
    )
    .join("");

  return `
    <div style="${getBlockStyles(block.styles)}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          ${columnsHtml}
        </tr>
      </table>
    </div>
  `;
};

// Render Footer Block
const renderFooterBlock = (block, recipientEmail = "") => {
  const {
    companyName = "Krysto",
    companyAddress = "Nouvelle-Calédonie 🇳🇨",
    showUnsubscribe = true,
    unsubscribeText = "Se désinscrire de la newsletter",
    customLinks = [],
    showSocialLinks = false,
    socialLinks = [],
    backgroundColor = "#f5f5f5",
    textColor = "#888888",
    linkColor = "#2d6a4f",
    alignment = "center",
    copyright = "",
  } = block.data;

  const linksHtml = customLinks.length > 0
    ? customLinks
        .map(
          (link, index) =>
            `<a href="${link.url}" style="color: ${linkColor}; text-decoration: none; margin: 0 10px; font-size: 14px;">${link.label}</a>${index < customLinks.length - 1 ? '<span style="color: #ddd;">|</span>' : ""}`
        )
        .join("")
    : `
      <a href="${FRONTEND_URL}" style="color: ${linkColor}; text-decoration: none; margin: 0 10px; font-size: 14px;">Site web</a>
      <span style="color: #ddd;">|</span>
      <a href="${FRONTEND_URL}/products" style="color: ${linkColor}; text-decoration: none; margin: 0 10px; font-size: 14px;">Boutique</a>
      <span style="color: #ddd;">|</span>
      <a href="${FRONTEND_URL}/contact" style="color: ${linkColor}; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact</a>
    `;

  const unsubscribeHtml = showUnsubscribe
    ? `<a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(recipientEmail)}" style="font-size: 12px; color: #999; text-decoration: underline;">${unsubscribeText}</a>`
    : "";

  const copyrightHtml = copyright
    ? `<p style="font-size: 11px; color: #aaa; margin-top: 15px;">${copyright}</p>`
    : "";

  return `
    <div style="background-color: ${backgroundColor}; text-align: ${alignment}; ${getBlockStyles(block.styles)}">
      <p style="font-size: 13px; color: ${textColor}; margin-bottom: 15px;">
        Vous recevez cet email car vous êtes inscrit à notre newsletter.
      </p>
      <div style="margin-bottom: 20px;">
        ${linksHtml}
      </div>
      ${unsubscribeHtml}
      <p style="font-size: 11px; color: #aaa; margin-top: 20px;">
        © ${new Date().getFullYear()} ${companyName} - ${companyAddress}
      </p>
      ${copyrightHtml}
    </div>
  `;
};

// Render HTML Block
const renderHtmlBlock = (block) => {
  const { content = "" } = block.data;
  return `
    <div style="${getBlockStyles(block.styles)}">
      ${content}
    </div>
  `;
};

// ==========================================
// MAIN RENDER FUNCTION
// ==========================================

const blockRenderers = {
  header: renderHeaderBlock,
  text: renderTextBlock,
  image: renderImageBlock,
  button: renderButtonBlock,
  divider: renderDividerBlock,
  spacer: renderSpacerBlock,
  social: renderSocialBlock,
  "promo-code": renderPromoCodeBlock,
  "product-card": renderProductCardBlock,
  columns: renderColumnsBlock,
  footer: renderFooterBlock,
  html: renderHtmlBlock,
};

// Rendre un bloc unique
export const renderBlock = (block, recipientEmail = "") => {
  if (!block || block.hidden) return "";

  const renderer = blockRenderers[block.type];
  if (!renderer) {
    console.warn(`Unknown block type: ${block.type}`);
    return "";
  }

  // Passer l'email du destinataire pour le footer (désabonnement)
  if (block.type === "footer") {
    return renderer(block, recipientEmail);
  }

  return renderer(block);
};

// Rendre l'email complet à partir des blocs et settings
export const renderEmailFromBlocks = (blocks = [], settings = {}, recipientEmail = "") => {
  const {
    maxWidth = 600,
    backgroundColor = "#f4f4f4",
    contentBackgroundColor = "#ffffff",
    fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    baseFontSize = 16,
    baseTextColor = "#333333",
    borderRadius = 16,
    contentPadding = 0,
    preheaderText = "",
    mobileOptimized = true,
  } = settings;

  const blocksHtml = blocks
    .filter((block) => !block.hidden)
    .map((block) => renderBlock(block, recipientEmail))
    .join("");

  const preheaderHtml = preheaderText
    ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheaderText}</div>`
    : "";

  const mobileStyles = mobileOptimized
    ? `
      @media only screen and (max-width: 620px) {
        .container { padding: 10px !important; }
        .content { padding: 20px !important; }
        td { display: block !important; width: 100% !important; }
      }
    `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Email</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: ${fontFamily};
          background-color: ${backgroundColor};
          -webkit-font-smoothing: antialiased;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        img {
          border: 0;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        p {
          margin: 0 0 15px 0;
        }
        a {
          color: inherit;
        }
        ${mobileStyles}
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${backgroundColor};">
      ${preheaderHtml}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" class="container" width="${maxWidth}" cellpadding="0" cellspacing="0" style="max-width: ${maxWidth}px; width: 100%;">
              <tr>
                <td class="content" style="background-color: ${contentBackgroundColor}; border-radius: ${borderRadius}px; overflow: hidden; font-size: ${baseFontSize}px; color: ${baseTextColor};">
                  ${blocksHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Fonction de compatibilité pour les anciennes campagnes (sans blocs)
export const renderLegacyEmail = (campaign, recipientEmail) => {
  // Si la campagne a des blocs, les utiliser
  if (campaign.blocks && campaign.blocks.length > 0) {
    return renderEmailFromBlocks(campaign.blocks, campaign.settings || {}, recipientEmail);
  }

  // Sinon, utiliser l'ancien système de templates
  // On peut importer generateMailingTemplate de mailingTemplates.js ici si nécessaire
  return null;
};

export default renderEmailFromBlocks;