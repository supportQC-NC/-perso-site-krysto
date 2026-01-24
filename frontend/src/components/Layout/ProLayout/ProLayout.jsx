import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../../slices/usersApiSlice";
import { logout } from "../../../slices/authSlice";
import {
  FiGrid,
  FiShoppingCart,
  FiPackage,
  FiRefreshCw,
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiUser,
  FiPercent,
} from "react-icons/fi";
import "./ProLayout.css";

const ProLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Taux de remise Pro
  const discountRate = userInfo?.proInfo?.discountRate || 0;

  return (
    <div className="pro-layout">
      {/* Sidebar */}
      <aside
        className={`pro-sidebar ${sidebarOpen ? "pro-sidebar--open" : ""}`}
      >
        <div className="pro-sidebar__header">
          <img
            src="/images/logo.svg"
            alt="Krysto"
            className="pro-sidebar__logo"
          />
          <span>Espace Pro</span>
          <button className="pro-sidebar__close" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        {/* Info Pro */}
        <div className="pro-sidebar__info">
          <div className="pro-sidebar__company">
            {userInfo?.proInfo?.companyName || userInfo?.name}
          </div>
          <div className="pro-sidebar__discount">
            <FiPercent />
            <span>Remise : {discountRate}%</span>
          </div>
        </div>

        <nav className="pro-sidebar__nav">
          <NavLink
            to="/pro/dashboard"
            className="pro-sidebar__link"
            onClick={closeSidebar}
          >
            <FiGrid /> Tableau de bord
          </NavLink>

          <NavLink
            to="/pro/catalog"
            className="pro-sidebar__link"
            onClick={closeSidebar}
          >
            <FiPackage /> Catalogue Pro
          </NavLink>

          <NavLink
            to="/pro/orders"
            className="pro-sidebar__link"
            onClick={closeSidebar}
          >
            <FiShoppingCart /> Mes commandes
          </NavLink>

          <NavLink
            to="/pro/reappro"
            className="pro-sidebar__link"
            onClick={closeSidebar}
          >
            <FiRefreshCw /> Réapprovisionnement
          </NavLink>

          <NavLink
            to="/pro/profile"
            className="pro-sidebar__link"
            onClick={closeSidebar}
          >
            <FiUser /> Mon compte Pro
          </NavLink>
        </nav>

        <div className="pro-sidebar__footer">
          <NavLink to="/" className="pro-sidebar__link" onClick={closeSidebar}>
            <FiHome /> Retour au site
          </NavLink>
          <button className="pro-sidebar__logout" onClick={handleLogout}>
            <FiLogOut /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="pro-overlay" onClick={closeSidebar}></div>
      )}

      {/* Main content */}
      <main className="pro-main">
        <header className="pro-header">
          <button
            className="pro-header__burger"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <div className="pro-header__user">
            <span>Bonjour, {userInfo?.name}</span>
            <span className="pro-header__badge">PRO</span>
          </div>
        </header>

        <div className="pro-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProLayout;
