import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../../slices/usersApiSlice";
import { logout } from "../../../slices/authSlice";
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiLayers,
  FiMail,
  FiMessageSquare,
  FiUserCheck,
  FiTruck,
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import "./AdminLayout.css";
import { FaHighlighter } from "react-icons/fa";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);

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

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}
      >
        <div className="admin-sidebar__header">
          <img
            src="/images/logo.svg"
            alt="Krysto"
            className="admin-sidebar__logo"
          />
          <span>Administration</span>
          <button className="admin-sidebar__close" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin/dashboard"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiGrid /> Dashboard
          </NavLink>

          {/* Catalogue */}
          <div className="admin-sidebar__group">
            <button
              className="admin-sidebar__group-btn"
              onClick={() => setCatalogOpen(!catalogOpen)}
            >
              <span>
                <FiPackage /> Catalogue
              </span>
              <FiChevronDown className={catalogOpen ? "rotated" : ""} />
            </button>
            {catalogOpen && (
              <div className="admin-sidebar__submenu">
                <NavLink
                  to="/admin/products"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Produits
                </NavLink>
                <NavLink
                  to="/admin/universes"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Univers
                </NavLink>
                <NavLink
                  to="/admin/subuniverses"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Sous-univers
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/orders"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiShoppingCart /> Commandes
          </NavLink>

          <NavLink
            to="/admin/users"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiUsers /> Utilisateurs
          </NavLink>

          {/* Espace Pro */}
          <div className="admin-sidebar__group">
            <button
              className="admin-sidebar__group-btn"
              onClick={() => setProOpen(!proOpen)}
            >
              <span>
                <FiUserCheck /> Espace Pro
              </span>
              <FiChevronDown className={proOpen ? "rotated" : ""} />
            </button>
            {proOpen && (
              <div className="admin-sidebar__submenu">
                <NavLink
                  to="/admin/pro-requests"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Demandes Pro
                </NavLink>
                <NavLink
                  to="/admin/pro-orders"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Commandes Pro
                </NavLink>
                <NavLink
                  to="/admin/reappro-requests"
                  className="admin-sidebar__sublink"
                  onClick={closeSidebar}
                >
                  Réappro
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/prospects"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiMail /> Prospects
          </NavLink>

          <NavLink
            to="/admin/contacts"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiMessageSquare /> Contacts
          </NavLink>

          <NavLink
            to="/admin/mailing"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiTruck /> Mailing
          </NavLink>
          <NavLink
            to="/admin/veilles"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FaHighlighter /> Veilles
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <NavLink
            to="/"
            className="admin-sidebar__link"
            onClick={closeSidebar}
          >
            <FiHome /> Retour au site
          </NavLink>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={closeSidebar}></div>
      )}

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <button
            className="admin-header__burger"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <div className="admin-header__user">
            <span>Bonjour, {userInfo?.name}</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
