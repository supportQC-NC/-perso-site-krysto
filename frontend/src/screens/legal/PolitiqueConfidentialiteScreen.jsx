import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const PolitiqueConfidentialiteScreen = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>🔒 Politique de Confidentialité</h1>
        <p className="last-update">Dernière mise à jour : Janvier 2025</p>
      </div>

      <section className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          Krysto (ci-après « nous », « notre », « nos ») s'engage à protéger la vie 
          privée des utilisateurs de son site web krysto.nc (ci-après « le Site »). 
          Cette politique de confidentialité explique comment nous collectons, utilisons, 
          partageons et protégeons vos données personnelles conformément au Règlement 
          Général sur la Protection des Données (RGPD) et à la loi Informatique et 
          Libertés.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Responsable du traitement</h2>
        <div className="legal-info-box">
          <p><strong>Raison sociale :</strong> Krysto</p>
          <p><strong>Adresse :</strong> [Adresse complète], Nouméa, Nouvelle-Calédonie</p>
          <p><strong>Email :</strong> contact@krysto.nc</p>
          <p><strong>Téléphone :</strong> +687 12 34 56</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>3. Données collectées</h2>
        <p>Nous collectons les catégories de données suivantes :</p>
        
        <h3>3.1 Données fournies directement par vous</h3>
        <ul>
          <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
          <li><strong>Données de livraison :</strong> adresse postale complète</li>
          <li><strong>Données de paiement :</strong> informations bancaires (traitées de manière sécurisée par notre prestataire de paiement)</li>
          <li><strong>Données de communication :</strong> messages envoyés via le formulaire de contact</li>
          <li><strong>Données de compte :</strong> identifiant, mot de passe (crypté)</li>
        </ul>

        <h3>3.2 Données collectées automatiquement</h3>
        <ul>
          <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de visite</li>
          <li><strong>Données techniques :</strong> type d'appareil, système d'exploitation</li>
          <li><strong>Cookies :</strong> voir notre <Link to="/politique-cookies">Politique de Cookies</Link></li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Finalités du traitement</h2>
        <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Finalité</th>
              <th>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gestion des commandes et livraisons</td>
              <td>Exécution du contrat</td>
            </tr>
            <tr>
              <td>Création et gestion de votre compte client</td>
              <td>Exécution du contrat</td>
            </tr>
            <tr>
              <td>Réponse à vos demandes de contact</td>
              <td>Intérêt légitime</td>
            </tr>
            <tr>
              <td>Envoi de newsletters (si consentement)</td>
              <td>Consentement</td>
            </tr>
            <tr>
              <td>Amélioration de nos services</td>
              <td>Intérêt légitime</td>
            </tr>
            <tr>
              <td>Respect de nos obligations légales</td>
              <td>Obligation légale</td>
            </tr>
            <tr>
              <td>Statistiques et analyse du site</td>
              <td>Intérêt légitime / Consentement</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="legal-section">
        <h2>5. Durée de conservation</h2>
        <p>Nous conservons vos données personnelles pendant les durées suivantes :</p>
        <ul>
          <li><strong>Données clients :</strong> 3 ans après la dernière commande ou interaction</li>
          <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
          <li><strong>Données de contact (prospects) :</strong> 3 ans après le dernier contact</li>
          <li><strong>Cookies :</strong> 13 mois maximum</li>
          <li><strong>Données de navigation :</strong> 13 mois</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Destinataires des données</h2>
        <p>Vos données peuvent être transmises aux destinataires suivants :</p>
        <ul>
          <li><strong>Services internes :</strong> service commercial, service client, service logistique</li>
          <li><strong>Prestataires de paiement :</strong> pour le traitement sécurisé des paiements</li>
          <li><strong>Transporteurs :</strong> pour la livraison de vos commandes</li>
          <li><strong>Hébergeur :</strong> pour le stockage sécurisé des données</li>
          <li><strong>Outils d'analyse :</strong> pour les statistiques de fréquentation (données anonymisées)</li>
        </ul>
        <p>
          Nous ne vendons jamais vos données personnelles à des tiers. Nos prestataires 
          sont contractuellement tenus de respecter la confidentialité de vos données.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Transferts hors UE</h2>
        <p>
          Certains de nos prestataires peuvent être situés en dehors de l'Union Européenne. 
          Dans ce cas, nous nous assurons que des garanties appropriées sont mises en 
          place (clauses contractuelles types, certification Privacy Shield, etc.) pour 
          protéger vos données conformément au RGPD.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et en obtenir une copie</li>
          <li><strong>Droit de rectification :</strong> faire corriger vos données inexactes ou incomplètes</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données dans certains cas</li>
          <li><strong>Droit à la limitation :</strong> demander la limitation du traitement de vos données</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible</li>
          <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes</li>
          <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
        </ul>
        
        <div className="legal-info-box">
          <p>
            <strong>Pour exercer vos droits</strong>, envoyez-nous un email à{" "}
            <strong>contact@krysto.nc</strong> avec une copie de votre pièce d'identité. 
            Nous répondrons dans un délai d'un mois.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>9. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
          pour protéger vos données personnelles contre la destruction, la perte, 
          l'altération, la divulgation ou l'accès non autorisé :
        </p>
        <ul>
          <li>Chiffrement SSL/TLS pour toutes les transmissions de données</li>
          <li>Mots de passe cryptés avec des algorithmes sécurisés</li>
          <li>Accès restreint aux données personnelles</li>
          <li>Sauvegardes régulières</li>
          <li>Mises à jour de sécurité régulières</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>10. Réclamation</h2>
        <p>
          Si vous estimez que le traitement de vos données personnelles constitue une 
          violation du RGPD, vous avez le droit d'introduire une réclamation auprès 
          de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
        </p>
        <div className="legal-info-box">
          <p><strong>CNIL</strong></p>
          <p>3 Place de Fontenoy, TSA 80715</p>
          <p>75334 Paris Cedex 07</p>
          <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
        </div>
      </section>

      <section className="legal-section">
        <h2>11. Modifications</h2>
        <p>
          Nous nous réservons le droit de modifier cette politique de confidentialité 
          à tout moment. Les modifications seront publiées sur cette page avec une 
          date de mise à jour. Nous vous encourageons à consulter régulièrement cette 
          page pour rester informé de nos pratiques.
        </p>
      </section>

      <div className="legal-contact-box">
        <h3>📧 Contact DPO</h3>
        <p>Pour toute question relative à la protection de vos données :</p>
        <p><strong>Email :</strong> contact@krysto.nc</p>
        <p><strong>Objet :</strong> "Protection des données personnelles"</p>
      </div>

      <div className="legal-back-top">
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialiteScreen;
