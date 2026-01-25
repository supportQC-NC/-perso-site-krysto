import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiPackage,
  FiDroplet,
  FiSearch,
  FiSliders,
  FiArrowRight,
} from "react-icons/fi";
import { useGetProductsQuery } from "../../../slices/productApiSlice";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import { useGetActiveSubUniversesQuery } from "../../../slices/subuniverseApiSlice";
import "./ProductScreen.css";

const ProductsScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États locaux
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    universe: true,
    subUniverse: true,
    price: true,
  });

  // Paramètres de recherche
  const [filters, setFilters] = useState({
    universe: searchParams.get("universe") || "",
    subUniverse: searchParams.get("subUniverse") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Queries
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    universe: filters.universe || undefined,
    subUniverse: filters.subUniverse || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    search: filters.search || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    limit: 12,
  });

  const { data: universesData } = useGetActiveUniversesQuery();
  const { data: subUniversesData } = useGetActiveSubUniversesQuery();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.universe) params.set("universe", filters.universe);
    if (filters.subUniverse) params.set("subUniverse", filters.subUniverse);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);
    if (filters.page > 1) params.set("page", filters.page.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      universe: "",
      subUniverse: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const hasActiveFilters =
    filters.universe ||
    filters.subUniverse ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search;

  // Filtrer les sous-univers selon l'univers sélectionné
  const filteredSubUniverses = filters.universe
    ? subUniversesData?.filter(
        (su) =>
          su.universe?._id === filters.universe ||
          su.universe === filters.universe,
      )
    : subUniversesData;

  // Trouver le nom de l'univers sélectionné
  const selectedUniverse = universesData?.find(
    (u) => u._id === filters.universe,
  );

  return (
    <div className="products-screen">
      {/* Hero Banner avec image de fond */}
      <section
        className={`products-screen__hero ${!selectedUniverse?.image ? "products-screen__hero--no-image" : ""}`}
      >
        {/* Background Image */}
        <div className="products-screen__hero-bg">
          <img
            src={selectedUniverse?.image || "/images/hero-products.jpg"}
            alt=""
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="products-screen__hero-content">
          {/* Bouton retour */}
          <Link to="/" className="products-screen__back-btn">
            <FiChevronLeft />
            <span>Retour à l'accueil</span>
          </Link>

          <h1 className="products-screen__title">
            {selectedUniverse ? selectedUniverse.name : "Nos Créations"}
          </h1>
          <p className="products-screen__subtitle">
            {selectedUniverse
              ? selectedUniverse.description
              : "Découvrez nos objets uniques fabriqués à partir de plastique océanique recyclé"}
          </p>
        </div>
      </section>

      <div className="products-screen__container">
        {/* Sidebar Filters - Desktop */}
        <aside className="products-screen__sidebar">
          <div className="products-screen__sidebar-card">
            <div className="products-screen__sidebar-header">
              <h3>
                <FiSliders />
                Filtres
              </h3>
              {hasActiveFilters && (
                <button
                  className="products-screen__clear-btn"
                  onClick={clearFilters}
                >
                  Tout effacer
                </button>
              )}
            </div>

            {/* Search */}
            <div className="products-screen__filter-group">
              <div className="products-screen__search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {/* Universe Filter */}
            <div className="products-screen__filter-group">
              <button
                className="products-screen__filter-header"
                onClick={() => toggleFilter("universe")}
              >
                <span>Collections</span>
                <FiChevronDown
                  className={expandedFilters.universe ? "rotated" : ""}
                />
              </button>
              {expandedFilters.universe && (
                <div className="products-screen__filter-options">
                  <label className="products-screen__checkbox">
                    <input
                      type="radio"
                      name="universe"
                      checked={!filters.universe}
                      onChange={() => handleFilterChange("universe", "")}
                    />
                    <span className="checkmark"></span>
                    <span>Toutes les collections</span>
                  </label>
                  {universesData?.map((universe) => (
                    <label
                      key={universe._id}
                      className="products-screen__checkbox"
                    >
                      <input
                        type="radio"
                        name="universe"
                        checked={filters.universe === universe._id}
                        onChange={() =>
                          handleFilterChange("universe", universe._id)
                        }
                      />
                      <span className="checkmark"></span>
                      <span>{universe.name}</span>
                      <span className="count">
                        {universe.productCount || 0}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* SubUniverse Filter */}
            {filteredSubUniverses?.length > 0 && (
              <div className="products-screen__filter-group">
                <button
                  className="products-screen__filter-header"
                  onClick={() => toggleFilter("subUniverse")}
                >
                  <span>Catégories</span>
                  <FiChevronDown
                    className={expandedFilters.subUniverse ? "rotated" : ""}
                  />
                </button>
                {expandedFilters.subUniverse && (
                  <div className="products-screen__filter-options">
                    <label className="products-screen__checkbox">
                      <input
                        type="radio"
                        name="subUniverse"
                        checked={!filters.subUniverse}
                        onChange={() => handleFilterChange("subUniverse", "")}
                      />
                      <span className="checkmark"></span>
                      <span>Toutes</span>
                    </label>
                    {filteredSubUniverses.map((subUniverse) => (
                      <label
                        key={subUniverse._id}
                        className="products-screen__checkbox"
                      >
                        <input
                          type="radio"
                          name="subUniverse"
                          checked={filters.subUniverse === subUniverse._id}
                          onChange={() =>
                            handleFilterChange("subUniverse", subUniverse._id)
                          }
                        />
                        <span className="checkmark"></span>
                        <span>{subUniverse.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Filter */}
            <div className="products-screen__filter-group">
              <button
                className="products-screen__filter-header"
                onClick={() => toggleFilter("price")}
              >
                <span>Prix (XPF)</span>
                <FiChevronDown
                  className={expandedFilters.price ? "rotated" : ""}
                />
              </button>
              {expandedFilters.price && (
                <div className="products-screen__price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-screen__main">
          {/* Toolbar */}
          <div className="products-screen__toolbar">
            <div className="products-screen__toolbar-left">
              <button
                className="products-screen__mobile-filter-btn"
                onClick={() => setShowMobileFilters(true)}
              >
                <FiFilter />
                Filtres
                {hasActiveFilters && <span className="badge" />}
              </button>
              <span className="products-screen__count">
                <strong>{productsData?.totalProducts || 0}</strong> produit
                {(productsData?.totalProducts || 0) > 1 ? "s" : ""}
              </span>
            </div>

            <div className="products-screen__toolbar-right">
              <select
                className="products-screen__sort"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={handleSortChange}
              >
                <option value="createdAt-desc">Plus récents</option>
                <option value="createdAt-asc">Plus anciens</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom A-Z</option>
              </select>

              <div className="products-screen__view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                  title="Vue grille"
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                  title="Vue liste"
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="products-screen__active-filters">
              {filters.search && (
                <span className="products-screen__filter-tag">
                  "{filters.search}"
                  <button onClick={() => handleFilterChange("search", "")}>
                    <FiX />
                  </button>
                </span>
              )}
              {filters.universe && (
                <span className="products-screen__filter-tag">
                  {universesData?.find((u) => u._id === filters.universe)?.name}
                  <button onClick={() => handleFilterChange("universe", "")}>
                    <FiX />
                  </button>
                </span>
              )}
              {filters.subUniverse && (
                <span className="products-screen__filter-tag">
                  {
                    subUniversesData?.find((s) => s._id === filters.subUniverse)
                      ?.name
                  }
                  <button onClick={() => handleFilterChange("subUniverse", "")}>
                    <FiX />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="products-screen__filter-tag">
                  {filters.minPrice || "0"} - {filters.maxPrice || "∞"} XPF
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "");
                      handleFilterChange("maxPrice", "");
                    }}
                  >
                    <FiX />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="products-screen__grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card product-card--skeleton">
                  <div className="product-card__image" />
                  <div className="product-card__content">
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--text skeleton--short" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="products-screen__error">
              <p>Une erreur est survenue lors du chargement des produits.</p>
              <button onClick={() => window.location.reload()}>
                Réessayer
              </button>
            </div>
          ) : productsData?.products?.length === 0 ? (
            <div className="products-screen__empty">
              <div className="products-screen__empty-icon">
                <FiPackage />
              </div>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters}>Effacer les filtres</button>
              )}
            </div>
          ) : (
            <div
              className={`products-screen__grid products-screen__grid--${viewMode}`}
            >
              {productsData?.products?.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="product-card"
                >
                  <div className="product-card__image">
                    <img
                      src={
                        product.images?.[0] ||
                        product.image ||
                        "/placeholder-product.jpg"
                      }
                      alt={product.name}
                      loading="lazy"
                    />
                    {/* Badges multiples */}
                    <div className="product-card__badges">
                      {product.isNewProduct && (
                        <span className="product-card__badge product-card__badge--new">
                          Nouveau
                        </span>
                      )}
                      {product.isDestockage && (
                        <span className="product-card__badge product-card__badge--sale">
                          Promo
                        </span>
                      )}
                      {product.isComingSoon && (
                        <span className="product-card__badge product-card__badge--coming">
                          Bientôt
                        </span>
                      )}
                      {product.countInStock === 0 && !product.isComingSoon && (
                        <span className="product-card__badge product-card__badge--out">
                          Épuisé
                        </span>
                      )}
                    </div>
                    <div className="product-card__overlay">
                      <span>Découvrir</span>
                      <FiArrowRight />
                    </div>
                  </div>
                  <div className="product-card__content">
                    <span className="product-card__category">
                      {product.subUniverse?.name ||
                        product.universe?.name ||
                        "Collection"}
                    </span>
                    <h3 className="product-card__name">{product.name}</h3>

                    {/* Rating & Reviews */}
                    {product.numReviews > 0 && (
                      <div className="product-card__rating">
                        <div className="product-card__stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`product-card__star ${
                                star <= Math.floor(product.rating)
                                  ? "product-card__star--filled"
                                  : star - 0.5 <= product.rating
                                    ? "product-card__star--half"
                                    : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="product-card__reviews">
                          (<span>{product.numReviews}</span>)
                        </span>
                      </div>
                    )}

                    {viewMode === "list" && product.description_fr && (
                      <p className="product-card__description">
                        {product.description_fr.substring(0, 120)}...
                      </p>
                    )}

                    <div className="product-card__footer">
                      <div className="product-card__price">
                        {product.isOnSale && product.salePrice ? (
                          <>
                            <span className="product-card__price-old">
                              {product.price?.toLocaleString()} XPF
                            </span>
                            <span className="product-card__price-current product-card__price-current--sale">
                              {product.salePrice?.toLocaleString()} XPF
                            </span>
                          </>
                        ) : (
                          <span className="product-card__price-current">
                            {product.price?.toLocaleString()} XPF
                          </span>
                        )}
                      </div>
                      <span className="product-card__eco">
                        <FiDroplet />
                        {product.weight || "50g"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {productsData?.totalPages > 1 && (
            <div className="products-screen__pagination">
              <button
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Précédent
              </button>
              <div className="products-screen__pagination-pages">
                {[...Array(Math.min(productsData.totalPages, 5))].map(
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={filters.page === pageNum ? "active" : ""}
                        onClick={() => handleFilterChange("page", pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
              </div>
              <button
                disabled={filters.page >= productsData.totalPages}
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Suivant
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="products-screen__mobile-filters">
          <div className="products-screen__mobile-filters-header">
            <h3>Filtres</h3>
            <button onClick={() => setShowMobileFilters(false)}>
              <FiX />
            </button>
          </div>
          <div className="products-screen__mobile-filters-content">
            {/* Search */}
            <div className="products-screen__filter-group">
              <div className="products-screen__search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {/* Universe */}
            <div className="products-screen__filter-group">
              <div className="products-screen__filter-header">
                <span>Collections</span>
              </div>
              <div className="products-screen__filter-options">
                <label className="products-screen__checkbox">
                  <input
                    type="radio"
                    name="universe-mobile"
                    checked={!filters.universe}
                    onChange={() => handleFilterChange("universe", "")}
                  />
                  <span className="checkmark"></span>
                  <span>Toutes</span>
                </label>
                {universesData?.map((universe) => (
                  <label
                    key={universe._id}
                    className="products-screen__checkbox"
                  >
                    <input
                      type="radio"
                      name="universe-mobile"
                      checked={filters.universe === universe._id}
                      onChange={() =>
                        handleFilterChange("universe", universe._id)
                      }
                    />
                    <span className="checkmark"></span>
                    <span>{universe.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="products-screen__filter-group">
              <div className="products-screen__filter-header">
                <span>Prix (XPF)</span>
              </div>
              <div className="products-screen__price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="products-screen__mobile-filters-footer">
            <button className="btn--outline" onClick={clearFilters}>
              Effacer
            </button>
            <button
              className="btn--primary"
              onClick={() => setShowMobileFilters(false)}
            >
              Voir {productsData?.totalProducts || 0} produits
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsScreen;
