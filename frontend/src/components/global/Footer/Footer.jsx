import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/images/logo.svg" alt="Krysto" />
          </Link>
          <p className="footer__description">
            Entreprise artisanale de recyclage de plastique en
            Nouvelle-Calédonie. Nous transformons vos déchets en produits
            durables par injection.
          </p>
          <div className="footer__socials">
            <a
              href="https://www.facebook.com/Krysto.noumea/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FiFacebook />
            </a>
            <a
              href="https://www.instagram.com/krysto.nc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FiInstagram />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="footer__section">
          <h4 className="footer__title">Navigation</h4>
          <nav className="footer__nav">
            <Link to="/">Accueil</Link>
            <Link to="/products">Produits</Link>
            <Link to="/about">À propos</Link>
            <Link to="/contact">Nous contacter</Link>
          </nav>
        </div>

        {/* Compte */}
        <div className="footer__section">
          <h4 className="footer__title">Mon compte</h4>
          <nav className="footer__nav">
            <Link to="/login">Connexion</Link>
            <Link to="/register">Créer un compte</Link>
            <Link to="/profile">Mon profil</Link>
            <Link to="/my-orders">Mes commandes</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer__section">
          <h4 className="footer__title">Contact</h4>
          <div className="footer__contact">
            <a href="tel:+687939253">
              <FiPhone />
              <span>+687 93 92 53</span>
            </a>
            <a href="mailto:contact@krysto.nc">
              <FiMail />
              <span>contact@krysto.nc</span>
            </a>
            <p>
              <FiMapPin />
              <span>Nouméa, Nouvelle-Calédonie</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <p>&copy; {currentYear} Krysto. Tous droits réservés.</p>
          <div className="footer__legal">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgv">CGV</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
