import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const PolitiqueCookiesScreen = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>🍪 Politique de Cookies</h1>
        <p className="last-update">Dernière mise à jour : Janvier 2025</p>
      </div>

      <section className="legal-section">
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, 
          tablette, smartphone) lors de votre visite sur notre site. Il permet de 
          stocker des informations relatives à votre navigation et de vous reconnaître 
          lors de vos prochaines visites.
        </p>
        <p>
          Les cookies ne contiennent pas d'informations personnelles et ne peuvent pas 
          endommager votre appareil. Ils sont essentiels au bon fonctionnement de 
          nombreuses fonctionnalités du site.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Types de cookies utilisés</h2>
        
        <h3>2.1 Cookies strictement nécessaires</h3>
        <p>
          Ces cookies sont indispensables au fonctionnement du site. Ils permettent 
          d'utiliser les principales fonctionnalités du site (accès à votre compte, 
          panier d'achat, etc.). Sans ces cookies, vous ne pourrez pas utiliser 
          normalement le site.
        </p>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Nom du cookie</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>session_id</td>
              <td>Identification de la session utilisateur</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>csrf_token</td>
              <td>Sécurité contre les attaques CSRF</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>cart</td>
              <td>Mémorisation du panier d'achat</td>
              <td>30 jours</td>
            </tr>
            <tr>
              <td>auth_token</td>
              <td>Authentification de l'utilisateur connecté</td>
              <td>30 jours</td>
            </tr>
          </tbody>
        </table>

        <h3>2.2 Cookies de performance et d'analyse</h3>
        <p>
          Ces cookies nous permettent de mesurer l'audience du site, de comprendre 
          comment les visiteurs l'utilisent et d'améliorer son fonctionnement.
        </p>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Nom du cookie</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>_ga</td>
              <td>Google Analytics - Distinction des utilisateurs</td>
              <td>2 ans</td>
            </tr>
            <tr>
              <td>_ga_*</td>
              <td>Google Analytics - État de la session</td>
              <td>2 ans</td>
            </tr>
            <tr>
              <td>_gid</td>
              <td>Google Analytics - Distinction des utilisateurs</td>
              <td>24 heures</td>
            </tr>
          </tbody>
        </table>

        <h3>2.3 Cookies de fonctionnalité</h3>
        <p>
          Ces cookies permettent de mémoriser vos préférences et d'améliorer votre 
          expérience utilisateur (langue, région, préférences d'affichage, etc.).
        </p>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Nom du cookie</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>user_preferences</td>
              <td>Préférences d'affichage de l'utilisateur</td>
              <td>1 an</td>
            </tr>
            <tr>
              <td>cookie_consent</td>
              <td>Mémorisation de vos choix de cookies</td>
              <td>1 an</td>
            </tr>
          </tbody>
        </table>

        <h3>2.4 Cookies marketing (optionnels)</h3>
        <p>
          Ces cookies peuvent être utilisés pour vous proposer des publicités 
          personnalisées. Ils ne sont activés qu'avec votre consentement explicite.
        </p>
        <div className="legal-info-box">
          <p>
            <strong>Note :</strong> Actuellement, nous n'utilisons pas de cookies 
            marketing ou publicitaires sur notre site.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>3. Gestion de vos préférences</h2>
        <p>
          Lors de votre première visite, un bandeau vous informe de la présence de 
          cookies et vous permet de les accepter ou de les refuser. Vous pouvez 
          modifier vos choix à tout moment.
        </p>
        
        <h3>3.1 Via notre bandeau de consentement</h3>
        <p>
          Vous pouvez modifier vos préférences de cookies à tout moment en cliquant 
          sur le lien "Gestion des cookies" présent en bas de chaque page du site.
        </p>

        <h3>3.2 Via les paramètres de votre navigateur</h3>
        <p>
          Vous pouvez également configurer votre navigateur pour accepter ou refuser 
          les cookies. Voici les liens vers les instructions des principaux navigateurs :
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Microsoft Edge
            </a>
          </li>
        </ul>
        
        <div className="legal-info-box">
          <p>
            <strong>Attention :</strong> La désactivation des cookies nécessaires peut 
            affecter le fonctionnement du site et vous empêcher d'accéder à certaines 
            fonctionnalités (connexion, panier, etc.).
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>4. Cookies tiers</h2>
        <p>
          Certains cookies sont déposés par des services tiers qui apparaissent sur 
          nos pages. Nous ne contrôlons pas le dépôt de ces cookies. Pour plus 
          d'informations, consultez les politiques de confidentialité de ces services :
        </p>
        <ul>
          <li>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Analytics - Politique de confidentialité
            </a>
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Durée de conservation</h2>
        <p>
          Conformément à la réglementation, les cookies ont une durée de vie maximale 
          de 13 mois. Au-delà de cette période, votre consentement sera à nouveau 
          recueilli.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Évolution de cette politique</h2>
        <p>
          Nous pouvons être amenés à modifier cette politique de cookies pour nous 
          conformer à la réglementation ou pour intégrer de nouveaux services. 
          Nous vous invitons à consulter régulièrement cette page.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Plus d'informations</h2>
        <p>
          Pour en savoir plus sur les cookies et vos droits, vous pouvez consulter 
          le site de la CNIL :{" "}
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer">
            www.cnil.fr/fr/cookies-et-autres-traceurs
          </a>
        </p>
      </section>

      <div className="legal-contact-box">
        <h3>📧 Contact</h3>
        <p>Pour toute question concernant notre politique de cookies :</p>
        <p><strong>Email :</strong> contact@krysto.nc</p>
      </div>

      <div className="legal-back-top">
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default PolitiqueCookiesScreen;
