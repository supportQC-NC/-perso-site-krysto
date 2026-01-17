import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img
            src="/images/logo.svg"
            alt="Krysto"
            className="header-logo-img"
          />
        </Link>

        <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Accueil
          </Link>
          <Link to="/products" onClick={closeMenu}>
            Nos produits
          </Link>
          <Link to="/about" onClick={closeMenu}>
            Notre démarche
          </Link>
          <Link to="/partners" onClick={closeMenu}>
            Nos partenaires
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <div className="header-actions-mobile">
            <Link to="/cart" className="header-cart" onClick={closeMenu}>
              🛒 Panier
            </Link>
            <Link to="/login" className="header-login" onClick={closeMenu}>
              Connexion
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="header-cart">
            🛒 <span>Panier</span>
          </Link>
          <Link to="/login" className="header-login">
            Connexion
          </Link>
        </div>

        <button
          className={`header-menu-btn ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && <div className="header-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;
