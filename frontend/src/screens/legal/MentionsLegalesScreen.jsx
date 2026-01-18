import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const MentionsLegalesScreen = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>📜 Mentions Légales</h1>
        <p className="last-update">Dernière mise à jour : Janvier 2025</p>
      </div>

      <section className="legal-section">
        <h2>1. Éditeur du site</h2>
        <div className="legal-info-box">
          <p><strong>Raison sociale :</strong> Krysto</p>
          <p><strong>Forme juridique :</strong> [SARL / SAS / Auto-entrepreneur]</p>
          <p><strong>Capital social :</strong> [Montant] XPF</p>
          <p><strong>Siège social :</strong> [Adresse complète], Nouméa, Nouvelle-Calédonie</p>
          <p><strong>RIDET :</strong> [Numéro RIDET]</p>
          <p><strong>RCS :</strong> [Numéro RCS Nouméa]</p>
          <p><strong>Téléphone :</strong> +687 12 34 56</p>
          <p><strong>Email :</strong> contact@krysto.nc</p>
          <p><strong>Directeur de la publication :</strong> [Nom du responsable]</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>2. Hébergeur du site</h2>
        <div className="legal-info-box">
          <p><strong>Nom :</strong> [Nom de l'hébergeur]</p>
          <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
          <p><strong>Téléphone :</strong> [Téléphone hébergeur]</p>
          <p><strong>Site web :</strong> [URL hébergeur]</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, 
          icônes, etc.) est la propriété exclusive de Krysto ou de ses partenaires. 
          Toute reproduction, représentation, modification, publication, adaptation de 
          tout ou partie des éléments du site, quel que soit le moyen ou le procédé 
          utilisé, est interdite sans l'autorisation écrite préalable de Krysto.
        </p>
        <p>
          Toute exploitation non autorisée du site ou de l'un quelconque des éléments 
          qu'il contient sera considérée comme constitutive d'une contrefaçon et 
          poursuivie conformément aux dispositions des articles L.335-2 et suivants 
          du Code de la Propriété Intellectuelle.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Crédits</h2>
        <p><strong>Conception et développement :</strong> [Nom du développeur/agence]</p>
        <p><strong>Photographies :</strong> [Crédits photos si applicable]</p>
        <p><strong>Illustrations :</strong> [Crédits illustrations si applicable]</p>
      </section>

      <section className="legal-section">
        <h2>5. Données personnelles</h2>
        <p>
          Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée 
          et au Règlement Général sur la Protection des Données (RGPD), vous disposez 
          d'un droit d'accès, de rectification, de suppression et d'opposition aux 
          données personnelles vous concernant.
        </p>
        <p>
          Pour plus d'informations sur la collecte et le traitement de vos données 
          personnelles, veuillez consulter notre{" "}
          <Link to="/politique-confidentialite">Politique de Confidentialité</Link>.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Cookies</h2>
        <p>
          Ce site utilise des cookies pour améliorer votre expérience de navigation. 
          Pour en savoir plus sur l'utilisation des cookies et gérer vos préférences, 
          consultez notre{" "}
          <Link to="/politique-cookies">Politique de Cookies</Link>.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Limitation de responsabilité</h2>
        <p>
          Krysto s'efforce d'assurer au mieux l'exactitude et la mise à jour des 
          informations diffusées sur ce site. Toutefois, Krysto ne peut garantir 
          l'exactitude, la précision ou l'exhaustivité des informations mises à 
          disposition sur ce site.
        </p>
        <p>
          En conséquence, Krysto décline toute responsabilité :
        </p>
        <ul>
          <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
          <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers</li>
          <li>Pour tous dommages, directs ou indirects, quelles qu'en soient les causes, origines, natures ou conséquences</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>8. Liens hypertextes</h2>
        <p>
          Le site peut contenir des liens hypertextes vers d'autres sites. Krysto 
          n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant 
          à leur contenu ou aux pratiques de protection des données personnelles de 
          ces sites.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français applicable 
          en Nouvelle-Calédonie. En cas de litige, les tribunaux de Nouméa seront 
          seuls compétents.
        </p>
      </section>

      <div className="legal-contact-box">
        <h3>📧 Contact</h3>
        <p>Pour toute question concernant ces mentions légales :</p>
        <p><strong>Email :</strong> contact@krysto.nc</p>
        <p><strong>Adresse :</strong> [Adresse], Nouméa, Nouvelle-Calédonie</p>
      </div>

      <div className="legal-back-top">
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default MentionsLegalesScreen;
