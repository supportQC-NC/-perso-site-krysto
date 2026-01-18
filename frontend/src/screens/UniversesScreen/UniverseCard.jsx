import { useNavigate } from "react-router-dom";
import "./UniverseCard.css";

const UniverseCard = ({ universe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/universe/${universe.slug || universe._id}`);
  };

  return (
    <div className="universe-card" onClick={handleClick}>
      <div className="universe-card__image-wrapper">
        {universe.image ? (
          <img
            src={universe.image}
            alt={universe.name}
            className="universe-card__image"
          />
        ) : (
          <div className="universe-card__placeholder">
            <span className="universe-card__placeholder-icon">🌌</span>
          </div>
        )}
        <div className="universe-card__overlay">
          <span className="universe-card__explore">Explorer →</span>
        </div>
      </div>
      <div className="universe-card__content">
        <h3 className="universe-card__title">{universe.name}</h3>
        {universe.description && (
          <p className="universe-card__description">{universe.description}</p>
        )}
        {universe.productCount !== undefined && (
          <span className="universe-card__count">
            {universe.productCount} produit
            {universe.productCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default UniverseCard;
