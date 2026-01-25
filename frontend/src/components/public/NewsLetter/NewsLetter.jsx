import { useState } from "react";
import { FiMail, FiSend, FiCheck, FiX, FiGift } from "react-icons/fi";
import { useSubscribeNewsletterMutation } from "../../../slices/prospectApiSlice";
import "./NewsLetter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isLoading) return;

    try {
      await subscribeNewsletter({ email, source: "landing_page" }).unwrap();
      setShowSuccess(true);
      setEmail("");
      setTimeout(() => setShowSuccess(false), 6000);
    } catch (err) {
      if (err?.data?.message?.includes("déjà inscrit")) {
        setErrorMessage(
          "Cette adresse email est déjà inscrite à notre newsletter !",
        );
      } else {
        setErrorMessage(
          err?.data?.message || "Une erreur est survenue. Veuillez réessayer.",
        );
      }
      setShowError(true);
    }
  };

  const closePopup = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <section className="newsletter">
      <div className="newsletter__bg">
        <div className="newsletter__container">
          <div className="newsletter__card">
            {/* Header */}
            <div className="newsletter__header">
              <span className="newsletter__emoji">📬</span>
              <h2 className="newsletter__title">
                Rejoignez <span>l'aventure Krysto</span>
              </h2>
              <p className="newsletter__subtitle">
                Recevez nos actualités, nouveaux produits et offres exclusives
                directement dans votre boîte mail.
              </p>
            </div>

            {/* Promo Badge */}
            <div className="newsletter__promo">
              <span className="newsletter__promo-icon">🎁</span>
              <span className="newsletter__promo-text">
                <strong>-10%</strong> sur votre première commande
              </span>
            </div>

            {/* Form */}
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <div className="newsletter__input-wrapper">
                <FiMail className="newsletter__input-icon" />
                <input
                  type="email"
                  placeholder="Entrez votre email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="newsletter__btn"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <span className="newsletter__btn-loading" />
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <FiSend />
                  </>
                )}
              </button>
            </form>

            {/* Benefits */}
            <div className="newsletter__benefits">
              <div className="newsletter__benefit">
                <FiCheck />
                <span>Offres exclusives</span>
              </div>
              <div className="newsletter__benefit">
                <FiCheck />
                <span>Nouveautés en avant-première</span>
              </div>
              <div className="newsletter__benefit">
                <FiCheck />
                <span>Zéro spam, promis !</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup with Fireworks */}
      {showSuccess && (
        <div className="newsletter-popup" onClick={closePopup}>
          {/* Fireworks */}
          <div className="newsletter-popup__fireworks">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="newsletter-popup__particle"
                style={{
                  "--x": `${Math.random() * 300 - 150}px`,
                  "--y": `${Math.random() * 300 - 150}px`,
                  "--delay": `${Math.random() * 0.6}s`,
                  "--color": [
                    "#10b981",
                    "#34d399",
                    "#fbbf24",
                    "#f472b6",
                    "#60a5fa",
                    "#a78bfa",
                  ][Math.floor(Math.random() * 6)],
                }}
              />
            ))}
          </div>

          <div
            className="newsletter-popup__content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsletter-popup__confetti" />

            <button className="newsletter-popup__close" onClick={closePopup}>
              <FiX />
            </button>

            <span className="newsletter-popup__icon newsletter-popup__icon--success">
              🎉
            </span>

            <h3 className="newsletter-popup__title">
              Bienvenue dans la famille !
            </h3>
            <p className="newsletter-popup__text">
              Merci pour votre inscription ! Vous recevrez bientôt un email avec
              votre code promo de <strong>-10%</strong> sur votre première
              commande.
            </p>

            <div className="newsletter-popup__gift">
              <FiGift />
              <span>Vérifiez votre boîte mail</span>
            </div>

            <button className="newsletter-popup__btn" onClick={closePopup}>
              Super, merci ! 🌊
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="newsletter-popup" onClick={closePopup}>
          <div
            className="newsletter-popup__content newsletter-popup__content--error"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="newsletter-popup__close" onClick={closePopup}>
              <FiX />
            </button>

            <span className="newsletter-popup__icon">😕</span>

            <h3 className="newsletter-popup__title">Oups !</h3>
            <p className="newsletter-popup__text">{errorMessage}</p>

            <button
              className="newsletter-popup__btn newsletter-popup__btn--error"
              onClick={closePopup}
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Newsletter;
