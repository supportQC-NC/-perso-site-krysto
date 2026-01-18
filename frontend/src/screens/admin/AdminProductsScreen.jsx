import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useGetProductStatsQuery,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
  useToggleProductFeaturedMutation,
  useDuplicateProductMutation,
} from "../../slices/productApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminProductsScreen.css";

const AdminProductScreen = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
    productType: "",
    plasticType: "",
    search: "",
  });

  const { data, isLoading, error, refetch } = useGetProductsQuery(filters);
  const { data: stats } = useGetProductStatsQuery();

  // Gérer les différents formats de réponse API
  const products = data?.products || data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || data?.page || filters.page;

  // Debug - à supprimer en production
  console.log("API Response:", data);
  console.log("Products:", products);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateStatus] = useUpdateProductStatusMutation();
  const [toggleFeatured] = useToggleProductFeaturedMutation();
  const [duplicateProduct] = useDuplicateProductMutation();

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
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

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeatured(id).unwrap();
      toast.success("Produit mis à jour");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id).unwrap();
      toast.success("Produit dupliqué");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Produit supprimé");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "draft":
        return "status-draft";
      case "archived":
        return "status-archived";
      default:
        return "";
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      Maison: "🏠 Maison",
      "Salle de bain": "🚿 Salle de bain",
      Accessoires: "👜 Accessoires",
      Jeux: "🎮 Jeux",
      Bureau: "📎 Bureau",
      Bijoux: "💍 Bijoux",
      Coffrets: "🎁 Coffrets",
    };
    return labels[category] || category;
  };

  const formatPrice = (price) => {
    return `${price?.toLocaleString("fr-FR")} XPF`;
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📦 Gestion des produits</h1>
          <p>Gérez votre catalogue de produits recyclés</p>
        </div>
        <Link to="/admin/products/create" className="btn-add-product">
          ➕ Nouveau produit
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card highlight">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total || 0}</span>
              <span className="stat-label">Total produits</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.active || 0}</span>
              <span className="stat-label">Actifs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-value">{stats.featured || 0}</span>
              <span className="stat-label">Mis en avant</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <span className="stat-value">{stats.onSale || 0}</span>
              <span className="stat-label">En promo</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-value">{stats.lowStock || 0}</span>
              <span className="stat-label">Stock faible</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="filters-bar">
        <div className="search-group">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label>Statut</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Catégorie</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            <option value="Maison">Maison</option>
            <option value="Salle de bain">Salle de bain</option>
            <option value="Accessoires">Accessoires</option>
            <option value="Jeux">Jeux</option>
            <option value="Bureau">Bureau</option>
            <option value="Bijoux">Bijoux</option>
            <option value="Coffrets">Coffrets</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Type plastique</label>
          <select
            name="plasticType"
            value={filters.plasticType}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="HDPE">HDPE</option>
            <option value="PET">PET</option>
            <option value="PP">PP</option>
            <option value="LDPE">LDPE</option>
            <option value="PVC">PVC</option>
            <option value="PS">PS</option>
            <option value="HDPE/PP">HDPE/PP</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="dashboard-card">
        <div className="card-content">
          {products.length > 0 ? (
            <>
              <table className="admin-table products-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-cell">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumb"
                          />
                          <div className="product-info">
                            <strong>{product.name}</strong>
                            <span className="product-type">
                              {product.productType}
                            </span>
                            <div className="product-badges">
                              {product.isFeatured && (
                                <span className="badge badge-featured">⭐</span>
                              )}
                              {product.isOnSale && (
                                <span className="badge badge-sale">Promo</span>
                              )}
                              {product.isNewProduct && (
                                <span className="badge badge-new">New</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {getCategoryLabel(product.category)}
                        </span>
                        <span className="plastic-type">
                          {product.plasticType}
                        </span>
                      </td>
                      <td>
                        <div className="price-cell">
                          {product.isOnSale && product.salePrice ? (
                            <>
                              <span className="sale-price">
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="original-price">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`stock-badge ${
                            product.countInStock === 0
                              ? "out-of-stock"
                              : product.countInStock < 5
                                ? "low-stock"
                                : "in-stock"
                          }`}
                        >
                          {product.countInStock === 0
                            ? "Rupture"
                            : product.countInStock}
                        </span>
                      </td>
                      <td>
                        <select
                          value={product.status}
                          onChange={(e) =>
                            handleStatusChange(product._id, e.target.value)
                          }
                          className={`status-select ${getStatusClass(product.status)}`}
                        >
                          <option value="active">Actif</option>
                          <option value="draft">Brouillon</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="action-btn view"
                            title="Voir / Modifier"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(product._id)}
                            className={`action-btn featured ${product.isFeatured ? "active" : ""}`}
                            title={
                              product.isFeatured
                                ? "Retirer de la une"
                                : "Mettre en avant"
                            }
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => handleDuplicate(product._id)}
                            className="action-btn duplicate"
                            title="Dupliquer"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
              {totalPages > 1 && (
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
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    disabled={filters.page === totalPages}
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
            <div className="no-data">
              <p>Aucun produit trouvé</p>
              <Link to="/admin/products/create" className="btn-add-first">
                ➕ Créer votre premier produit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductScreen;
