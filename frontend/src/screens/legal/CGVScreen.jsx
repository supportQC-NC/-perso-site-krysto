import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const CGVScreen = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>📋 Conditions Générales de Vente</h1>
        <p className="last-update">Dernière mise à jour : Janvier 2025</p>
      </div>

      <section className="legal-section">
        <h2>Préambule</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les relations 
          contractuelles entre Krysto et tout client effectuant un achat sur le site 
          krysto.nc. Toute commande implique l'acceptation sans réserve des présentes CGV.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 1 - Identité du vendeur</h2>
        <div className="legal-info-box">
          <p><strong>Raison sociale :</strong> Krysto</p>
          <p><strong>Forme juridique :</strong> [SARL / SAS / Auto-entrepreneur]</p>
          <p><strong>Siège social :</strong> [Adresse complète], Nouméa, Nouvelle-Calédonie</p>
          <p><strong>RIDET :</strong> [Numéro RIDET]</p>
          <p><strong>Email :</strong> contact@krysto.nc</p>
          <p><strong>Téléphone :</strong> +687 12 34 56</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Article 2 - Objet</h2>
        <p>
          Les présentes CGV ont pour objet de définir les droits et obligations des 
          parties dans le cadre de la vente en ligne des produits proposés par Krysto 
          sur son site internet krysto.nc.
        </p>
        <p>
          Krysto commercialise des produits fabriqués artisanalement à partir de 
          plastique recyclé en Nouvelle-Calédonie.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 3 - Produits</h2>
        <h3>3.1 Caractéristiques</h3>
        <p>
          Les produits proposés à la vente sont décrits et présentés avec la plus 
          grande exactitude possible. Toutefois, des variations mineures de couleur, 
          texture ou dimensions peuvent exister du fait du caractère artisanal de 
          notre production et de la nature du plastique recyclé utilisé.
        </p>
        <p>
          Ces variations ne constituent pas un défaut et ne peuvent donner lieu à 
          annulation de la vente ou remboursement.
        </p>

        <h3>3.2 Disponibilité</h3>
        <p>
          Les offres de produits sont valables dans la limite des stocks disponibles. 
          En cas d'indisponibilité d'un produit après passation de la commande, le 
          client sera informé par email et pourra choisir entre un remboursement ou 
          un produit de substitution.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 4 - Prix</h2>
        <p>
          Les prix sont indiqués en Francs Pacifique (XPF), toutes taxes comprises. 
          Ils ne comprennent pas les frais de livraison, facturés en supplément et 
          indiqués avant la validation de la commande.
        </p>
        <p>
          Krysto se réserve le droit de modifier ses prix à tout moment. Les produits 
          seront facturés sur la base des tarifs en vigueur au moment de la validation 
          de la commande.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 5 - Commande</h2>
        <h3>5.1 Processus de commande</h3>
        <p>Le client suit les étapes suivantes pour passer commande :</p>
        <ol>
          <li>Sélection des produits et ajout au panier</li>
          <li>Vérification du contenu du panier</li>
          <li>Identification (création de compte ou connexion)</li>
          <li>Choix du mode de livraison</li>
          <li>Choix du mode de paiement</li>
          <li>Validation de la commande après acceptation des CGV</li>
          <li>Paiement</li>
          <li>Confirmation de commande par email</li>
        </ol>

        <h3>5.2 Confirmation</h3>
        <p>
          Un email de confirmation récapitulant la commande est envoyé au client. 
          La vente est définitivement conclue à réception de ce mail de confirmation.
        </p>

        <h3>5.3 Modification / Annulation</h3>
        <p>
          Toute demande de modification ou d'annulation doit être effectuée par email 
          à contact@krysto.nc dans les 24 heures suivant la commande, et avant 
          l'expédition des produits.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 6 - Paiement</h2>
        <h3>6.1 Modes de paiement acceptés</h3>
        <ul>
          <li>Carte bancaire (Visa, Mastercard)</li>
          <li>Virement bancaire</li>
          <li>Paiement à la livraison (selon conditions)</li>
        </ul>

        <h3>6.2 Sécurité des paiements</h3>
        <p>
          Les paiements par carte bancaire sont sécurisés par notre prestataire de 
          paiement qui utilise le protocole SSL pour crypter vos données bancaires. 
          Krysto n'a jamais accès à vos informations bancaires complètes.
        </p>

        <h3>6.3 Défaut de paiement</h3>
        <p>
          En cas de défaut de paiement, Krysto se réserve le droit de suspendre ou 
          d'annuler toute commande et/ou livraison en cours.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 7 - Livraison</h2>
        <h3>7.1 Zones de livraison</h3>
        <p>
          Krysto livre principalement en Nouvelle-Calédonie (Grande Terre, Îles Loyauté). 
          Les livraisons vers la métropole ou l'international peuvent être étudiées 
          sur demande.
        </p>

        <h3>7.2 Délais de livraison</h3>
        <ul>
          <li><strong>Nouméa et Grand Nouméa :</strong> 2 à 5 jours ouvrés</li>
          <li><strong>Brousse :</strong> 5 à 10 jours ouvrés</li>
          <li><strong>Îles Loyauté :</strong> 7 à 14 jours ouvrés</li>
        </ul>
        <p>
          Ces délais sont donnés à titre indicatif et courent à compter de la 
          confirmation du paiement.
        </p>

        <h3>7.3 Frais de livraison</h3>
        <p>
          Les frais de livraison sont calculés en fonction du poids, du volume et 
          de la destination. Ils sont indiqués au client avant la validation de la 
          commande.
        </p>

        <h3>7.4 Réception</h3>
        <p>
          À la réception, le client doit vérifier l'état du colis. En cas de dommage, 
          le client doit émettre des réserves écrites auprès du transporteur et nous 
          contacter sous 48 heures.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 8 - Droit de rétractation</h2>
        <p>
          Conformément au Code de la consommation, le client dispose d'un délai de 
          <strong> 14 jours calendaires</strong> à compter de la réception du produit 
          pour exercer son droit de rétractation, sans avoir à justifier de motifs 
          ni à payer de pénalités.
        </p>

        <h3>8.1 Modalités</h3>
        <p>Pour exercer ce droit, le client doit :</p>
        <ol>
          <li>
            Notifier sa décision par email à contact@krysto.nc ou par courrier à 
            notre adresse
          </li>
          <li>Retourner le produit dans son emballage d'origine, non utilisé et intact</li>
          <li>Le retour doit être effectué sous 14 jours suivant la notification</li>
        </ol>

        <h3>8.2 Frais de retour</h3>
        <p>Les frais de retour sont à la charge du client.</p>

        <h3>8.3 Remboursement</h3>
        <p>
          Le remboursement sera effectué dans un délai de 14 jours suivant la 
          réception du produit retourné, via le même moyen de paiement utilisé 
          lors de la commande.
        </p>

        <h3>8.4 Exclusions</h3>
        <p>Le droit de rétractation ne s'applique pas aux :</p>
        <ul>
          <li>Produits personnalisés ou fabriqués sur mesure</li>
          <li>Produits descellés ne pouvant être retournés pour des raisons d'hygiène</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Article 9 - Garanties</h2>
        <h3>9.1 Garantie légale de conformité</h3>
        <p>
          Conformément aux articles L.217-4 et suivants du Code de la consommation, 
          le client bénéficie de la garantie légale de conformité pendant 2 ans à 
          compter de la délivrance du bien.
        </p>

        <h3>9.2 Garantie des vices cachés</h3>
        <p>
          Conformément aux articles 1641 et suivants du Code civil, le client 
          bénéficie de la garantie légale des vices cachés.
        </p>

        <h3>9.3 Exclusions</h3>
        <p>Les garanties ne couvrent pas :</p>
        <ul>
          <li>L'usure normale du produit</li>
          <li>Les dommages résultant d'une mauvaise utilisation</li>
          <li>Les dommages causés par un accident ou une négligence</li>
          <li>Les modifications non autorisées du produit</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Article 10 - Réclamations</h2>
        <p>
          Pour toute réclamation, le client peut contacter le service client par 
          email à contact@krysto.nc ou par téléphone au +687 12 34 56.
        </p>
        <p>
          En cas de litige non résolu, le client peut recourir gratuitement à un 
          médiateur de la consommation.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 11 - Protection des données</h2>
        <p>
          Les données personnelles collectées dans le cadre des commandes sont 
          traitées conformément à notre{" "}
          <Link to="/politique-confidentialite">Politique de Confidentialité</Link>.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 12 - Propriété intellectuelle</h2>
        <p>
          Tous les éléments du site (textes, images, logos, etc.) sont protégés par 
          le droit de la propriété intellectuelle. Toute reproduction est interdite 
          sans autorisation préalable.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 13 - Droit applicable et litiges</h2>
        <p>
          Les présentes CGV sont soumises au droit français applicable en 
          Nouvelle-Calédonie. En cas de litige, les parties s'efforceront de trouver 
          une solution amiable. À défaut, les tribunaux de Nouméa seront seuls compétents.
        </p>
      </section>

      <div className="legal-contact-box">
        <h3>📧 Service Client</h3>
        <p><strong>Email :</strong> contact@krysto.nc</p>
        <p><strong>Téléphone :</strong> +687 12 34 56</p>
        <p><strong>Horaires :</strong> Lundi au vendredi, 8h - 17h</p>
      </div>

      <div className="legal-back-top">
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default CGVScreen;
