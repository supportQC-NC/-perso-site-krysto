import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/global/Loader";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  useGetUniverseBySlugQuery,
  useGetUniverseProductsQuery,
} from "../../slices/universeApiSlice";

import "./UniverseProductsScreen.css";

const UniverseProductsScreen = () => {
  const { slug } = useParams();
  const [showLoader, setShowLoader] = useState(true);

  // Récupérer l'univers par son slug
  const {
    data: universeData,
    isLoading: universeLoading,
    error: universeError,
  } = useGetUniverseBySlugQuery(slug);

  const universe = universeData?.universe || universeData;

  // Récupérer les produits de l'univers une fois qu'on a l'ID
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetUniverseProductsQuery(
    { id: universe?._id },
    { skip: !universe?._id },
  );

  const products = productsData?.products || productsData || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const isLoading = universeLoading || productsLoading || showLoader;
  const error = universeError || productsError;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="universe-products-container">
        <div className="error-message">
          Erreur: {error?.data?.message || error.error || "Univers non trouvé"}
        </div>
        <Link to="/universes" className="back-link">
          ← Retour aux univers
        </Link>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="universe-products-container">
        <div className="error-message">Univers non trouvé</div>
        <Link to="/universes" className="back-link">
          ← Retour aux univers
        </Link>
      </div>
    );
  }

  return (
    <div className="universe-products-container">
      {/* Hero Section */}
      <div
        className="universe-hero"
        style={{
          backgroundImage: universe.image
            ? `linear-gradient(rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.85)), url(${universe.image})`
            : undefined,
        }}
      >
        <Link to="/universes" className="universe-hero__back">
          ← Tous les univers
        </Link>
        <div className="universe-hero__content">
          <h1 className="universe-hero__title">{universe.name}</h1>
          {universe.description && (
            <p className="universe-hero__description">{universe.description}</p>
          )}
          <span className="universe-hero__count">
            {products.length} produit{products.length > 1 ? "s" : ""} disponible
            {products.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Products Section */}
      <div className="universe-products-section">
        {products.length === 0 ? (
          <div className="universe-products-empty">
            <span className="universe-products-empty__icon">📦</span>
            <p>Aucun produit disponible dans cet univers pour le moment</p>
            <Link to="/universes" className="universe-products-empty__link">
              Explorer d'autres univers
            </Link>
          </div>
        ) : (
          <div className="universe-products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniverseProductsScreen;
