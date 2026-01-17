import React, { useState } from "react";
import "./Header.css";

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
        <a href="/" className="header-logo">
          <h1>Krysto</h1>
          <span className="header-tagline">Recyclage plastique</span>
        </a>

        <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
          <a href="/" onClick={closeMenu}>
            Accueil
          </a>
          <a href="/products" onClick={closeMenu}>
            Nos produits
          </a>
          <a href="/about" onClick={closeMenu}>
            Notre démarche
          </a>
          <a href="/contact" onClick={closeMenu}>
            Contact
          </a>

          <div className="header-actions-mobile">
            <a href="/cart" className="header-cart" onClick={closeMenu}>
              🛒 Panier
            </a>
            <a href="/login" className="header-login" onClick={closeMenu}>
              Connexion
            </a>
          </div>
        </nav>

        <div className="header-actions">
          <a href="/cart" className="header-cart">
            🛒 <span>Panier</span>
          </a>
          <a href="/login" className="header-login">
            Connexion
          </a>
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
