import { Link } from "react-router-dom";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="checkout-steps">
      <div className={`checkout-step ${step1 ? "active" : ""}`}>
        {step1 ? (
          <Link to="/login">
            <span className="step-number">1</span>
            <span className="step-label">Connexion</span>
          </Link>
        ) : (
          <>
            <span className="step-number">1</span>
            <span className="step-label">Connexion</span>
          </>
        )}
      </div>

      <div className={`checkout-step ${step2 ? "active" : ""}`}>
        {step2 ? (
          <Link to="/shipping">
            <span className="step-number">2</span>
            <span className="step-label">Livraison</span>
          </Link>
        ) : (
          <>
            <span className="step-number">2</span>
            <span className="step-label">Livraison</span>
          </>
        )}
      </div>

      <div className={`checkout-step ${step3 ? "active" : ""}`}>
        {step3 ? (
          <Link to="/payment">
            <span className="step-number">3</span>
            <span className="step-label">Paiement</span>
          </Link>
        ) : (
          <>
            <span className="step-number">3</span>
            <span className="step-label">Paiement</span>
          </>
        )}
      </div>

      <div className={`checkout-step ${step4 ? "active" : ""}`}>
        {step4 ? (
          <Link to="/placeorder">
            <span className="step-number">4</span>
            <span className="step-label">Commande</span>
          </Link>
        ) : (
          <>
            <span className="step-number">4</span>
            <span className="step-label">Commande</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
