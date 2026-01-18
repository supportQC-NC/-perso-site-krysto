import { Link } from "react-router-dom";
import "./PartnersScreen.css";

const PartnersScreen = () => {
  return (
    <div className="partners-container">
      <section className="partners-hero">
        <div className="partners-hero-content">
          <h1>Nos Partenaires</h1>
          <p>
            Krysto est fier de collaborer avec des institutions engagées dans la
            transition écologique en Nouvelle-Calédonie.
          </p>
        </div>
      </section>

      <section className="partners-highlight">
        <div className="highlight-content">
          <span className="highlight-badge">🎉 Nouveauté 2025</span>
          <h2>Une subvention pour accélérer notre mission</h2>
          <p>
            En 2025, grâce au soutien de la <strong>Province Sud</strong> et de
            l'<strong>ADEME</strong> (Agence de la transition écologique),
            Krysto a obtenu une subvention permettant l'acquisition de nouvelles
            machines et moules pour la transformation du plastique recyclé.
          </p>
          <p>
            Cette aide précieuse nous permet d'augmenter notre capacité de
            production et de proposer davantage de produits éco-responsables
            fabriqués localement en Nouvelle-Calédonie.
          </p>
        </div>
      </section>

      <section className="partners-list">
        <h2>Ils nous font confiance</h2>

        <div className="partners-grid">
          <div className="partner-card">
            <div className="partner-logo">
              <img src="/images/province-sud-logo.png" alt="Province Sud" />
            </div>
            <div className="partner-info">
              <h3>Province Sud</h3>
              <p>
                La Province Sud de la Nouvelle-Calédonie soutient activement les
                initiatives locales en faveur de l'environnement et du
                développement durable. Son engagement permet à des projets comme
                Krysto de voir le jour et de se développer.
              </p>
              <div className="partner-contribution">
                <span className="contribution-icon">🏭</span>
                <span>Financement de machines et moules de production</span>
              </div>
              <a
                href="https://www.province-sud.nc/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                Visiter le site →
              </a>
            </div>
          </div>

          <div className="partner-card">
            <div className="partner-logo">
              <img src="/images/ademe-logo.png" alt="ADEME" />
            </div>
            <div className="partner-info">
              <h3>ADEME - Agence de la transition écologique</h3>
              <p>
                L'ADEME accompagne les territoires dans leur transition
                écologique. En Nouvelle-Calédonie, elle soutient les projets
                innovants qui contribuent à la réduction des déchets et à
                l'économie circulaire.
              </p>
              <div className="partner-contribution">
                <span className="contribution-icon">♻️</span>
                <span>
                  Accompagnement et financement de la transition écologique
                </span>
              </div>
              <a
                href="https://www.nouvelle-caledonie.gouv.fr/index.php/Services-de-l-Etat/Environnement-energies-agriculture-et-mines/ADEME-Agence-de-la-transition-ecologique"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                Visiter le site →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-impact">
        <h2>L'impact de leur soutien</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <span className="impact-icon">🏭</span>
            <h3>Nouvelles machines</h3>
            <p>
              Acquisition d'équipements de pointe pour transformer le plastique
              recyclé
            </p>
          </div>
          <div className="impact-card">
            <span className="impact-icon">🔧</span>
            <h3>Nouveaux moules</h3>
            <p>
              Création de moules pour diversifier notre gamme de produits
              éco-responsables
            </p>
          </div>
          <div className="impact-card">
            <span className="impact-icon">📈</span>
            <h3>Capacité accrue</h3>
            <p>
              Augmentation de notre capacité de production pour répondre à la
              demande
            </p>
          </div>
          <div className="impact-card">
            <span className="impact-icon">🌿</span>
            <h3>Impact local</h3>
            <p>
              Plus de plastique recyclé et transformé localement en
              Nouvelle-Calédonie
            </p>
          </div>
        </div>
      </section>

      <section className="partners-cta">
        <h2>Vous souhaitez devenir partenaire ?</h2>
        <p>
          Rejoignez notre mission pour un avenir plus durable en
          Nouvelle-Calédonie.
        </p>
        <Link to="/contact" className="partners-cta-btn">
          Contactez-nous
        </Link>
      </section>
    </div>
  );
};

export default PartnersScreen;
