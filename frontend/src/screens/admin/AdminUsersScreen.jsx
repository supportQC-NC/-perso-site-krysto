import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminUsersScreen.css";

const AdminUsersScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Utilisateur supprimé");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", isAdmin: false });
  };

  const handleUpdateUser = async (userId) => {
    try {
      await updateUser({ userId, ...editForm }).unwrap();
      toast.success("Utilisateur mis à jour");
      setEditingUser(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleToggleAdmin = async (user) => {
    if (
      window.confirm(
        `Voulez-vous ${user.isAdmin ? "retirer" : "donner"} les droits admin à ${user.name} ?`,
      )
    ) {
      try {
        await updateUser({
          userId: user._id,
          name: user.name,
          email: user.email,
          isAdmin: !user.isAdmin,
        }).unwrap();
        toast.success(`Droits admin ${user.isAdmin ? "retirés" : "accordés"}`);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  const adminCount = users?.filter((u) => u.isAdmin).length || 0;
  const subscribedCount =
    users?.filter((u) => u.newsletterSubscribed).length || 0;

  return (
    <div className="admin-users">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>👥 Gestion des utilisateurs</h1>
          <p>Gérez les comptes utilisateurs de la plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <span className="stat-value">{users?.length || 0}</span>
            <span className="stat-label">Total utilisateurs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon admin">👑</div>
          <div className="stat-info">
            <span className="stat-value">{adminCount}</span>
            <span className="stat-label">Administrateurs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon newsletter">📧</div>
          <div className="stat-info">
            <span className="stat-value">{subscribedCount}</span>
            <span className="stat-label">Abonnés newsletter</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Liste des utilisateurs</h2>
          <span className="user-count">
            {users?.length || 0} utilisateur(s)
          </span>
        </div>
        <div className="card-content">
          {users?.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table users-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Newsletter</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        {editingUser === user._id ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="edit-input"
                          />
                        ) : (
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{user.name}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {editingUser === user._id ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="edit-input"
                          />
                        ) : (
                          <a
                            href={`mailto:${user.email}`}
                            className="user-email"
                          >
                            {user.email}
                          </a>
                        )}
                      </td>
                      <td>
                        {editingUser === user._id ? (
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={editForm.isAdmin}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  isAdmin: e.target.checked,
                                })
                              }
                            />
                            Admin
                          </label>
                        ) : (
                          <span
                            className={`role-badge ${user.isAdmin ? "admin" : "user"}`}
                          >
                            {user.isAdmin ? "👑 Admin" : "👤 Utilisateur"}
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`newsletter-badge ${user.newsletterSubscribed ? "subscribed" : "not-subscribed"}`}
                        >
                          {user.newsletterSubscribed
                            ? "✅ Abonné"
                            : "❌ Non abonné"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          {editingUser === user._id ? (
                            <>
                              <button
                                onClick={() => handleUpdateUser(user._id)}
                                className="action-btn save"
                                title="Enregistrer"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="action-btn cancel"
                                title="Annuler"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(user)}
                                className="action-btn edit"
                                title="Modifier"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleToggleAdmin(user)}
                                className="action-btn toggle-admin"
                                title={
                                  user.isAdmin
                                    ? "Retirer admin"
                                    : "Rendre admin"
                                }
                              >
                                {user.isAdmin ? "👤" : "👑"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(user._id, user.name)
                                }
                                className="action-btn delete"
                                title="Supprimer"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">Aucun utilisateur trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersScreen;
