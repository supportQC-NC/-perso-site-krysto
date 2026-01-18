import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation on scroll
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Marie L.",
      location: "Nouméa",
      text: "Des produits magnifiques et une démarche qui a du sens. Mon cache-pot est unique, je suis fière de contribuer au recyclage local !",
      rating: 5,
    },
    {
      name: "Jean-Pierre D.",
      location: "Dumbéa",
      text: "Qualité exceptionnelle ! On ne dirait jamais que c'est fait à partir de plastique recyclé. Bravo pour cette initiative.",
      rating: 5,
    },
    {
      name: "Sophie M.",
      location: "Païta",
      text: "J'ai offert un coffret à ma mère, elle a adoré. Les couleurs sont superbes et le concept est génial.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "5+", label: "Tonnes de plastique recyclé", icon: "♻️" },
    { number: "2000+", label: "Produits créés", icon: "🎨" },
    { number: "100%", label: "Made in NC", icon: "🇳🇨" },
    { number: "0", label: "Déchet produit", icon: "🌿" },
  ];

  const process = [
    {
      step: "01",
      title: "Collecte",
      description:
        "Récupération des déchets plastiques locaux (bouteilles, bouchons, emballages)",
      icon: "🗑️",
    },
    {
      step: "02",
      title: "Tri & Nettoyage",
      description:
        "Tri par type de plastique et nettoyage minutieux pour garantir la qualité",
      icon: "🧹",
    },
    {
      step: "03",
      title: "Broyage",
      description:
        "Transformation en paillettes de plastique prêtes à être travaillées",
      icon: "⚙️",
    },
    {
      step: "04",
      title: "Création",
      description: "Moulage artisanal et création de pièces uniques avec amour",
      icon: "✨",
    },
  ];

  const products = [
    {
      name: "Cache-pot Lagon",
      price: "3 500 XPF",
      image: "/images/products/cache-pot.jpg",
      tag: "Bestseller",
    },
    {
      name: "Dessous de verre Corail",
      price: "1 200 XPF",
      image: "/images/products/dessous-verre.jpg",
      tag: "Nouveau",
    },
    {
      name: "Porte-savon Vague",
      price: "1 800 XPF",
      image: "/images/products/porte-savon.jpg",
      tag: "Éco-favori",
    },
    {
      name: "Vase Océan",
      price: "4 200 XPF",
      image: "/images/products/vase.jpg",
      tag: "Édition limitée",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
          <div className="floating-plastic plastic-1">♻️</div>
          <div className="floating-plastic plastic-2">🌊</div>
          <div className="floating-plastic plastic-3">🌿</div>
        </div>

        <div className="hero-content">
          <span className="hero-badge">🇳🇨 Fabriqué en Nouvelle-Calédonie</span>
          <h1 className="hero-title">
            <span className="title-line">Le plastique</span>
            <span className="title-line highlight">devient art</span>
          </h1>
          <p className="hero-subtitle">
            Nous transformons les déchets plastiques de l'océan et de nos îles
            en objets du quotidien, beaux et durables.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn-primary">
              Découvrir nos créations
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/about" className="btn-secondary">
              Notre histoire
            </Link>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <span className="trust-icon">🌱</span>
              <span>100% Recyclé</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🤲</span>
              <span>Fait main</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💚</span>
              <span>Éco-responsable</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Découvrir</span>
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section
        id="problem"
        className={`problem-section animate-section ${isVisible["problem"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="problem-grid">
            <div className="problem-content">
              <span className="section-tag">Le problème</span>
              <h2>
                8 millions de tonnes de plastique finissent dans nos océans
                chaque année
              </h2>
              <p>
                En Nouvelle-Calédonie, notre lagon — classé au patrimoine
                mondial de l'UNESCO — est menacé. Nos plages, notre faune
                marine, notre écosystème unique souffrent de cette pollution.
              </p>
            </div>
            <div className="solution-content">
              <span className="section-tag green">Notre solution</span>
              <h2>Transformer le problème en opportunité</h2>
              <p>
                Chez Krysto, nous collectons ces déchets plastiques et leur
                donnons une seconde vie. Chaque produit que vous achetez, c'est
                du plastique en moins dans notre environnement.
              </p>
            </div>
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
            <span className="section-tag">Notre processus</span>
            <h2>Du déchet à l'objet d'art</h2>
            <p>
              Un processus artisanal 100% local, du tri à la création finale
            </p>
          </div>

          <div className="process-timeline">
            {process.map((item, index) => (
              <div
                key={index}
                className="process-step"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {index < process.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className={`products-section animate-section ${isVisible["products"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nos créations</span>
            <h2>Des pièces uniques pour votre quotidien</h2>
            <p>
              Chaque produit est unique, comme le plastique dont il est issu
            </p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={index}
                className="product-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="product-image">
                  <div className="product-placeholder">
                    <span>🎨</span>
                  </div>
                  <span className="product-tag">{product.tag}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="products-cta">
            <Link to="/products" className="btn-primary">
              Voir tous nos produits
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className={`stats-section animate-section ${isVisible["stats"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`testimonials-section animate-section ${isVisible["testimonials"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Témoignages</span>
            <h2>Ce que nos clients disent</h2>
          </div>

          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${index === currentTestimonial ? "active" : ""}`}
              >
                <div className="testimonial-rating">
                  {"★".repeat(testimonial.rating)}
                </div>
                <blockquote>"{testimonial.text}"</blockquote>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? "active" : ""}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Témoignage ${index + 1}`}
              />
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
          <div className="section-header light">
            <span className="section-tag">Nos valeurs</span>
            <h2>Plus qu'une entreprise, un engagement</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌊</div>
              <h3>Préserver notre lagon</h3>
              <p>
                Chaque kilo de plastique recyclé, c'est un peu moins de
                pollution dans notre magnifique lagon calédonien.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Économie locale</h3>
              <p>
                100% de notre production est réalisée en Nouvelle-Calédonie,
                soutenant l'emploi et l'économie locale.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Sensibilisation</h3>
              <p>
                Nous intervenons dans les écoles et les entreprises pour
                sensibiliser au recyclage et à l'économie circulaire.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>Artisanat d'art</h3>
              <p>
                Chaque pièce est unique, créée avec passion par nos artisans qui
                donnent une seconde vie au plastique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        id="newsletter"
        className={`newsletter-section animate-section ${isVisible["newsletter"] ? "visible" : ""}`}
      >
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Rejoignez le mouvement</h2>
              <p>
                Recevez nos actualités, nos nouveaux produits et nos conseils
                pour un mode de vie plus éco-responsable.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Votre adresse email" required />
              <button type="submit" className="btn-primary">
                S'inscrire
              </button>
            </form>
            <p className="newsletter-privacy">
              🔒 Vos données sont protégées.{" "}
              <Link to="/politique-confidentialite">En savoir plus</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-content">
            <h2>Prêt à faire la différence ?</h2>
            <p>
              Chaque achat est un geste pour la planète. Découvrez nos créations
              et rejoignez l'aventure Krysto.
            </p>
            <div className="final-cta-buttons">
              <Link to="/products" className="btn-primary large">
                Découvrir la boutique
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

export default LandingPage;
