import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import "./Hero.css";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // Particules avec animation unique pour chaque
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const size = Math.random() * 5 + 2;
      const duration = Math.random() * 15 + 12;
      const delay = Math.random() * -15;

      return {
        id: i,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration,
        delay,
        opacity: Math.random() * 0.5 + 0.3,
        // Mouvement aléatoire pour chaque particule
        moveX: Math.random() * 40 - 20,
        moveY: Math.random() * 30 - 15,
      };
    });
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Background Image */}
      <div
        className="hero__bg-image"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-ocean.jpg)`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="hero__overlay" />

      {/* Particules animées */}
      <div className="hero__particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="hero__particle"
            style={{
              "--size": `${p.size}px`,
              "--left": `${p.left}%`,
              "--top": `${p.top}%`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--opacity": p.opacity,
              "--moveX": `${p.moveX}px`,
              "--moveY": `${p.moveY}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className={`hero__inner ${isLoaded ? "hero__inner--loaded" : ""}`}>
          {/* Badge */}
          {/* <div className="hero__badge">
            <span className="hero__badge-dot" />
            <span>Nouvelle-Calédonie</span>
          </div> */}

          {/* Title */}
          <h1 className="hero__title">
            <span className="hero__title-line">Nous transformons le</span>
            <span className="hero__title-highlight">les déchets plastique</span>
            <span className="hero__title-line">en produits durables</span>
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle">
            Chaque année, des tonnes de plastique polluent nos océans. Nous le
            collectons, le recyclons et le transformons en objets du quotidien.
            Chaque achat contribue à un océan plus propre.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta">
            <Link to="/boutique" className="hero__btn hero__btn--primary">
              Découvrir nos produits
              <FiArrowRight />
            </Link>
            <Link to="/about" className="hero__btn hero__btn--secondary">
              En savoir plus
              <FiArrowRight />
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">1 T</span>
              <span className="hero__stat-label">Plastique collecté</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">1000+</span>
              <span className="hero__stat-label">Produits créés</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">100 kg CO2</span>
              <span className="hero__stat-label">Évités</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
