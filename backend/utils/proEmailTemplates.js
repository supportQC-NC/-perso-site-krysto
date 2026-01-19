// ==========================================
// TEMPLATES EMAIL POUR LES DEMANDES PRO
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const ADMIN_URL = process.env.ADMIN_URL || `${FRONTEND_URL}/admin`;

// ==========================================
// NOTIFICATION ADMIN - Nouvelle demande
// ==========================================
export const proRequestNotificationTemplate = (proRequest) => {
  const partnershipLabel = proRequest.partnershipType === "revendeur" ? "Revendeur" : "Dépôt-vente";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🏢</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nouvelle demande de compte Pro</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
            Une nouvelle demande de compte professionnel a été soumise et attend votre validation.
          </p>

          <!-- Informations entreprise -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 16px;">🏭 Informations entreprise</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Entreprise :</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${proRequest.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Raison sociale :</td>
                <td style="padding: 8px 0; color: #333;">${proRequest.legalStatus}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">N° RIDET :</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${proRequest.ridetNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Type souhaité :</td>
                <td style="padding: 8px 0;">
                  <span style="background: ${proRequest.partnershipType === 'revendeur' ? '#e3f2fd' : '#fff3e0'}; color: ${proRequest.partnershipType === 'revendeur' ? '#1976d2' : '#f57c00'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${partnershipLabel}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Informations contact -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 16px;">👤 Contact</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Nom complet :</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${proRequest.firstName} ${proRequest.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email :</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${proRequest.email}" style="color: #1976d2;">${proRequest.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Téléphone :</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="tel:${proRequest.phone}" style="color: #1976d2;">${proRequest.phone}</a>
                </td>
              </tr>
            </table>
          </div>

          <!-- Adresse -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 16px;">📍 Adresse</h3>
            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
              ${proRequest.address.street}<br>
              ${proRequest.address.postalCode} ${proRequest.address.city}<br>
              ${proRequest.address.country}
            </p>
          </div>

          ${proRequest.message ? `
          <!-- Message -->
          <div style="background: #fff8e1; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 10px 0; color: #f57c00; font-size: 14px;">💬 Message du demandeur</h3>
            <p style="margin: 0; color: #333; font-size: 14px; font-style: italic; line-height: 1.6;">
              "${proRequest.message}"
            </p>
          </div>
          ` : ''}

          <!-- Bouton action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ADMIN_URL}/pro-requests/${proRequest._id}" 
               style="background: linear-gradient(90deg, #1976d2, #42a5f5); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
              Examiner la demande →
            </a>
          </div>

          <p style="font-size: 13px; color: #999; text-align: center; margin-top: 30px;">
            Demande reçue le ${new Date(proRequest.createdAt).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// EMAIL UTILISATEUR - Demande approuvée
// ==========================================
export const proRequestApprovedTemplate = (proRequest, user) => {
  const partnershipLabel = proRequest.partnershipType === "revendeur" ? "Revendeur" : "Dépôt-vente";

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
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Félicitations !</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Votre compte Pro a été approuvé
          </p>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Bonjour <strong>${proRequest.firstName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Nous avons le plaisir de vous informer que votre demande de compte professionnel 
            pour <strong>${proRequest.companyName}</strong> a été approuvée !
          </p>

          <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Votre statut</p>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: #2d6a4f;">
              Compte Pro ${partnershipLabel}
            </p>
          </div>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Vous bénéficiez désormais de :
          </p>
          
          <ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">
            <li>✅ Accès à notre catalogue professionnel</li>
            <li>✅ Tarifs préférentiels sur vos commandes</li>
            <li>✅ Un accompagnement personnalisé</li>
            <li>✅ Des facilités de paiement</li>
            ${proRequest.partnershipType === 'depot_vente' ? '<li>✅ Conditions de dépôt-vente avantageuses</li>' : ''}
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/profile" 
               style="background: linear-gradient(90deg, #2d6a4f, #40916c); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
              Accéder à mon compte Pro →
            </a>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-top: 25px;">
            <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
              Une question ? Contactez-nous à <a href="mailto:pro@krysto.nc" style="color: #2d6a4f;">pro@krysto.nc</a>
            </p>
          </div>

          <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            Bienvenue dans la famille des partenaires Krysto ! 🌿<br><br>
            L'équipe Krysto
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// EMAIL UTILISATEUR - Demande rejetée
// ==========================================
export const proRequestRejectedTemplate = (proRequest, rejectionReason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #455a64, #78909c); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Concernant votre demande</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Bonjour <strong>${proRequest.firstName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Nous avons bien examiné votre demande de compte professionnel pour 
            <strong>${proRequest.companyName}</strong>.
          </p>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Malheureusement, nous ne sommes pas en mesure d'y donner suite pour le moment.
          </p>

          ${rejectionReason ? `
          <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #78909c;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; font-weight: 600;">Motif :</p>
            <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6;">
              ${rejectionReason}
            </p>
          </div>
          ` : ''}

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Si vous pensez qu'il y a eu une erreur ou si vous souhaitez nous fournir des informations 
            complémentaires, n'hésitez pas à nous contacter.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/contact" 
               style="background: linear-gradient(90deg, #455a64, #78909c); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block;">
              Nous contacter →
            </a>
          </div>

          <p style="font-size: 14px; color: #6c757d; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            Vous pouvez soumettre une nouvelle demande à tout moment.<br><br>
            Cordialement,<br>
            L'équipe Krysto
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default {
  proRequestNotificationTemplate,
  proRequestApprovedTemplate,
  proRequestRejectedTemplate,
};