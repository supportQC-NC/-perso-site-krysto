import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const CGUScreen = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>📖 Conditions Générales d'Utilisation</h1>
        <p className="last-update">Dernière mise à jour : Janvier 2025</p>
      </div>

      <section className="legal-section">
        <h2>Article 1 - Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de 
          définir les conditions d'accès et d'utilisation du site krysto.nc (ci-après 
          « le Site ») édité par Krysto.
        </p>
        <p>
          L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière 
          des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas 
          utiliser le Site.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 2 - Mentions légales</h2>
        <p>
          Les informations légales concernant l'éditeur du Site sont disponibles sur 
          la page <Link to="/mentions-legales">Mentions Légales</Link>.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 3 - Accès au Site</h2>
        <h3>3.1 Disponibilité</h3>
        <p>
          Le Site est accessible gratuitement à tout utilisateur disposant d'un accès 
          à Internet. Tous les coûts liés à l'accès au Site (matériel informatique, 
          connexion Internet, etc.) sont à la charge de l'utilisateur.
        </p>

        <h3>3.2 Interruptions</h3>
        <p>
          Krysto s'efforce de maintenir le Site accessible 24h/24 et 7j/7. Toutefois, 
          l'accès peut être temporairement suspendu, sans préavis, pour des raisons 
          techniques de maintenance, de mise à jour ou pour tout autre motif.
        </p>
        <p>
          Krysto ne saurait être tenu responsable des conséquences de ces interruptions 
          pour l'utilisateur.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 4 - Compte utilisateur</h2>
        <h3>4.1 Création de compte</h3>
        <p>
          Pour accéder à certains services (passer commande, gérer ses commandes, etc.), 
          l'utilisateur doit créer un compte en fournissant des informations exactes 
          et complètes.
        </p>

        <h3>4.2 Responsabilité</h3>
        <p>L'utilisateur est responsable de :</p>
        <ul>
          <li>La confidentialité de ses identifiants de connexion</li>
          <li>Toute activité effectuée depuis son compte</li>
          <li>La mise à jour de ses informations personnelles</li>
        </ul>
        <p>
          En cas d'utilisation frauduleuse de son compte, l'utilisateur doit en 
          informer Krysto immédiatement à contact@krysto.nc.
        </p>

        <h3>4.3 Suppression de compte</h3>
        <p>
          L'utilisateur peut demander la suppression de son compte à tout moment en 
          contactant le service client. Krysto se réserve le droit de suspendre ou 
          supprimer un compte en cas de violation des présentes CGU.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 5 - Utilisation du Site</h2>
        <h3>5.1 Usages autorisés</h3>
        <p>Le Site est destiné à :</p>
        <ul>
          <li>Consulter les produits proposés par Krysto</li>
          <li>Effectuer des achats en ligne</li>
          <li>Contacter Krysto via le formulaire de contact</li>
          <li>S'informer sur l'entreprise et sa démarche éco-responsable</li>
        </ul>

        <h3>5.2 Usages interdits</h3>
        <p>Il est strictement interdit de :</p>
        <ul>
          <li>Utiliser le Site à des fins illégales ou non autorisées</li>
          <li>Tenter d'accéder sans autorisation aux systèmes informatiques de Krysto</li>
          <li>Introduire des virus ou tout code malveillant</li>
          <li>Collecter des données personnelles d'autres utilisateurs</li>
          <li>Reproduire, copier ou revendre tout ou partie du Site</li>
          <li>Utiliser des robots ou systèmes automatisés pour accéder au Site</li>
          <li>Publier des contenus diffamatoires, injurieux, obscènes ou illicites</li>
          <li>Usurper l'identité d'une autre personne</li>
          <li>Perturber le bon fonctionnement du Site</li>
        </ul>
        
        <div className="legal-info-box">
          <p>
            <strong>Attention :</strong> Tout manquement à ces règles pourra entraîner 
            la suspension ou la suppression du compte, sans préjudice des poursuites 
            judiciaires qui pourraient être engagées.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Article 6 - Contenu du Site</h2>
        <h3>6.1 Propriété intellectuelle</h3>
        <p>
          L'ensemble des éléments composant le Site (textes, images, logos, vidéos, 
          graphismes, base de données, logiciels, etc.) est la propriété exclusive 
          de Krysto ou de ses partenaires et est protégé par les lois relatives à 
          la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification ou exploitation, totale 
          ou partielle, de ces éléments est interdite sans l'autorisation écrite 
          préalable de Krysto.
        </p>

        <h3>6.2 Marques</h3>
        <p>
          La marque "Krysto" et son logo sont des marques déposées. Toute utilisation 
          non autorisée de ces marques est interdite.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 7 - Avis et commentaires</h2>
        <h3>7.1 Publication d'avis</h3>
        <p>
          Les utilisateurs ayant effectué un achat peuvent publier un avis sur les 
          produits. Ces avis doivent être sincères, respectueux et porter sur le 
          produit concerné.
        </p>

        <h3>7.2 Modération</h3>
        <p>
          Krysto se réserve le droit de modérer, modifier ou supprimer tout avis 
          qui :
        </p>
        <ul>
          <li>Contient des propos injurieux, diffamatoires ou discriminatoires</li>
          <li>Est hors sujet ou constitue du spam</li>
          <li>Contient des données personnelles de tiers</li>
          <li>Fait la promotion de produits ou services concurrents</li>
          <li>Est manifestement faux ou trompeur</li>
        </ul>

        <h3>7.3 Licence</h3>
        <p>
          En publiant un avis, l'utilisateur accorde à Krysto une licence gratuite, 
          non exclusive et mondiale pour utiliser, reproduire et afficher cet avis 
          sur le Site et ses supports de communication.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 8 - Liens hypertextes</h2>
        <h3>8.1 Liens sortants</h3>
        <p>
          Le Site peut contenir des liens vers des sites tiers. Krysto n'exerce 
          aucun contrôle sur ces sites et décline toute responsabilité quant à 
          leur contenu ou leurs pratiques.
        </p>

        <h3>8.2 Liens entrants</h3>
        <p>
          Tout lien vers le Site doit faire l'objet d'une autorisation préalable 
          de Krysto. Les liens vers des activités illicites sont strictement interdits.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 9 - Données personnelles</h2>
        <p>
          La collecte et le traitement des données personnelles sont régis par notre{" "}
          <Link to="/politique-confidentialite">Politique de Confidentialité</Link>, 
          qui fait partie intégrante des présentes CGU.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 10 - Cookies</h2>
        <p>
          L'utilisation des cookies sur le Site est décrite dans notre{" "}
          <Link to="/politique-cookies">Politique de Cookies</Link>.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 11 - Limitation de responsabilité</h2>
        <p>Krysto ne saurait être tenu responsable :</p>
        <ul>
          <li>Des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser le Site</li>
          <li>Des erreurs ou omissions dans le contenu du Site</li>
          <li>Des dommages causés par des tiers utilisant le Site</li>
          <li>Des virus ou autres éléments nuisibles présents sur le Site malgré les mesures de sécurité</li>
          <li>De l'indisponibilité temporaire ou permanente du Site</li>
        </ul>
        <p>
          La responsabilité de Krysto est limitée aux dommages directs et prévisibles, 
          à l'exclusion de tout dommage indirect.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 12 - Modification des CGU</h2>
        <p>
          Krysto se réserve le droit de modifier les présentes CGU à tout moment. 
          Les modifications entrent en vigueur dès leur publication sur le Site. 
          Il est conseillé aux utilisateurs de consulter régulièrement cette page.
        </p>
        <p>
          L'utilisation du Site après modification des CGU vaut acceptation des 
          nouvelles conditions.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 13 - Divisibilité</h2>
        <p>
          Si une ou plusieurs stipulations des présentes CGU sont tenues pour non 
          valides ou déclarées comme telles en application d'une loi, d'un règlement 
          ou d'une décision de justice, les autres stipulations garderont toute leur 
          force et leur portée.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 14 - Droit applicable et juridiction</h2>
        <p>
          Les présentes CGU sont régies par le droit français applicable en 
          Nouvelle-Calédonie. Tout litige relatif à leur interprétation et/ou à 
          leur exécution relève de la compétence exclusive des tribunaux de Nouméa.
        </p>
      </section>

      <div className="legal-contact-box">
        <h3>📧 Contact</h3>
        <p>Pour toute question concernant ces CGU :</p>
        <p><strong>Email :</strong> contact@krysto.nc</p>
        <p><strong>Adresse :</strong> [Adresse], Nouméa, Nouvelle-Calédonie</p>
      </div>

      <div className="legal-back-top">
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default CGUScreen;
