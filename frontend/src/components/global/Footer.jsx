import React from "react";
import "./Footer.css";

const Footer = () => {
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
            <a href="/">Accueil</a>
            <a href="/products">Nos produits</a>
            <a href="/about">Notre démarche</a>
            <a href="/contact">Contact</a>
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
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="Instagram">
              IG
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2025 Krysto - Recyclage plastique artisanal. Tous droits
          réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
