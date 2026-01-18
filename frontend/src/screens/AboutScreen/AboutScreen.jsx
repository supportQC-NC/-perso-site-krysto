import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AboutScreen.css";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".animate-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const timeline = [
    {
      year: "2020",
      title: "L'idée germe",
      description:
        "Face à la pollution plastique sur nos plages calédoniennes, l'idée de transformer ce déchet en ressource naît.",
      icon: "💡",
    },
    {
      year: "2021",
      title: "Les premiers tests",
      description:
        "Acquisition des premières machines, expérimentations avec différents types de plastiques locaux.",
      icon: "⚙️",
    },
    {
      year: "2022",
      title: "Lancement officiel",
      description:
        "Création de Krysto, premiers produits commercialisés, participation aux marchés locaux.",
      icon: "🚀",
    },
    {
      year: "2023",
      title: "Expansion",
      description:
        "Ouverture de l'atelier, partenariats avec les collecteurs locaux, développement de la gamme.",
      icon: "📈",
    },
    {
      year: "2024",
      title: "Reconnaissance",
      description:
        "Prix de l'innovation environnementale, collaborations avec les écoles et entreprises.",
      icon: "🏆",
    },
    {
      year: "2025",
      title: "Et demain...",
      description:
        "Objectif : recycler 10 tonnes de plastique par an et inspirer d'autres initiatives.",
      icon: "🌟",
    },
  ];

  const team = [
    {
      name: "Jean Dupont",
      role: "Fondateur & Artisan",
      bio: "Passionné par l'environnement et l'artisanat, Jean a quitté son poste d'ingénieur pour donner vie à Krysto.",
      image: null,
    },
    {
      name: "Marie Martin",
      role: "Responsable Production",
      bio: "Experte en design produit, Marie supervise la création et garantit la qualité de chaque pièce.",
      image: null,
    },
    {
      name: "Pierre Lefebvre",
      role: "Collecte & Partenariats",
      bio: "Pierre coordonne la collecte du plastique et développe nos partenariats avec les acteurs locaux.",
      image: null,
    },
  ];

  const values = [
    {
      icon: "🌊",
      title: "Préserver notre lagon",
      description:
        "Chaque gramme de plastique recyclé est un gramme de moins dans notre écosystème marin unique.",
    },
    {
      icon: "🤲",
      title: "Artisanat authentique",
      description:
        "Chaque pièce est fabriquée à la main avec passion, rendant chaque produit véritablement unique.",
    },
    {
      icon: "🔄",
      title: "Économie circulaire",
      description:
        "Nous transformons les déchets en ressources, créant de la valeur là où il n'y en avait plus.",
    },
    {
      icon: "🇳🇨",
      title: "100% Local",
      description:
        "De la collecte à la vente, tout est réalisé en Nouvelle-Calédonie, pour la Nouvelle-Calédonie.",
    },
    {
      icon: "💚",
      title: "Transparence",
      description:
        "Nous partageons ouvertement nos processus, nos chiffres et notre impact environnemental.",
    },
    {
      icon: "🎓",
      title: "Éducation",
      description:
        "Nous sensibilisons les jeunes générations à travers des ateliers et interventions scolaires.",
    },
  ];

  const impacts = [
    {
      number: "5.2",
      unit: "tonnes",
      label: "de plastique recyclé depuis 2022",
    },
    { number: "2,400+", unit: "", label: "produits créés et vendus" },
    { number: "15", unit: "", label: "partenaires collecteurs" },
    { number: "32", unit: "", label: "interventions scolaires" },
    { number: "0", unit: "", label: "déchet produit par notre activité" },
    { number: "100%", unit: "", label: "énergie renouvelable utilisée" },
  ];

  const plasticTypes = [
    {
      code: "HDPE",
      name: "Polyéthylène haute densité",
      examples: "Bouteilles de lait, flacons",
      color: "#4CAF50",
    },
    {
      code: "PET",
      name: "Polyéthylène téréphtalate",
      examples: "Bouteilles d'eau, emballages",
      color: "#2196F3",
    },
    {
      code: "PP",
      name: "Polypropylène",
      examples: "Bouchons, contenants alimentaires",
      color: "#FF9800",
    },
    {
      code: "LDPE",
      name: "Polyéthylène basse densité",
      examples: "Sacs plastiques, films",
      color: "#9C27B0",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="about-hero-content">
            <span className="hero-badge">Notre histoire</span>
            <h1>
              Transformer les <span className="highlight">déchets</span> en{" "}
              <span className="highlight">trésors</span>
            </h1>
            <p>
              Krysto est né d'une conviction : le plastique qui pollue nos
              océans peut devenir une ressource précieuse entre des mains
              passionnées.
            </p>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Découvrir notre histoire</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Story Section */}
      <section
        id="story"
        className={`story-section animate-section ${isVisible["story"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-tag">Notre genèse</span>
              <h2>Tout a commencé sur une plage...</h2>
              <p>
                En 2020, lors d'une balade sur une plage de la côte Ouest, notre
                fondateur Jean a été frappé par la quantité de déchets
                plastiques échoués sur le sable. Bouteilles, bouchons,
                emballages... autant de témoins silencieux de notre impact sur
                l'environnement.
              </p>
              <p>
                Plutôt que de se lamenter, Jean s'est posé une question simple :
                <strong>
                  {" "}
                  "Et si on pouvait transformer ce problème en solution ?"
                </strong>
              </p>
              <p>
                Après des mois de recherche, d'expérimentation et de
                persévérance, Krysto est né. Un projet artisanal qui donne une
                seconde vie au plastique local en le transformant en objets du
                quotidien, beaux et durables.
              </p>
            </div>
            <div className="story-image">
              <img
                src="/images/plastic_plage.jpg"
                alt="L'histoire de Krysto - Plage de Nouvelle-Calédonie"
                className="story-img"
              />
              <div className="story-quote">
                <blockquote>
                  "Le plastique n'est pas un déchet, c'est une ressource mal
                  exploitée."
                </blockquote>
                <cite>— Jean Dupont, Fondateur</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className={`mission-section animate-section ${isVisible["mission"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="mission-content">
            <span className="section-tag light">Notre mission</span>
            <h2>
              Réduire la pollution plastique en Nouvelle-Calédonie tout en
              créant de la valeur locale
            </h2>
            <div className="mission-pillars">
              <div className="pillar">
                <div className="pillar-icon">🧹</div>
                <h3>Collecter</h3>
                <p>
                  Récupérer les déchets plastiques avant qu'ils ne polluent
                  notre environnement
                </p>
              </div>
              <div className="pillar-arrow">→</div>
              <div className="pillar">
                <div className="pillar-icon">♻️</div>
                <h3>Transformer</h3>
                <p>
                  Donner une seconde vie au plastique grâce à notre savoir-faire
                  artisanal
                </p>
              </div>
              <div className="pillar-arrow">→</div>
              <div className="pillar">
                <div className="pillar-icon">💚</div>
                <h3>Inspirer</h3>
                <p>
                  Sensibiliser et encourager chacun à adopter des gestes
                  éco-responsables
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        id="timeline"
        className={`timeline-section animate-section ${isVisible["timeline"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Notre parcours</span>
            <h2>Les étapes clés de notre aventure</h2>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="timeline-content">
                  <span className="timeline-icon">{item.icon}</span>
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
            <div className="timeline-line"></div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className={`process-section animate-section ${isVisible["process"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Notre savoir-faire</span>
            <h2>De la collecte à la création</h2>
            <p>
              Un processus artisanal 100% local, respectueux de l'environnement
            </p>
          </div>

          <div className="process-detailed">
            <div className="process-step-detailed">
              <div className="step-number">01</div>
              <div className="step-visual">
                <div className="step-icon-large">🗑️</div>
              </div>
              <div className="step-info">
                <h3>Collecte du plastique</h3>
                <p>
                  Nous travaillons avec un réseau de 15 partenaires collecteurs
                  : associations, écoles, entreprises et particuliers. Le
                  plastique est récupéré avant qu'il ne finisse dans la nature
                  ou l'océan.
                </p>
                <ul className="step-details">
                  <li>Points de collecte dans tout le Grand Nouméa</li>
                  <li>Partenariats avec les entreprises locales</li>
                  <li>Opérations de nettoyage des plages</li>
                </ul>
              </div>
            </div>

            <div className="process-step-detailed reverse">
              <div className="step-number">02</div>
              <div className="step-visual">
                <div className="step-icon-large">🔍</div>
              </div>
              <div className="step-info">
                <h3>Tri et nettoyage</h3>
                <p>
                  Chaque pièce de plastique est triée manuellement par type
                  (HDPE, PET, PP...) puis soigneusement nettoyée pour garantir
                  la qualité du produit final.
                </p>
                <ul className="step-details">
                  <li>Tri manuel par type de plastique</li>
                  <li>Nettoyage écologique sans produits chimiques</li>
                  <li>Séchage naturel au soleil calédonien</li>
                </ul>
              </div>
            </div>

            <div className="process-step-detailed">
              <div className="step-number">03</div>
              <div className="step-visual">
                <div className="step-icon-large">⚙️</div>
              </div>
              <div className="step-info">
                <h3>Broyage et préparation</h3>
                <p>
                  Le plastique propre est broyé en petites paillettes. Ces
                  paillettes sont ensuite triées par couleur pour créer nos
                  mélanges uniques.
                </p>
                <ul className="step-details">
                  <li>
                    Broyeur conçu pour minimiser la consommation d'énergie
                  </li>
                  <li>Tri des couleurs pour des créations uniques</li>
                  <li>Stockage organisé par type et couleur</li>
                </ul>
              </div>
            </div>

            <div className="process-step-detailed reverse">
              <div className="step-number">04</div>
              <div className="step-visual">
                <div className="step-icon-large">🔥</div>
              </div>
              <div className="step-info">
                <h3>Moulage artisanal</h3>
                <p>
                  Les paillettes sont chauffées et moulées à la main dans nos
                  moules créés sur mesure. Chaque pièce est unique, avec ses
                  variations de couleurs et textures.
                </p>
                <ul className="step-details">
                  <li>Four optimisé alimenté en énergie solaire</li>
                  <li>Moules fabriqués localement</li>
                  <li>Temps de refroidissement naturel</li>
                </ul>
              </div>
            </div>

            <div className="process-step-detailed">
              <div className="step-number">05</div>
              <div className="step-visual">
                <div className="step-icon-large">✨</div>
              </div>
              <div className="step-info">
                <h3>Finitions et contrôle</h3>
                <p>
                  Chaque produit est poncé, poli et contrôlé minutieusement.
                  Seuls les produits parfaits rejoignent notre boutique.
                </p>
                <ul className="step-details">
                  <li>Ponçage et polissage à la main</li>
                  <li>Contrôle qualité rigoureux</li>
                  <li>Emballage dans des matériaux recyclés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plastic Types Section */}
      <section
        id="plastics"
        className={`plastics-section animate-section ${isVisible["plastics"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Les plastiques</span>
            <h2>Quels plastiques recyclons-nous ?</h2>
            <p>
              Nous transformons principalement 4 types de plastiques courants
            </p>
          </div>

          <div className="plastics-grid">
            {plasticTypes.map((plastic, index) => (
              <div
                key={index}
                className="plastic-card"
                style={{ borderTopColor: plastic.color }}
              >
                <div
                  className="plastic-code"
                  style={{ background: plastic.color }}
                >
                  {plastic.code}
                </div>
                <h3>{plastic.name}</h3>
                <p className="plastic-examples">
                  <strong>Exemples :</strong> {plastic.examples}
                </p>
              </div>
            ))}
          </div>

          <div className="plastics-note">
            <span className="note-icon">💡</span>
            <p>
              <strong>Comment nous aider ?</strong> Gardez vos bouchons,
              bouteilles et contenants plastiques propres et secs. Déposez-les
              dans nos points de collecte ou contactez-nous pour organiser une
              collecte.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        id="impact"
        className={`impact-section animate-section ${isVisible["impact"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header light">
            <span className="section-tag">Notre impact</span>
            <h2>Des chiffres qui comptent</h2>
            <p>
              Transparence totale sur notre impact environnemental et social
            </p>
          </div>

          <div className="impact-grid">
            {impacts.map((impact, index) => (
              <div
                key={index}
                className="impact-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="impact-number">
                  {impact.number}
                  {impact.unit && <small>{impact.unit}</small>}
                </span>
                <span className="impact-label">{impact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        className={`values-section animate-section ${isVisible["values"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nos valeurs</span>
            <h2>Ce qui nous guide au quotidien</h2>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className={`team-section animate-section ${isVisible["team"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">L'équipe</span>
            <h2>Les artisans derrière Krysto</h2>
            <p>Une petite équipe passionnée, unie par une même vision</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div
                key={index}
                className="team-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="team-avatar">
                  <span>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="team-join">
            <h3>Envie de rejoindre l'aventure ?</h3>
            <p>
              Nous sommes toujours à la recherche de personnes passionnées par
              l'environnement et l'artisanat.
            </p>
            <Link to="/contact" className="btn-outline-dark">
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section
        id="partners"
        className={`partners-section animate-section ${isVisible["partners"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nos partenaires</span>
            <h2>Ils nous font confiance</h2>
            <p>Ensemble, nous construisons un avenir plus durable</p>
          </div>

          <div className="partners-logos">
            <div className="partner-logo">Province Sud</div>
            <div className="partner-logo">Mairie de Nouméa</div>
            <div className="partner-logo">CCI NC</div>
            <div className="partner-logo">ADEME</div>
            <div className="partner-logo">Trecodec</div>
            <div className="partner-logo">OPT NC</div>
          </div>

          <div className="partners-cta">
            <p>Vous souhaitez devenir partenaire ?</p>
            <Link to="/contact" className="btn-secondary">
              Discutons de votre projet
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-content">
            <h2>Convaincu par notre démarche ?</h2>
            <p>
              Chaque achat soutient notre mission et contribue à un
              environnement plus propre en Nouvelle-Calédonie.
            </p>
            <div className="about-cta-buttons">
              <Link to="/products" className="btn-primary large">
                Découvrir nos produits
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/contact" className="btn-outline large">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
