import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetContactsQuery,
  useGetContactStatsQuery,
  useMarkContactAsReadMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "../../slices/contactApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminContactScreen.css";

const AdminContactsScreen = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    subject: "",
    isRead: "",
  });

  const { data, isLoading, error, refetch } = useGetContactsQuery(filters);
  const { data: stats } = useGetContactStatsQuery();
  const [markAsRead] = useMarkContactAsReadMutation();
  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactMutation();

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Message marqué comme lu");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Statut mis à jour");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Message supprimé");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "nouveau":
        return "status-new";
      case "lu":
        return "status-read";
      case "en_cours":
        return "status-processing";
      case "traite":
        return "status-done";
      case "archive":
        return "status-archived";
      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      nouveau: "Nouveau",
      lu: "Lu",
      en_cours: "En cours",
      traite: "Traité",
      archive: "Archivé",
    };
    return labels[status] || status;
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      information: "Demande d'info",
      commande: "Commande",
      partenariat: "Partenariat",
      presse: "Presse",
      autre: "Autre",
    };
    return labels[subject] || subject;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-contacts">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📬 Messages de contact</h1>
          <p>Gérez les messages reçus via le formulaire de contact</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">📩</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total || 0}</span>
              <span className="stat-label">Total messages</span>
            </div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon unread">🔔</div>
            <div className="stat-info">
              <span className="stat-value">{stats.unread || 0}</span>
              <span className="stat-label">Non lus</span>
            </div>
          </div>
          {stats.byStatus?.map((s) => (
            <div className="stat-card" key={s._id}>
              <div className={`stat-icon ${s._id}`}>
                {s._id === "nouveau" && "🆕"}
                {s._id === "lu" && "👁️"}
                {s._id === "en_cours" && "⏳"}
                {s._id === "traite" && "✅"}
                {s._id === "archive" && "📁"}
              </div>
              <div className="stat-info">
                <span className="stat-value">{s.count}</span>
                <span className="stat-label">{getStatusLabel(s._id)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Statut</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="nouveau">Nouveau</option>
            <option value="lu">Lu</option>
            <option value="en_cours">En cours</option>
            <option value="traite">Traité</option>
            <option value="archive">Archivé</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sujet</label>
          <select
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="information">Demande d'info</option>
            <option value="commande">Commande</option>
            <option value="partenariat">Partenariat</option>
            <option value="presse">Presse</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Lecture</label>
          <select
            name="isRead"
            value={filters.isRead}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="false">Non lus</option>
            <option value="true">Lus</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="dashboard-card">
        <div className="card-content">
          {data?.contacts?.length > 0 ? (
            <>
              <table className="admin-table contacts-table">
                <thead>
                  <tr>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className={!contact.isRead ? "unread" : ""}
                    >
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(contact.status)}`}
                        >
                          {getStatusLabel(contact.status)}
                        </span>
                      </td>
                      <td>{formatDate(contact.createdAt)}</td>
                      <td>
                        <strong>{contact.name}</strong>
                        {contact.phone && (
                          <span className="phone-info">📱 {contact.phone}</span>
                        )}
                      </td>
                      <td>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </td>
                      <td>
                        <span className="subject-badge">
                          {getSubjectLabel(contact.subject)}
                        </span>
                      </td>
                      <td>
                        <p className="message-preview">
                          {contact.message.length > 80
                            ? `${contact.message.substring(0, 80)}...`
                            : contact.message}
                        </p>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/contacts/${contact._id}`}
                            className="action-btn view"
                            title="Voir"
                          >
                            👁️
                          </Link>
                          {!contact.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(contact._id)}
                              className="action-btn read"
                              title="Marquer comme lu"
                            >
                              ✓
                            </button>
                          )}
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleStatusChange(contact._id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="lu">Lu</option>
                            <option value="en_cours">En cours</option>
                            <option value="traite">Traité</option>
                            <option value="archive">Archivé</option>
                          </select>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="action-btn delete"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                  >
                    ← Précédent
                  </button>
                  <span>
                    Page {data.currentPage} sur {data.totalPages}
                  </span>
                  <button
                    disabled={filters.page === data.totalPages}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-data">Aucun message trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactsScreen;
