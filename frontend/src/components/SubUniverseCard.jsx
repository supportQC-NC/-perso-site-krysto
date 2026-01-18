import { Link } from "react-router-dom";
import "./SubUniverseCard.css";

const SubUniverseCard = ({ subUniverse, universeSlug }) => {
  return (
    <Link
      to={`/universes/${universeSlug}/${subUniverse.slug}`}
      className="subuniverse-card-link"
    >
      <div className="subuniverse-card">
        <div className="subuniverse-card__image">
          {subUniverse.image ? (
            <img src={subUniverse.image} alt={subUniverse.name} />
          ) : (
            <div className="subuniverse-card__placeholder">
              <span>📂</span>
            </div>
          )}
          <div className="subuniverse-card__overlay">
            <span className="subuniverse-card__count">
              {subUniverse.productCount || 0} produit
              {(subUniverse.productCount || 0) > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="subuniverse-card__content">
          <h3 className="subuniverse-card__title">{subUniverse.name}</h3>
          {subUniverse.description && (
            <p className="subuniverse-card__description">
              {subUniverse.description}
            </p>
          )}
          <span className="subuniverse-card__cta">Découvrir →</span>
        </div>
      </div>
    </Link>
  );
};

export default SubUniverseCard;
