import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/global/Loader";
import SubUniverseCard from "../../components/SubUniverseCard";
import {
  useGetSubUniverseBySlugQuery,
  useGetSubUniverseProductsQuery,
} from "../../slices/subuniverseApiSlice";
import { useGetUniverseBySlugQuery } from "../../slices/universeApiSlice";

import "./SubUniversesProductsScreen.css";

const SubUniverseProductsScreen = () => {
  const { slug: universeSlug, subSlug } = useParams();
  const [showLoader, setShowLoader] = useState(true);

  // Récupérer l'univers parent par son slug
  const { data: universeData, isLoading: universeLoading } =
    useGetUniverseBySlugQuery(universeSlug);

  const universe = universeData?.universe || universeData;

  // Récupérer le sous-univers par son slug
  const {
    data: subUniverseData,
    isLoading: subUniverseLoading,
    error: subUniverseError,
  } = useGetSubUniverseBySlugQuery(subSlug);

  const subUniverse = subUniverseData?.subUniverse || subUniverseData;

  // Récupérer les produits du sous-univers
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetSubUniverseProductsQuery(
    { id: subUniverse?._id },
    { skip: !subUniverse?._id },
  );

  const products = productsData?.products || productsData || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const isLoading =
    universeLoading || subUniverseLoading || productsLoading || showLoader;
  const error = subUniverseError || productsError;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="subuniverse-products-container">
        <div className="error-message">
          Erreur:{" "}
          {error?.data?.message || error.error || "Sous-univers non trouvé"}
        </div>
        <Link to={`/universes/${universeSlug}`} className="back-link">
          ← Retour à l'univers
        </Link>
      </div>
    );
  }

  if (!subUniverse) {
    return (
      <div className="subuniverse-products-container">
        <div className="error-message">Sous-univers non trouvé</div>
        <Link to={`/universes/${universeSlug}`} className="back-link">
          ← Retour à l'univers
        </Link>
      </div>
    );
  }

  return (
    <div className="subuniverse-products-container">
      {/* Breadcrumb */}
      <nav className="subuniverse-breadcrumb">
        <Link to="/universes">Univers</Link>
        <span className="separator">›</span>
        <Link to={`/universes/${universeSlug}`}>{universe?.name || "..."}</Link>
        <span className="separator">›</span>
        <span className="current">{subUniverse.name}</span>
      </nav>

      {/* Hero Section */}
      <div
        className="subuniverse-hero"
        style={{
          backgroundImage: subUniverse.image
            ? `linear-gradient(rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.85)), url(${subUniverse.image})`
            : universe?.image
              ? `linear-gradient(rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.85)), url(${universe.image})`
              : undefined,
        }}
      >
        <Link
          to={`/universes/${universeSlug}`}
          className="subuniverse-hero__back"
        >
          ← {universe?.name || "Retour"}
        </Link>
        <div className="subuniverse-hero__content">
          <span className="subuniverse-hero__parent">🌍 {universe?.name}</span>
          <h1 className="subuniverse-hero__title">{subUniverse.name}</h1>
          {subUniverse.description && (
            <p className="subuniverse-hero__description">
              {subUniverse.description}
            </p>
          )}
          <span className="subuniverse-hero__count">
            {products.length} produit{products.length > 1 ? "s" : ""} disponible
            {products.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Products Section */}
      <div className="subuniverse-products-section">
        {products.length === 0 ? (
          <div className="subuniverse-products-empty">
            <span className="subuniverse-products-empty__icon">📦</span>
            <p>Aucun produit disponible dans cette catégorie pour le moment</p>
            <Link
              to={`/universes/${universeSlug}`}
              className="subuniverse-products-empty__link"
            >
              Voir les autres catégories
            </Link>
          </div>
        ) : (
          <>
            <div className="subuniverse-products-header">
              <h2 className="subuniverse-products-title">
                Nos produits {subUniverse.name}
              </h2>
              <span className="subuniverse-products-count">
                {products.length} article{products.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="subuniverse-products-grid">
              {products.map((product) => (
                <SubUniverseCard
                  key={product._id}
                  subUniverse={product}
                  universeSlug={universeSlug}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubUniverseProductsScreen;
