import { NavLink } from "react-router-dom";
import { useGetContactStatsQuery } from "../../../slices/contactApiSlice";
import { useGetProspectStatsQuery } from "../../../slices/prospectApiSlice";
import { useGetMailingStatsQuery } from "../../../slices/mailingApiSlice";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { data: contactStats } = useGetContactStatsQuery();
  const { data: prospectStats } = useGetProspectStatsQuery();
  const { data: mailingStats } = useGetMailingStatsQuery();

  const menuItems = [
    {
      path: "/admin",
      icon: "📊",
      label: "Tableau de bord",
      end: true,
    },
    {
      path: "/admin/orders",
      icon: "📋",
      label: "Commandes",
    },
    {
      path: "/admin/products",
      icon: "📦",
      label: "Produits",
    },
    {
      path: "/admin/universes",
      icon: "🌍",
      label: "Univers",
    },
    {
      path: "/admin/subuniverses",
      icon: "📂",
      label: "Sous-Univers",
    },
    {
      path: "/admin/users",
      icon: "👥",
      label: "Utilisateurs",
    },
    {
      path: "/admin/prospects",
      icon: "📧",
      label: "Newsletter",
      badge: prospectStats?.active || 0,
    },
    {
      path: "/admin/mailing",
      icon: "✉️",
      label: "Campagnes",
      badge: mailingStats?.draftCampaigns || 0,
    },
    {
      path: "/admin/contacts",
      icon: "📬",
      label: "Messages",
      badge: contactStats?.unread || 0,
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <NavLink to="/admin" className="sidebar-logo">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">Krysto Admin</span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="link-icon">{item.icon}</span>
                <span className="link-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="link-badge">{item.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link back-to-site">
          <span className="link-icon">🏠</span>
          <span className="link-label">Retour au site</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
