import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiShield,
  FiStar,
  FiMail,
  FiClock,
  FiRefreshCw,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiCheck,
  FiPause,
  FiPlay,
  FiUserMinus,
  FiUser,
  FiBriefcase,
  FiMapPin,
} from "react-icons/fi";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSetUserAsProMutation,
  useUpdateUserProInfoMutation,
  useSuspendUserProMutation,
  useReactivateUserProMutation,
  useRemoveUserProMutation,
} from "../../../slices/usersApiSlice";
import { toast } from "react-toastify";
import "./AdminUserListScreen.css";

const AdminUserListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [proStatusFilter, setProStatusFilter] = useState(
    searchParams.get("proStatus") || "",
  );
  const [newsletterFilter, setNewsletterFilter] = useState(
    searchParams.get("newsletter") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 15;

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, user: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [activeTab, setActiveTab] = useState("general");

  // État du formulaire d'édition COMPLET
  const [editForm, setEditForm] = useState({
    // Infos générales
    name: "",
    email: "",
    isAdmin: false,
    newsletterSubscribed: false,
    // Statut Pro
    isPro: false,
    // Infos Pro
    companyName: "",
    legalStatus: "",
    ridetNumber: "",
    partnershipType: "",
    discountRate: 0,
    contactFirstName: "",
    contactLastName: "",
    contactPhone: "",
    contactEmail: "",
    // Adresse Pro
    street: "",
    city: "",
    postalCode: "",
    country: "Nouvelle-Calédonie",
    // Notes admin
    adminNotes: "",
  });

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (roleFilter === "admin") params.isAdmin = true;
    if (roleFilter === "pro") params.isPro = true;
    if (roleFilter === "user") {
      params.isAdmin = false;
      params.isPro = false;
    }
    if (proStatusFilter) params.proStatus = proStatusFilter;

    return params;
  };

  // Queries
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery(buildQueryParams());

  const { data: stats } = useGetUserStatsQuery();

  // Mutations
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [setUserAsPro, { isLoading: isSettingPro }] = useSetUserAsProMutation();
  const [updateUserProInfo, { isLoading: isUpdatingPro }] =
    useUpdateUserProInfoMutation();
  const [suspendUserPro, { isLoading: isSuspending }] =
    useSuspendUserProMutation();
  const [reactivateUserPro, { isLoading: isReactivating }] =
    useReactivateUserProMutation();
  const [removeUserPro, { isLoading: isRemoving }] = useRemoveUserProMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (roleFilter) params.set("role", roleFilter);
    if (proStatusFilter) params.set("proStatus", proStatusFilter);
    if (newsletterFilter) params.set("newsletter", newsletterFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [
    keyword,
    roleFilter,
    proStatusFilter,
    newsletterFilter,
    page,
    setSearchParams,
  ]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, roleFilter, proStatusFilter, newsletterFilter]);

  // Filtrer côté client pour la recherche et newsletter
  const getFilteredUsers = () => {
    if (!usersData?.users) return [];

    let filtered = usersData.users;

    // Filtre par keyword (côté client)
    if (keyword) {
      const search = keyword.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      );
    }

    // Filtre par newsletter (côté client)
    if (newsletterFilter === "subscribed") {
      filtered = filtered.filter((user) => user.newsletterSubscribed);
    } else if (newsletterFilter === "unsubscribed") {
      filtered = filtered.filter((user) => !user.newsletterSubscribed);
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setRoleFilter("");
    setProStatusFilter("");
    setNewsletterFilter("");
    setPage(1);
  };

  // Ouvrir modal détail
  const handleOpenView = (user) => {
    setViewModal({ open: true, user });
  };

  // Ouvrir modal édition avec TOUTES les données
  const handleOpenEdit = (user) => {
    setEditForm({
      // Infos générales
      name: user.name || "",
      email: user.email || "",
      isAdmin: user.isAdmin || false,
      newsletterSubscribed: user.newsletterSubscribed || false,
      // Statut Pro
      isPro: user.isPro || false,
      // Infos Pro
      companyName: user.proInfo?.companyName || "",
      legalStatus: user.proInfo?.legalStatus || "",
      ridetNumber: user.proInfo?.ridetNumber || "",
      partnershipType: user.proInfo?.partnershipType || "",
      discountRate: user.proInfo?.discountRate || 0,
      contactFirstName: user.proInfo?.contactFirstName || "",
      contactLastName: user.proInfo?.contactLastName || "",
      contactPhone: user.proInfo?.contactPhone || "",
      contactEmail: user.proInfo?.contactEmail || "",
      // Adresse Pro
      street: user.proInfo?.address?.street || "",
      city: user.proInfo?.address?.city || "",
      postalCode: user.proInfo?.address?.postalCode || "",
      country: user.proInfo?.address?.country || "Nouvelle-Calédonie",
      // Notes admin
      adminNotes: user.proInfo?.adminNotes || "",
    });
    setActiveTab("general");
    setEditModal({ open: true, user });
  };

  // Gérer les changements du formulaire
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    if (!editForm.email.trim()) {
      toast.error("L'email est requis");
      return;
    }

    try {
      const user = editModal.user;
      const wasProBefore = user.isPro;
      const isProNow = editForm.isPro;

      // 1. Mise à jour des infos générales
      await updateUser({
        id: user._id,
        name: editForm.name,
        email: editForm.email,
        isAdmin: editForm.isAdmin,
        newsletterSubscribed: editForm.newsletterSubscribed,
      }).unwrap();

      // 2. Gestion du statut Pro
      if (!wasProBefore && isProNow) {
        // Passer en Pro
        if (!editForm.companyName.trim()) {
          toast.error("Le nom de l'entreprise est requis pour passer en Pro");
          return;
        }
        if (!editForm.ridetNumber.trim()) {
          toast.error("Le numéro RIDET est requis pour passer en Pro");
          return;
        }
        if (!editForm.partnershipType) {
          toast.error("Le type de partenariat est requis pour passer en Pro");
          return;
        }

        await setUserAsPro({
          id: user._id,
          companyName: editForm.companyName,
          legalStatus: editForm.legalStatus,
          ridetNumber: editForm.ridetNumber,
          partnershipType: editForm.partnershipType,
          discountRate: Number(editForm.discountRate) || 0,
          contactFirstName: editForm.contactFirstName,
          contactLastName: editForm.contactLastName,
          contactPhone: editForm.contactPhone,
          contactEmail: editForm.contactEmail,
          address: {
            street: editForm.street,
            city: editForm.city,
            postalCode: editForm.postalCode,
            country: editForm.country,
          },
          adminNotes: editForm.adminNotes,
        }).unwrap();

        toast.success("Utilisateur mis à jour et passé en Pro !");
      } else if (wasProBefore && isProNow) {
        // Mettre à jour les infos Pro existantes
        await updateUserProInfo({
          id: user._id,
          companyName: editForm.companyName,
          legalStatus: editForm.legalStatus,
          ridetNumber: editForm.ridetNumber,
          partnershipType: editForm.partnershipType,
          discountRate: Number(editForm.discountRate) || 0,
          contactFirstName: editForm.contactFirstName,
          contactLastName: editForm.contactLastName,
          contactPhone: editForm.contactPhone,
          contactEmail: editForm.contactEmail,
          address: {
            street: editForm.street,
            city: editForm.city,
            postalCode: editForm.postalCode,
            country: editForm.country,
          },
          adminNotes: editForm.adminNotes,
        }).unwrap();

        toast.success("Utilisateur et infos Pro mis à jour !");
      } else if (wasProBefore && !isProNow) {
        // Retirer le statut Pro
        await removeUserPro(user._id).unwrap();
        toast.success("Utilisateur mis à jour, statut Pro retiré !");
      } else {
        toast.success("Utilisateur mis à jour !");
      }

      setEditModal({ open: false, user: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async () => {
    if (!deleteModal.user) return;

    try {
      await deleteUser(deleteModal.user._id).unwrap();
      toast.success("Utilisateur supprimé");
      setDeleteModal({ open: false, user: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Actions Pro rapides
  const handleSuspendPro = async (userId) => {
    try {
      await suspendUserPro(userId).unwrap();
      toast.success("Compte Pro suspendu");
      setViewModal({ open: false, user: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleReactivatePro = async (userId) => {
    try {
      await reactivateUserPro(userId).unwrap();
      toast.success("Compte Pro réactivé");
      setViewModal({ open: false, user: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleRemovePro = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer le statut Pro ?"))
      return;
    try {
      await removeUserPro(userId).unwrap();
      toast.success("Statut Pro retiré");
      setViewModal({ open: false, user: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Helpers
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleInfo = (user) => {
    if (user.isAdmin) return { label: "Admin", class: "admin" };
    if (user.isPro) return { label: "Pro", class: "pro" };
    return { label: "User", class: "user" };
  };

  const getProStatusInfo = (status) => {
    const statusMap = {
      approved: { label: "Actif", class: "approved" },
      pending: { label: "En attente", class: "pending" },
      suspended: { label: "Suspendu", class: "suspended" },
      none: { label: "-", class: "none" },
    };
    return statusMap[status] || statusMap.none;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Pagination
  const totalPages = usersData?.totalPages || 1;
  const totalUsers = usersData?.total || 0;

  const isSaving = isUpdating || isSettingPro || isUpdatingPro || isRemoving;

  return (
    <div className="user-list">
      {/* Header */}
      <div className="user-list__header">
        <div className="user-list__header-top">
          <div>
            <h1>Utilisateurs</h1>
            <p>Gérez les comptes utilisateurs</p>
          </div>
          <div className="user-list__header-actions">
            <button
              className="btn btn--secondary"
              onClick={refetch}
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="user-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiUsers />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.totalUsers || 0}</span>
            <span className="quick-stat__label">Total</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--admin">
            <FiShield />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.totalAdmins || 0}</span>
            <span className="quick-stat__label">Admins</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--pro">
            <FiStar />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.proApproved || 0}</span>
            <span className="quick-stat__label">Pro actifs</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.proPending || 0}</span>
            <span className="quick-stat__label">Pro en attente</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiMail />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.newsletterSubscribed || 0}
            </span>
            <span className="quick-stat__label">Newsletter</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="user-list__filters">
        <div className="user-list__search">
          <FiSearch className="user-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="user-list__filter-row">
          <div className="user-list__filter-group">
            <label>Rôle</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Admins</option>
              <option value="pro">Pro</option>
              <option value="user">Users</option>
            </select>
          </div>

          <div className="user-list__filter-group">
            <label>Statut Pro</label>
            <select
              value={proStatusFilter}
              onChange={(e) => setProStatusFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="approved">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          <div className="user-list__filter-group">
            <label>Newsletter</label>
            <select
              value={newsletterFilter}
              onChange={(e) => setNewsletterFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="subscribed">Abonnés</option>
              <option value="unsubscribed">Non abonnés</option>
            </select>
          </div>
        </div>

        <div className="user-list__filter-actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="user-list__table-container">
          <div className="user-list__loader">
            <FiRefreshCw />
            <span>Chargement des utilisateurs...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="user-list__table-container">
          <div className="user-list__empty">
            <FiAlertCircle className="user-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les utilisateurs.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="user-list__table-container">
          <div className="user-list__empty">
            <FiUsers className="user-list__empty-icon" />
            <h3>Aucun utilisateur trouvé</h3>
            <p>Aucun utilisateur ne correspond à vos critères.</p>
            {(keyword || roleFilter || proStatusFilter || newsletterFilter) && (
              <button
                className="btn btn--secondary"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Tableau desktop */}
          <div className="user-list__table-container">
            <table className="user-list__table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut Pro</th>
                  <th>Newsletter</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user);
                  const proStatus = getProStatusInfo(user.proStatus);

                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div
                            className={`user-cell__avatar user-cell__avatar--${roleInfo.class}`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div className="user-cell__info">
                            <span className="user-cell__name">{user.name}</span>
                            <span className="user-cell__email">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`role-badge role-badge--${roleInfo.class}`}
                        >
                          {roleInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="pro-status">
                          <span
                            className={`pro-status__badge pro-status__badge--${proStatus.class}`}
                          >
                            {proStatus.label}
                          </span>
                          {user.isPro && user.proInfo?.discountRate > 0 && (
                            <span className="pro-status__discount">
                              -{user.proInfo.discountRate}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`newsletter-badge ${
                            user.newsletterSubscribed
                              ? "newsletter-badge--subscribed"
                              : "newsletter-badge--unsubscribed"
                          }`}
                        >
                          {user.newsletterSubscribed ? <FiCheck /> : <FiX />}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleOpenView(user)}
                            title="Voir"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--edit"
                            onClick={() => handleOpenEdit(user)}
                            title="Modifier"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => setDeleteModal({ open: true, user })}
                            disabled={user.isAdmin}
                            title={
                              user.isAdmin
                                ? "Impossible de supprimer un admin"
                                : "Supprimer"
                            }
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="user-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({totalUsers} utilisateurs)
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft />
                  </button>

                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (page <= 3) {
                      pageNum = index + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = page - 2 + index;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`pagination__btn ${page === pageNum ? "pagination__btn--active" : ""}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cartes mobile */}
          <div className="user-list__mobile-cards">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user);
              const proStatus = getProStatusInfo(user.proStatus);

              return (
                <div key={user._id} className="user-mobile-card">
                  <div className="user-mobile-card__header">
                    <div
                      className={`user-mobile-card__avatar user-mobile-card__avatar--${roleInfo.class}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="user-mobile-card__info">
                      <div className="user-mobile-card__name">{user.name}</div>
                      <div className="user-mobile-card__email">
                        {user.email}
                      </div>
                    </div>
                    <span
                      className={`role-badge role-badge--${roleInfo.class}`}
                    >
                      {roleInfo.label}
                    </span>
                  </div>

                  <div className="user-mobile-card__body">
                    <div className="user-mobile-card__stat">
                      <span className="user-mobile-card__stat-label">
                        Statut Pro
                      </span>
                      <span className="user-mobile-card__stat-value">
                        <span
                          className={`pro-status__badge pro-status__badge--${proStatus.class}`}
                        >
                          {proStatus.label}
                        </span>
                      </span>
                    </div>
                    <div className="user-mobile-card__stat">
                      <span className="user-mobile-card__stat-label">
                        Newsletter
                      </span>
                      <span className="user-mobile-card__stat-value">
                        {user.newsletterSubscribed ? "Oui" : "Non"}
                      </span>
                    </div>
                    <div className="user-mobile-card__stat">
                      <span className="user-mobile-card__stat-label">
                        Inscription
                      </span>
                      <span className="user-mobile-card__stat-value">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    {user.isPro && user.proInfo?.discountRate > 0 && (
                      <div className="user-mobile-card__stat">
                        <span className="user-mobile-card__stat-label">
                          Remise
                        </span>
                        <span className="user-mobile-card__stat-value">
                          -{user.proInfo.discountRate}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="user-mobile-card__actions">
                    <button
                      className="action-btn action-btn--view"
                      onClick={() => handleOpenView(user)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteModal({ open: true, user })}
                      disabled={user.isAdmin}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="user-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages}
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft /> Précédent
                  </button>
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Suivant <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Détail */}
      {viewModal.open && viewModal.user && (
        <div
          className="modal-overlay"
          onClick={() => setViewModal({ open: false, user: null })}
        >
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Détail utilisateur</h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, user: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="user-detail">
                <div className="user-detail__header">
                  <div
                    className={`user-detail__avatar user-detail__avatar--${getRoleInfo(viewModal.user).class}`}
                  >
                    {getInitials(viewModal.user.name)}
                  </div>
                  <div className="user-detail__info">
                    <h3>{viewModal.user.name}</h3>
                    <p>{viewModal.user.email}</p>
                    <div className="user-detail__badges">
                      <span
                        className={`role-badge role-badge--${getRoleInfo(viewModal.user).class}`}
                      >
                        {getRoleInfo(viewModal.user).label}
                      </span>
                      {viewModal.user.isPro && (
                        <span
                          className={`pro-status__badge pro-status__badge--${getProStatusInfo(viewModal.user.proStatus).class}`}
                        >
                          Pro {getProStatusInfo(viewModal.user.proStatus).label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="user-detail__section">
                  <h4 className="user-detail__section-title">
                    Informations générales
                  </h4>
                  <div className="user-detail__grid">
                    <div className="user-detail__item">
                      <span className="user-detail__item-label">
                        Inscription
                      </span>
                      <span className="user-detail__item-value">
                        {formatDate(viewModal.user.createdAt)}
                      </span>
                    </div>
                    <div className="user-detail__item">
                      <span className="user-detail__item-label">
                        Newsletter
                      </span>
                      <span className="user-detail__item-value">
                        {viewModal.user.newsletterSubscribed
                          ? "Abonné"
                          : "Non abonné"}
                      </span>
                    </div>
                  </div>
                </div>

                {viewModal.user.isPro && viewModal.user.proInfo && (
                  <div className="user-detail__section">
                    <h4 className="user-detail__section-title">
                      Informations Pro
                    </h4>
                    <div className="user-detail__grid">
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">
                          Entreprise
                        </span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.companyName || "-"}
                        </span>
                      </div>
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">RIDET</span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.ridetNumber || "-"}
                        </span>
                      </div>
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">Type</span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.partnershipType ===
                          "revendeur"
                            ? "Revendeur"
                            : viewModal.user.proInfo.partnershipType ===
                                "depot_vente"
                              ? "Dépôt-vente"
                              : "-"}
                        </span>
                      </div>
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">Remise</span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.discountRate || 0}%
                        </span>
                      </div>
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">Contact</span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.contactPhone || "-"}
                        </span>
                      </div>
                      <div className="user-detail__item">
                        <span className="user-detail__item-label">
                          Approuvé le
                        </span>
                        <span className="user-detail__item-value">
                          {formatDate(viewModal.user.proInfo.approvedAt)}
                        </span>
                      </div>
                    </div>

                    {viewModal.user.proInfo.address?.street && (
                      <div
                        className="user-detail__item"
                        style={{ marginTop: "var(--space-sm)" }}
                      >
                        <span className="user-detail__item-label">Adresse</span>
                        <span className="user-detail__item-value">
                          {viewModal.user.proInfo.address.street},{" "}
                          {viewModal.user.proInfo.address.postalCode}{" "}
                          {viewModal.user.proInfo.address.city}
                        </span>
                      </div>
                    )}

                    {/* Actions Pro */}
                    <div className="user-detail__pro-actions">
                      {viewModal.user.proStatus === "approved" && (
                        <button
                          className="btn btn--warning btn--sm"
                          onClick={() => handleSuspendPro(viewModal.user._id)}
                          disabled={isSuspending}
                        >
                          <FiPause />
                          {isSuspending ? "..." : "Suspendre"}
                        </button>
                      )}
                      {viewModal.user.proStatus === "suspended" && (
                        <button
                          className="btn btn--success btn--sm"
                          onClick={() =>
                            handleReactivatePro(viewModal.user._id)
                          }
                          disabled={isReactivating}
                        >
                          <FiPlay />
                          {isReactivating ? "..." : "Réactiver"}
                        </button>
                      )}
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleRemovePro(viewModal.user._id)}
                        disabled={isRemoving}
                      >
                        <FiUserMinus />
                        {isRemoving ? "..." : "Retirer Pro"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setViewModal({ open: false, user: null })}
              >
                Fermer
              </button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setViewModal({ open: false, user: null });
                  handleOpenEdit(viewModal.user);
                }}
              >
                <FiEdit2 />
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition COMPLET avec onglets */}
      {editModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setEditModal({ open: false, user: null })}
        >
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Modifier l'utilisateur</h3>
              <button
                className="modal__close"
                onClick={() => setEditModal({ open: false, user: null })}
              >
                <FiX />
              </button>
            </div>

            {/* Onglets */}
            <div className="modal__tabs">
              <button
                className={`modal__tab ${activeTab === "general" ? "modal__tab--active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <FiUser />
                Général
              </button>
              <button
                className={`modal__tab ${activeTab === "pro" ? "modal__tab--active" : ""}`}
                onClick={() => setActiveTab("pro")}
              >
                <FiBriefcase />
                Infos Pro
              </button>
              <button
                className={`modal__tab ${activeTab === "address" ? "modal__tab--active" : ""}`}
                onClick={() => setActiveTab("address")}
              >
                <FiMapPin />
                Adresse
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal__body">
                {/* Onglet Général */}
                {activeTab === "general" && (
                  <div className="tab-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Nom <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <span className="toggle-row__label">
                        <FiShield style={{ marginRight: "8px" }} />
                        Administrateur
                      </span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="isAdmin"
                          checked={editForm.isAdmin}
                          onChange={handleEditChange}
                        />
                        <span className="toggle-switch__slider"></span>
                      </label>
                    </div>

                    <div className="toggle-row">
                      <span className="toggle-row__label">
                        <FiMail style={{ marginRight: "8px" }} />
                        Abonné newsletter
                      </span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newsletterSubscribed"
                          checked={editForm.newsletterSubscribed}
                          onChange={handleEditChange}
                        />
                        <span className="toggle-switch__slider"></span>
                      </label>
                    </div>

                    <div className="toggle-row toggle-row--highlight">
                      <span className="toggle-row__label">
                        <FiStar style={{ marginRight: "8px" }} />
                        <strong>Compte Professionnel</strong>
                      </span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="isPro"
                          checked={editForm.isPro}
                          onChange={handleEditChange}
                        />
                        <span className="toggle-switch__slider"></span>
                      </label>
                    </div>

                    {editForm.isPro && !editModal.user?.isPro && (
                      <div className="form-notice form-notice--info">
                        <FiAlertCircle />
                        <span>
                          Pour activer le compte Pro, remplissez les
                          informations dans l'onglet "Infos Pro" (entreprise,
                          RIDET, type de partenariat).
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Onglet Infos Pro */}
                {activeTab === "pro" && (
                  <div className="tab-content">
                    {!editForm.isPro ? (
                      <div className="form-notice form-notice--warning">
                        <FiAlertCircle />
                        <span>
                          Activez d'abord le compte Pro dans l'onglet "Général"
                          pour remplir ces informations.
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>
                              Nom de l'entreprise{" "}
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="companyName"
                              value={editForm.companyName}
                              onChange={handleEditChange}
                              placeholder="Ex: Ma Boutique SARL"
                            />
                          </div>
                          <div className="form-group">
                            <label>Raison sociale</label>
                            <input
                              type="text"
                              name="legalStatus"
                              value={editForm.legalStatus}
                              onChange={handleEditChange}
                              placeholder="Ex: SARL, SAS, EI..."
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>
                              Numéro RIDET <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="ridetNumber"
                              value={editForm.ridetNumber}
                              onChange={handleEditChange}
                              placeholder="Ex: 123456.001"
                            />
                          </div>
                          <div className="form-group">
                            <label>
                              Type de partenariat{" "}
                              <span className="required">*</span>
                            </label>
                            <select
                              name="partnershipType"
                              value={editForm.partnershipType}
                              onChange={handleEditChange}
                            >
                              <option value="">Sélectionner...</option>
                              <option value="revendeur">Revendeur</option>
                              <option value="depot_vente">Dépôt-vente</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Remise accordée (%)</label>
                          <input
                            type="number"
                            name="discountRate"
                            value={editForm.discountRate}
                            onChange={handleEditChange}
                            min="0"
                            max="100"
                            placeholder="Ex: 20"
                          />
                          <small className="form-help">
                            Pourcentage de remise sur le catalogue (0-100)
                          </small>
                        </div>

                        <hr className="form-divider" />
                        <h4 className="form-section-title">Contact Pro</h4>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Prénom du contact</label>
                            <input
                              type="text"
                              name="contactFirstName"
                              value={editForm.contactFirstName}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Nom du contact</label>
                            <input
                              type="text"
                              name="contactLastName"
                              value={editForm.contactLastName}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Téléphone</label>
                            <input
                              type="text"
                              name="contactPhone"
                              value={editForm.contactPhone}
                              onChange={handleEditChange}
                              placeholder="Ex: 77 12 34"
                            />
                          </div>
                          <div className="form-group">
                            <label>Email pro</label>
                            <input
                              type="email"
                              name="contactEmail"
                              value={editForm.contactEmail}
                              onChange={handleEditChange}
                              placeholder="Ex: contact@entreprise.nc"
                            />
                          </div>
                        </div>

                        <hr className="form-divider" />

                        <div className="form-group">
                          <label>Notes admin (internes)</label>
                          <textarea
                            name="adminNotes"
                            value={editForm.adminNotes}
                            onChange={handleEditChange}
                            rows="3"
                            placeholder="Notes visibles uniquement par les administrateurs..."
                          ></textarea>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Onglet Adresse */}
                {activeTab === "address" && (
                  <div className="tab-content">
                    {!editForm.isPro ? (
                      <div className="form-notice form-notice--warning">
                        <FiAlertCircle />
                        <span>
                          Activez d'abord le compte Pro dans l'onglet "Général"
                          pour remplir l'adresse professionnelle.
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Adresse (rue)</label>
                          <input
                            type="text"
                            name="street"
                            value={editForm.street}
                            onChange={handleEditChange}
                            placeholder="Ex: 12 rue de la Moselle"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Code postal</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={editForm.postalCode}
                              onChange={handleEditChange}
                              placeholder="Ex: 98800"
                            />
                          </div>
                          <div className="form-group">
                            <label>Ville</label>
                            <input
                              type="text"
                              name="city"
                              value={editForm.city}
                              onChange={handleEditChange}
                              placeholder="Ex: Nouméa"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Pays</label>
                          <input
                            type="text"
                            name="country"
                            value={editForm.country}
                            onChange={handleEditChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setEditModal({ open: false, user: null })}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, user: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer l'utilisateur</h3>
            </div>
            <div className="modal__body">
              <p>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>"{deleteModal.user?.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, user: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserListScreen;
