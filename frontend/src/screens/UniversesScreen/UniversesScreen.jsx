import { useState, useEffect } from "react";
import Loader from "../../components/global/Loader";

import { useGetActiveUniversesQuery } from "../../slices/universeApiSlice";

import "./UniversesScreen.css";
import UniverseCard from "./UniverseCard";

const UniversesScreen = () => {
  const { data, isLoading, error } = useGetActiveUniversesQuery();
  const [showLoader, setShowLoader] = useState(true);

  // Extraire les univers de la réponse
  const universes = data?.universes || data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoader) return <Loader />;
  if (error)
    return (
      <div className="error-message">
        Erreur: {error?.data?.message || error.error}
      </div>
    );

  return (
    <div className="universes-container">
      <div className="universes-header">
        <h1 className="universes-title">Nos Univers</h1>
        <p className="universes-subtitle">
          Explorez nos différents univers et découvrez des produits uniques pour
          chaque passion
        </p>
      </div>

      {universes.length === 0 ? (
        <div className="universes-empty">
          <span className="universes-empty__icon">🌌</span>
          <p>Aucun univers disponible pour le moment</p>
        </div>
      ) : (
        <div className="universes-grid">
          {universes.map((universe) => (
            <UniverseCard key={universe._id} universe={universe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversesScreen;
