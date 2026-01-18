import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Krysto</h4>
          <p>
            Nous transformons les déchets plastiques en objets du quotidien,
            fabriqués artisanalement en Nouvelle-Calédonie.
          </p>
          <p className="footer-eco">♻️ Économie circulaire locale</p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <nav className="footer-nav">
            <Link to="/">Accueil</Link>
            <Link to="/products">Nos produits</Link>
            <Link to="/about">Notre démarche</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📍 Nouméa, Nouvelle-Calédonie</p>
          <p>📧 contact@krysto.nc</p>
          <p>📞 +687 12 34 56</p>
        </div>

        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="footer-socials">
            <a
              href="https://facebook.com/krysto.nc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              FB
            </a>
            <a
              href="https://instagram.com/krysto.nc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              IG
            </a>
          </div>
        </div>
      </div>

      {/* Section légale RGPD */}
      <div className="footer-legal">
        <nav className="footer-legal-nav">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/politique-confidentialite">
            Politique de confidentialité
          </Link>
          <Link to="/politique-cookies">Gestion des cookies</Link>
          <Link to="/cgv">Conditions générales de vente</Link>
          <Link to="/cgu">Conditions générales d'utilisation</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Krysto - Recyclage plastique artisanal. Tous
          droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
