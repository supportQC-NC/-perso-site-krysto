import React, { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";
import { toast } from "react-toastify";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      closeMenu();
      navigate("/");
      toast.success("Déconnexion réussie !");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur de déconnexion");
    }
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

          {/* Mobile */}
          <div className="header-actions-mobile">
            <Link to="/cart" className="header-cart" onClick={closeMenu}>
              🛒
            </Link>

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="header-profile"
                  onClick={closeMenu}
                >
                  👤 {userInfo.name}
                </Link>
                <button className="header-logout" onClick={logoutHandler}>
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="header-login" onClick={closeMenu}>
                Connexion
              </Link>
            )}
          </div>
        </nav>

        {/* Desktop */}
        <div className="header-actions">
          <Link to="/cart" className="header-cart">
            🛒
          </Link>

          {userInfo ? (
            <>
              <Link to="/profile" className="header-profile">
                👤 {userInfo.name}
              </Link>
              <button className="header-logout" onClick={logoutHandler}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="header-login">
              Connexion
            </Link>
          )}
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
