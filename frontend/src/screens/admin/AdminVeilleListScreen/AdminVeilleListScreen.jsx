import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEye,
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiFolder,
  FiHeart,
  FiArchive,
  FiClock,
  FiLink,
  FiImage,
  FiYoutube,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiBookmark,
  FiTag,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiStar,
  FiInbox,
} from "react-icons/fi";
import {
  useGetVeillesQuery,
  useGetVeilleStatsQuery,
  useDeleteVeilleMutation,
  useToggleVeilleFavoriteMutation,
  useArchiveVeilleMutation,
  useMarkVeilleAsReadMutation,
} from "../../../slices/veilleApiSlice";
import {
  useGetVeilleCategoriesQuery,
  useCreateVeilleCategoryMutation,
  useUpdateVeilleCategoryMutation,
  useDeleteVeilleCategoryMutation,
} from "../../../slices/veilleCategoryApiSlice";
import { toast } from "react-toastify";
import "./AdminListVeilleScreen.css";

// Couleurs prédéfinies pour les catégories
const CATEGORY_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
  "#84CC16", // lime
];

const AdminVeilleListScreen = () => {
  // State
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all"); // all | unread | favorites | archived
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [categoryModal, setCategoryModal] = useState({
    open: false,
    category: null,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, veille: null });

  // Queries
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetVeilleCategoriesQuery();
  const { data: statsData } = useGetVeilleStatsQuery();

  // Build filters for query
  const buildFilters = () => {
    const filters = { page, limit: 20 };

    if (selectedCategory) filters.category = selectedCategory;
    if (searchTerm) filters.search = searchTerm;
    if (contentTypeFilter) filters.contentType = contentTypeFilter;
    if (priorityFilter) filters.priority = priorityFilter;

    switch (quickFilter) {
      case "unread":
        filters.status = "unread";
        break;
      case "favorites":
        filters.isFavorite = "true";
        break;
      case "archived":
        filters.isArchived = "true";
        break;
      default:
        filters.isArchived = "false";
    }

    return filters;
  };

  const {
    data: veillesData,
    isLoading: isLoadingVeilles,
    refetch,
  } = useGetVeillesQuery(buildFilters());

  // Mutations
  const [deleteVeille, { isLoading: isDeleting }] = useDeleteVeilleMutation();
  const [toggleFavorite] = useToggleVeilleFavoriteMutation();
  const [archiveVeille] = useArchiveVeilleMutation();
  const [markAsRead] = useMarkVeilleAsReadMutation();
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateVeilleCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateVeilleCategoryMutation();
  const [deleteCategory] = useDeleteVeilleCategoryMutation();

  // Handlers
  const handleToggleFavorite = async (id) => {
    try {
      await toggleFavorite(id).unwrap();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveVeille(id).unwrap();
      toast.success("Veille archivée");
    } catch (err) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.veille) return;
    try {
      await deleteVeille(deleteModal.veille._id).unwrap();
      toast.success("Veille supprimée");
      setDeleteModal({ open: false, veille: null });
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleOpenUrl = (url) => {
    if (url) window.open(url, "_blank");
  };

  // Category handlers
  const handleSaveCategory = async (formData) => {
    try {
      if (categoryModal.category) {
        await updateCategory({
          id: categoryModal.category._id,
          ...formData,
        }).unwrap();
        toast.success("Catégorie mise à jour");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Catégorie créée");
      }
      setCategoryModal({ open: false, category: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Catégorie supprimée");
      if (selectedCategory === id) setSelectedCategory(null);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Get content type icon
  const getContentTypeIcon = (type) => {
    switch (type) {
      case "link":
        return <FiLink />;
      case "image":
        return <FiImage />;
      case "youtube":
        return <FiYoutube />;
      case "document":
        return <FiFileText />;
      default:
        return <FiLink />;
    }
  };

  // Get status badge
  const getStatusBadge = (veille) => {
    if (veille.isFavorite) {
      return (
        <span className="veille-card__status veille-card__status--favorite">
          <FiHeart /> Favori
        </span>
      );
    }
    if (veille.isArchived) {
      return (
        <span className="veille-card__status veille-card__status--archived">
          <FiArchive /> Archivé
        </span>
      );
    }
    if (veille.status === "unread") {
      return (
        <span className="veille-card__status veille-card__status--unread">
          <FiClock /> Non lu
        </span>
      );
    }
    return (
      <span className="veille-card__status veille-card__status--read">
        <FiCheck /> Lu
      </span>
    );
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get thumbnail URL
  const getThumbnail = (veille) => {
    return veille.uploadedImage || veille.imageUrl || veille.thumbnail;
  };

  const categories = categoriesData || [];
  const veilles = veillesData?.veilles || [];
  const stats = statsData || {};

  return (
    <div className="veille-list">
      {/* Header */}
      <div className="veille-list__header">
        <div className="veille-list__header-top">
          <div>
            <h1>
              <FiEye /> Veilles
            </h1>
            <p>Gérez vos liens, images et vidéos de veille</p>
          </div>
          <div className="veille-list__header-actions">
            <button className="btn btn--outline" onClick={() => refetch()}>
              <FiRefreshCw />
            </button>
            <Link to="/admin/veilles/create" className="btn btn--primary">
              <FiPlus />
              <span>Nouvelle veille</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="veille-list__stats">
        <div className="veille-stat-card">
          <div className="veille-stat-card__icon veille-stat-card__icon--total">
            <FiBookmark />
          </div>
          <div className="veille-stat-card__content">
            <h3>{stats.total || 0}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="veille-stat-card">
          <div className="veille-stat-card__icon veille-stat-card__icon--unread">
            <FiClock />
          </div>
          <div className="veille-stat-card__content">
            <h3>{stats.byStatus?.unread || 0}</h3>
            <p>Non lus</p>
          </div>
        </div>
        <div className="veille-stat-card">
          <div className="veille-stat-card__icon veille-stat-card__icon--favorites">
            <FiHeart />
          </div>
          <div className="veille-stat-card__content">
            <h3>{stats.favorites || 0}</h3>
            <p>Favoris</p>
          </div>
        </div>
        <div className="veille-stat-card">
          <div className="veille-stat-card__icon veille-stat-card__icon--recent">
            <FiStar />
          </div>
          <div className="veille-stat-card__content">
            <h3>{stats.recentlyAdded || 0}</h3>
            <p>Cette semaine</p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="veille-list__layout">
        {/* Sidebar */}
        <div className="veille-list__sidebar">
          {/* Categories */}
          <div className="veille-categories">
            <div className="veille-categories__header">
              <h3>
                <FiFolder /> Catégories
              </h3>
            </div>
            <div className="veille-categories__list">
              <button
                className={`veille-category-item ${!selectedCategory ? "veille-category-item--active" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                <span
                  className="veille-category-item__color"
                  style={{ background: "#6B7280" }}
                />
                <span className="veille-category-item__name">Toutes</span>
                <span className="veille-category-item__count">
                  {stats.total || 0}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`veille-category-item ${selectedCategory === cat._id ? "veille-category-item--active" : ""}`}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  <span
                    className="veille-category-item__color"
                    style={{ background: cat.color }}
                  />
                  <span className="veille-category-item__name">{cat.name}</span>
                  <span className="veille-category-item__count">
                    {cat.veilleCount || 0}
                  </span>
                </button>
              ))}
            </div>
            <button
              className="veille-categories__add"
              onClick={() => setCategoryModal({ open: true, category: null })}
            >
              <FiPlus /> Ajouter une catégorie
            </button>
          </div>

          {/* Quick Filters */}
          <div className="veille-quick-filters">
            <h3>Filtres rapides</h3>
            <div className="veille-quick-filters__list">
              <button
                className={`veille-quick-filter ${quickFilter === "all" ? "veille-quick-filter--active" : ""}`}
                onClick={() => setQuickFilter("all")}
              >
                <FiInbox /> Tous
              </button>
              <button
                className={`veille-quick-filter ${quickFilter === "unread" ? "veille-quick-filter--active" : ""}`}
                onClick={() => setQuickFilter("unread")}
              >
                <FiClock /> Non lus
              </button>
              <button
                className={`veille-quick-filter ${quickFilter === "favorites" ? "veille-quick-filter--active" : ""}`}
                onClick={() => setQuickFilter("favorites")}
              >
                <FiHeart /> Favoris
              </button>
              <button
                className={`veille-quick-filter ${quickFilter === "archived" ? "veille-quick-filter--active" : ""}`}
                onClick={() => setQuickFilter("archived")}
              >
                <FiArchive /> Archives
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="veille-list__main">
          {/* Toolbar */}
          <div className="veille-toolbar">
            <div className="veille-toolbar__search">
              <FiSearch />
              <input
                type="text"
                placeholder="Rechercher une veille..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="veille-toolbar__filters">
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="link">Liens</option>
                <option value="image">Images</option>
                <option value="youtube">YouTube</option>
                <option value="document">Documents</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">Toutes priorités</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
              <div className="veille-view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoadingVeilles ? (
            <div className="veille-list__loading">
              <FiRefreshCw className="spin" />
              <span>Chargement...</span>
            </div>
          ) : veilles.length === 0 ? (
            <div className="veille-empty">
              <div className="veille-empty__icon">
                <FiBookmark />
              </div>
              <h3>Aucune veille</h3>
              <p>Commencez par ajouter une nouvelle veille</p>
              <Link to="/admin/veilles/create" className="btn btn--primary">
                <FiPlus /> Ajouter une veille
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="veille-grid">
              {veilles.map((veille) => (
                <div
                  key={veille._id}
                  className={`veille-card ${veille.isFavorite ? "veille-card--favorite" : ""}`}
                >
                  <div className="veille-card__thumbnail">
                    {getThumbnail(veille) ? (
                      <img src={getThumbnail(veille)} alt={veille.title} />
                    ) : (
                      <div className="veille-card__thumbnail--empty">
                        {getContentTypeIcon(veille.contentType)}
                      </div>
                    )}
                    <span
                      className={`veille-card__type-badge veille-card__type-badge--${veille.contentType}`}
                    >
                      {getContentTypeIcon(veille.contentType)}{" "}
                      {veille.contentType}
                    </span>
                    <button
                      className={`veille-card__favorite ${veille.isFavorite ? "veille-card__favorite--active" : ""}`}
                      onClick={() => handleToggleFavorite(veille._id)}
                    >
                      <FiHeart />
                    </button>
                    {veille.contentType === "youtube" && (
                      <div
                        className="veille-card__play"
                        onClick={() => handleOpenUrl(veille.url)}
                      >
                        <FiYoutube />
                      </div>
                    )}
                  </div>
                  <div className="veille-card__body">
                    {veille.category && (
                      <div
                        className="veille-card__category"
                        style={{ color: veille.category.color }}
                      >
                        <span
                          className="veille-card__category-dot"
                          style={{ background: veille.category.color }}
                        />
                        {veille.category.name}
                      </div>
                    )}
                    <h3 className="veille-card__title">{veille.title}</h3>
                    {veille.description && (
                      <p className="veille-card__description">
                        {veille.description}
                      </p>
                    )}
                    <div className="veille-card__meta">
                      <span>
                        <FiClock /> {formatDate(veille.createdAt)}
                      </span>
                      {veille.source && <span>• {veille.source}</span>}
                    </div>
                    {veille.tags?.length > 0 && (
                      <div className="veille-card__tags">
                        {veille.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="veille-card__tag">
                            {tag}
                          </span>
                        ))}
                        {veille.tags.length > 3 && (
                          <span className="veille-card__tag">
                            +{veille.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="veille-card__footer">
                    {getStatusBadge(veille)}
                    <div className="veille-card__actions">
                      {veille.url && (
                        <button
                          className="veille-card__action veille-card__action--primary"
                          onClick={() => handleOpenUrl(veille.url)}
                          title="Ouvrir"
                        >
                          <FiExternalLink />
                        </button>
                      )}
                      <Link
                        to={`/admin/veilles/${veille._id}/edit`}
                        className="veille-card__action"
                        title="Modifier"
                      >
                        <FiEdit2 />
                      </Link>
                      {!veille.isArchived && (
                        <button
                          className="veille-card__action"
                          onClick={() => handleArchive(veille._id)}
                          title="Archiver"
                        >
                          <FiArchive />
                        </button>
                      )}
                      <button
                        className="veille-card__action veille-card__action--danger"
                        onClick={() => setDeleteModal({ open: true, veille })}
                        title="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="veille-list-view">
              {veilles.map((veille) => (
                <div key={veille._id} className="veille-list-item">
                  <div className="veille-list-item__thumbnail">
                    {getThumbnail(veille) ? (
                      <img src={getThumbnail(veille)} alt={veille.title} />
                    ) : (
                      <div
                        className="veille-card__thumbnail--empty"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getContentTypeIcon(veille.contentType)}
                      </div>
                    )}
                  </div>
                  <div className="veille-list-item__content">
                    <h3 className="veille-list-item__title">{veille.title}</h3>
                    <div className="veille-list-item__meta">
                      <span style={{ color: veille.category?.color }}>
                        {veille.category?.name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(veille.createdAt)}</span>
                      {veille.source && (
                        <>
                          <span>•</span>
                          <span>{veille.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(veille)}
                  <div className="veille-list-item__actions">
                    <button
                      className={`veille-card__action ${veille.isFavorite ? "veille-card__favorite--active" : ""}`}
                      onClick={() => handleToggleFavorite(veille._id)}
                    >
                      <FiHeart />
                    </button>
                    {veille.url && (
                      <button
                        className="veille-card__action"
                        onClick={() => handleOpenUrl(veille.url)}
                      >
                        <FiExternalLink />
                      </button>
                    )}
                    <Link
                      to={`/admin/veilles/${veille._id}/edit`}
                      className="veille-card__action"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      className="veille-card__action veille-card__action--danger"
                      onClick={() => setDeleteModal({ open: true, veille })}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {veillesData && veillesData.totalPages > 1 && (
            <div className="veille-pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <FiChevronLeft />
              </button>
              <span className="veille-pagination__info">
                Page {page} sur {veillesData.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(veillesData.totalPages, p + 1))
                }
                disabled={page === veillesData.totalPages}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {categoryModal.open && (
        <CategoryModal
          category={categoryModal.category}
          onClose={() => setCategoryModal({ open: false, category: null })}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
          isLoading={isCreatingCategory || isUpdatingCategory}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">Confirmer la suppression</h3>
              <button
                className="modal__close"
                onClick={() => setDeleteModal({ open: false, veille: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p>
                Êtes-vous sûr de vouloir supprimer la veille "
                <strong>{deleteModal.veille?.title}</strong>" ?
              </p>
              <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>
                Cette action est irréversible.
              </p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, veille: null })}
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

// Category Modal Component
const CategoryModal = ({ category, onClose, onSave, onDelete, isLoading }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || CATEGORY_COLORS[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="category-form">
              <div className="form-group">
                <label>
                  Nom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Tutoriels, Idées produits..."
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description optionnelle..."
                  style={{ minHeight: "80px" }}
                />
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <div className="category-form__color-picker">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`category-form__color ${formData.color === color ? "category-form__color--selected" : ""}`}
                      style={{ background: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal__actions">
            {category && (
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => onDelete(category._id)}
                style={{ marginRight: "auto" }}
              >
                <FiTrash2 /> Supprimer
              </button>
            )}
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isLoading}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVeilleListScreen;
