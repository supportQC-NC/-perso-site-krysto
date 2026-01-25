import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../slices/usersApiSlice";
import { logout } from "../../../slices/authSlice";
import { resetCart } from "../../../slices/cartSlice";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiGrid,
  FiPackage,
} from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Handle scroll for header style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo" onClick={closeAll}>
          <img src="/images/logo.svg" alt="Krysto" />
        </Link>

        {/* Navigation */}
        <nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <Link to="/" className="header__link" onClick={closeAll}>
            Accueil
          </Link>
          <Link to="/products" className="header__link" onClick={closeAll}>
            Produits
          </Link>
          <Link to="/about" className="header__link" onClick={closeAll}>
            À propos
          </Link>
          <Link to="/contact" className="header__link" onClick={closeAll}>
            Nous contacter
          </Link>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Panier */}
          <Link to="/cart" className="header__cart" onClick={closeAll}>
            <FiShoppingCart />
            {cartCount > 0 && (
              <span className="header__cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* User */}
          {userInfo ? (
            <div className="header__user">
              <button
                className="header__user-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="header__avatar">
                  {userInfo.name.charAt(0)}
                </span>
                <FiChevronDown
                  className={`header__chevron ${isDropdownOpen ? "header__chevron--open" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="header__dropdown">
                  <div className="header__dropdown-header">
                    <span className="header__dropdown-name">
                      {userInfo.name}
                    </span>
                    <span className="header__dropdown-email">
                      {userInfo.email}
                    </span>
                    {userInfo.isAdmin && (
                      <span className="header__badge header__badge--admin">
                        Admin
                      </span>
                    )}
                    {userInfo.isPro && userInfo.proStatus === "approved" && (
                      <span className="header__badge header__badge--pro">
                        Pro
                      </span>
                    )}
                  </div>

                  <div className="header__dropdown-divider"></div>

                  <Link
                    to="/profile"
                    className="header__dropdown-link"
                    onClick={closeAll}
                  >
                    <FiUser /> Mon profil
                  </Link>
                  <Link
                    to="/my-orders"
                    className="header__dropdown-link"
                    onClick={closeAll}
                  >
                    <FiPackage /> Mes commandes
                  </Link>

                  {userInfo.isPro && userInfo.proStatus === "approved" && (
                    <>
                      <div className="header__dropdown-divider"></div>
                      <Link
                        to="/pro/dashboard"
                        className="header__dropdown-link header__dropdown-link--pro"
                        onClick={closeAll}
                      >
                        <FiGrid /> Espace Pro
                      </Link>
                    </>
                  )}

                  {userInfo.isAdmin && (
                    <>
                      <div className="header__dropdown-divider"></div>
                      <Link
                        to="/admin/dashboard"
                        className="header__dropdown-link header__dropdown-link--admin"
                        onClick={closeAll}
                      >
                        <FiGrid /> Administration
                      </Link>
                    </>
                  )}

                  <div className="header__dropdown-divider"></div>
                  <button
                    className="header__dropdown-link header__dropdown-link--logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header__login" onClick={closeAll}>
              <FiUser />
              <span>Connexion</span>
            </Link>
          )}

          {/* Burger */}
          <button
            className="header__burger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      {isMenuOpen && <div className="header__overlay" onClick={closeAll}></div>}
    </header>
  );
};

export default Header;
