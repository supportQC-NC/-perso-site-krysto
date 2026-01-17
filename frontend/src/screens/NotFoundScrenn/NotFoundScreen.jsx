import React from "react";
import "./NotFoundScreen.css";

const NotFoundScreen = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <span className="notfound-icon">♻️</span>
        <h1>404</h1>
        <h2>Page introuvable</h2>
        <p>Oups ! Cette page semble avoir été recyclée...</p>
        <a href="/" className="notfound-btn">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFoundScreen;
