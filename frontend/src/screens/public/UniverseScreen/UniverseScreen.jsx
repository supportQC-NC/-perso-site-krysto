import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiChevronRight,
  FiGrid,
  FiList,
  FiDroplet,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";
import {
  useGetUniverseBySlugQuery,
  useGetUniverseProductsQuery,
} from "../../../slices/universeApiSlice";
import { useGetSubUniversesByUniverseQuery } from "../../../slices/subuniverseApiSlice";
import "./UniverseScreen.css";

const UniverseScreen = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [activeSubUniverse, setActiveSubUniverse] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Récupérer l'univers par slug
  const {
    data: universe,
    isLoading: universeLoading,
    error: universeError,
  } = useGetUniverseBySlugQuery(slug);

  // Récupérer les sous-univers de cet univers
  const { data: subUniverses } = useGetSubUniversesByUniverseQuery(
    { universeId: universe?._id },
    { skip: !universe?._id },
  );

  // Récupérer les produits de l'univers
  const { data: productsData, isLoading: productsLoading } =
    useGetUniverseProductsQuery(
      {
        id: universe?._id,
        subUniverse: activeSubUniverse || undefined,
        sortBy,
        sortOrder,
      },
      { skip: !universe?._id },
    );

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  if (universeLoading) {
    return (
      <div className="universe-screen">
        <div className="universe-screen__hero universe-screen__hero--loading">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--text" />
        </div>
      </div>
    );
  }

  if (universeError || !universe) {
    return (
      <div className="universe-screen">
        <div className="universe-screen__error">
          <FiPackage />
          <h2>Univers non trouvé</h2>
          <p>L'univers que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/products" className="btn">
            Voir tous les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="universe-screen">
      {/* Hero Banner */}
      <div
        className="universe-screen__hero"
        style={{
          backgroundImage: universe.image
            ? `url(${universe.image})`
            : undefined,
        }}
      >
        <div className="universe-screen__hero-overlay" />
        <div className="universe-screen__hero-content">
          <nav className="universe-screen__breadcrumb">
            <Link to="/">Accueil</Link>
            <FiChevronRight />
            <Link to="/products">Produits</Link>
            <FiChevronRight />
            <span>{universe.name}</span>
          </nav>

          <h1 className="universe-screen__title">{universe.name}</h1>
          {universe.description && (
            <p className="universe-screen__description">
              {universe.description}
            </p>
          )}

          <div className="universe-screen__stats">
            <div className="universe-screen__stat">
              <span className="universe-screen__stat-value">
                {productsData?.products?.length || universe.productCount || 0}
              </span>
              <span className="universe-screen__stat-label">Produits</span>
            </div>
            {subUniverses?.length > 0 && (
              <div className="universe-screen__stat">
                <span className="universe-screen__stat-value">
                  {subUniverses.length}
                </span>
                <span className="universe-screen__stat-label">Catégories</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Universes Navigation */}
      {subUniverses?.length > 0 && (
        <div className="universe-screen__subnav">
          <div className="universe-screen__subnav-container">
            <button
              className={`universe-screen__subnav-item ${!activeSubUniverse ? "active" : ""}`}
              onClick={() => setActiveSubUniverse("")}
            >
              Tout voir
            </button>
            {subUniverses.map((sub) => (
              <button
                key={sub._id}
                className={`universe-screen__subnav-item ${activeSubUniverse === sub._id ? "active" : ""}`}
                onClick={() => setActiveSubUniverse(sub._id)}
              >
                {sub.name}
                {sub.productCount > 0 && (
                  <span className="count">{sub.productCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="universe-screen__container">
        {/* Toolbar */}
        <div className="universe-screen__toolbar">
          <span className="universe-screen__count">
            {productsData?.products?.length || 0} produit
            {(productsData?.products?.length || 0) > 1 ? "s" : ""}
          </span>

          <div className="universe-screen__toolbar-right">
            <select
              className="universe-screen__sort"
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="createdAt-desc">Plus récents</option>
              <option value="createdAt-asc">Plus anciens</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
            </select>

            <div className="universe-screen__view-toggle">
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

        {/* Products Grid */}
        {productsLoading ? (
          <div className="universe-screen__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card product-card--skeleton">
                <div className="product-card__image skeleton" />
                <div className="product-card__content">
                  <div className="skeleton skeleton--text" />
                  <div className="skeleton skeleton--text skeleton--short" />
                </div>
              </div>
            ))}
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="universe-screen__empty">
            <FiPackage />
            <h3>Aucun produit disponible</h3>
            <p>
              Cette collection sera bientôt enrichie de nouvelles créations.
            </p>
            <Link to="/products" className="btn">
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div
            className={`universe-screen__grid universe-screen__grid--${viewMode}`}
          >
            {productsData?.products?.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-card"
              >
                <div className="product-card__image">
                  <img
                    src={product.images?.[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    loading="lazy"
                  />
                  {product.isNew && (
                    <span className="product-card__badge product-card__badge--new">
                      Nouveau
                    </span>
                  )}
                  {product.isDestockage && (
                    <span className="product-card__badge product-card__badge--sale">
                      Promo
                    </span>
                  )}
                  <div className="product-card__overlay">
                    <span>Voir le produit</span>
                    <FiArrowRight />
                  </div>
                </div>
                <div className="product-card__content">
                  <span className="product-card__category">
                    {product.subUniverse?.name || universe.name}
                  </span>
                  <h3 className="product-card__name">{product.name}</h3>
                  {viewMode === "list" && product.description && (
                    <p className="product-card__description">
                      {product.description.substring(0, 150)}...
                    </p>
                  )}
                  <div className="product-card__footer">
                    <div className="product-card__price">
                      {product.isDestockage && product.destockagePrice ? (
                        <>
                          <span className="product-card__price--old">
                            {product.price?.toLocaleString()} XPF
                          </span>
                          <span className="product-card__price--new">
                            {product.destockagePrice?.toLocaleString()} XPF
                          </span>
                        </>
                      ) : (
                        <span>{product.price?.toLocaleString()} XPF</span>
                      )}
                    </div>
                    <span className="product-card__eco">
                      <FiDroplet />
                      {product.plasticWeight || 50}g
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="universe-screen__cta">
          <div className="universe-screen__cta-content">
            <h3>Vous ne trouvez pas ce que vous cherchez ?</h3>
            <p>
              Découvrez l'ensemble de notre catalogue ou contactez-nous pour une
              création sur-mesure.
            </p>
            <div className="universe-screen__cta-buttons">
              <Link to="/products" className="btn btn--primary">
                Voir tout le catalogue
              </Link>
              <Link to="/contact" className="btn btn--outline">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseScreen;
