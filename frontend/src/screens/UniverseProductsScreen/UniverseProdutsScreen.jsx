import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/global/Loader";
import SubUniverseCard from "../../components/SubUniverseCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  useGetUniverseBySlugQuery,
  useGetUniverseProductsQuery,
} from "../../slices/universeApiSlice";
import { useGetSubUniversesByUniverseQuery } from "../../slices/subuniverseApiSlice";

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

  // Récupérer les sous-univers de cet univers
  const { data: subUniversesData, isLoading: subUniversesLoading } =
    useGetSubUniversesByUniverseQuery(
      { universeId: universe?._id, isActive: true },
      { skip: !universe?._id },
    );

  const subUniverses = subUniversesData?.subUniverses || subUniversesData || [];

  // Récupérer les produits de l'univers (seulement ceux sans sous-univers)
  const { data: productsData, isLoading: productsLoading } =
    useGetUniverseProductsQuery(
      { id: universe?._id },
      { skip: !universe?._id },
    );

  // Filtrer pour ne garder que les produits sans sous-univers assigné
  const allProducts = productsData?.products || productsData || [];
  const productsWithoutSubUniverse = allProducts.filter(
    (product) => !product.subUniverse,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const isLoading =
    universeLoading || subUniversesLoading || productsLoading || showLoader;
  const error = universeError;

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

  const hasSubUniverses = subUniverses.length > 0;
  const hasProductsWithoutSubUniverse = productsWithoutSubUniverse.length > 0;

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
          <div className="universe-hero__stats">
            {hasSubUniverses && (
              <span className="universe-hero__count">
                {subUniverses.length} catégorie
                {subUniverses.length > 1 ? "s" : ""}
              </span>
            )}
            <span className="universe-hero__count">
              {allProducts.length} produit{allProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* SubUniverses Section */}
      {hasSubUniverses && (
        <div className="universe-subuniverses-section">
          <h2 className="section-title">
            <span className="section-title__icon">📂</span>
            Explorez nos catégories
          </h2>
          <div className="subuniverses-grid">
            {subUniverses.map((subUniverse) => (
              <SubUniverseCard
                key={subUniverse._id}
                subUniverse={subUniverse}
                universeSlug={slug}
              />
            ))}
          </div>
        </div>
      )}

      {/* Products Without SubUniverse Section */}
      {hasProductsWithoutSubUniverse && (
        <div className="universe-products-section">
          <h2 className="section-title">
            <span className="section-title__icon">🛍️</span>
            {hasSubUniverses ? "Autres produits" : "Nos produits"}
          </h2>
          <div className="universe-products-grid">
            {productsWithoutSubUniverse.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasSubUniverses && !hasProductsWithoutSubUniverse && (
        <div className="universe-products-section">
          <div className="universe-products-empty">
            <span className="universe-products-empty__icon">📦</span>
            <p>Aucun contenu disponible dans cet univers pour le moment</p>
            <Link to="/universes" className="universe-products-empty__link">
              Explorer d'autres univers
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniverseProductsScreen;
