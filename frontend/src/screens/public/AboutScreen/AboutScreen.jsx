import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
  FiGlobe,
  FiRefreshCw,
  FiUsers,
  FiAward,
  FiDroplet,
  FiMapPin,
  FiChevronLeft,
  FiChevronDown,
  FiPlus,
  FiPlusCircle,
} from "react-icons/fi";
import * as THREE from "three";
import "./AboutScreen.css";

const AboutScreen = () => {
  // Refs pour les animations
  const canvasRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [visibleSections, setVisibleSections] = useState([]);

  // Three.js Particles Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particules
    const particlesCount = 800;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      // Couleurs vert/cyan
      const mixRatio = Math.random();
      colors[i * 3] = 0.06 + mixRatio * 0.35;
      colors[i * 3 + 1] = 0.73 + mixRatio * 0.18;
      colors[i * 3 + 2] = 0.51 + mixRatio * 0.47;

      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 8;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth interpolation
      targetX += (mouseX - targetX) * 0.02;
      targetY += (mouseY - targetY) * 0.02;

      particles.rotation.x += 0.0003;
      particles.rotation.y += 0.0005;

      // Mouvement fluide vers la souris
      particles.rotation.x += targetY * 0.0008;
      particles.rotation.y += targetX * 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Intersection Observer pour les animations au scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = entry.target.dataset.step;
          const sectionId = entry.target.dataset.section;

          if (stepIndex !== undefined) {
            setVisibleSteps((prev) => {
              if (!prev.includes(stepIndex)) {
                return [...prev, stepIndex];
              }
              return prev;
            });
          }

          if (sectionId) {
            setVisibleSections((prev) => {
              if (!prev.includes(sectionId)) {
                return [...prev, sectionId];
              }
              return prev;
            });
          }
        }
      });
    }, observerOptions);

    // Observer les steps du processus
    const steps = document.querySelectorAll(".about__process-step");
    steps.forEach((step, index) => {
      step.dataset.step = index.toString();
      observer.observe(step);
    });

    // Observer les sections animées
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll vers la section suivante
  const scrollToNext = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  // Données du processus
  const processSteps = [
    {
      number: "01",
      title: "Collecte",
      description:
        "Nous récupérons le plastique sur les plages, dans les océans et auprès de nos partenaires locaux en Nouvelle-Calédonie.",
      image: "/images/process/collecte.jpg",
      icon: "🌊",
    },
    {
      number: "02",
      title: "Tri & Nettoyage",
      description:
        "Chaque déchet est soigneusement trié par type de plastique, nettoyé et préparé pour la transformation.",
      image: "/images/process/tri.jpg",
      icon: "🔬",
    },
    {
      number: "03",
      title: "Transformation",
      description:
        "Le plastique est broyé en paillettes, puis fondu et moulé dans notre atelier avec les machines Precious Plastic.",
      image: "/images/process/transformation.jpg",
      icon: "⚙️",
    },
    {
      number: "04",
      title: "Création",
      description:
        "Nos artisans donnent vie à des objets uniques et durables. Chaque pièce raconte son histoire.",
      image: "/images/process/creation.jpg",
      icon: "✨",
    },
  ];

  // Données des valeurs
  const values = [
    {
      icon: <FiGlobe />,
      title: "Impact Local",
      description: "Nous agissons localement pour un impact global.",
    },
    {
      icon: <FiRefreshCw />,
      title: "Économie Circulaire",
      description: "Rien ne se perd, tout se transforme.",
    },
    {
      icon: <FiHeart />,
      title: "Artisanat Local",
      description: "Fabriqué avec passion en Nouvelle-Calédonie.",
    },
    {
      icon: <FiUsers />,
      title: "Communauté",
      description: "Ensemble pour un avenir durable.",
    },
  ];

  // Données de l'impact
  const impactStats = [
    { value: "1,5", unit: "T", label: "plastique collecté" },
    { value: "1K+", unit: "", label: "produits créés" },
    { value: "100", unit: "KG", label: "CO2 économisé" },
  ];

  return (
    <div className="about">
      {/* ==================== HERO ==================== */}
      <section className="about__hero">
        <canvas ref={canvasRef} className="about__hero-canvas" />
        <div className="about__hero-bg">
          <img src="/images/about-hero.jpg" alt="" />
        </div>
        <div className="about__hero-content">
          <Link to="/" className="about__back-btn">
            <FiChevronLeft />
            <span>Accueil</span>
          </Link>
          <h1 className="about__hero-title">
            <span className="about__hero-title-line">Notre mission</span>
            <span className="about__hero-title-highlight">
              Sauver nos océans
            </span>
          </h1>
          <p className="about__hero-subtitle">
            Transformer le plastique océanique en objets du quotidien, beaux et
            durables.
          </p>
        </div>
        <button
          className="about__hero-scroll"
          onClick={scrollToNext}
          aria-label="Découvrir"
        >
          <span>Découvrir</span>
          <div className="about__hero-scroll-icon">
            <FiChevronDown />
          </div>
        </button>
      </section>

      {/* ==================== HISTOIRE ==================== */}
      <section
        id="story"
        className={`about__story ${visibleSections.includes("story") ? "is-visible" : ""}`}
        data-section="story"
      >
        <div className="about__story-container">
          <div className="about__story-content">
            <span className="about__label">Notre Histoire</span>
            <h2 className="about__story-title">
              Né de l'urgence,
              <br />
              <span>porté par l'espoir</span>
            </h2>
            <p className="about__story-text">
              En Nouvelle-Calédonie, nous assistons chaque jour aux ravages du
              plastique sur notre écosystème unique.
            </p>
            <p className="about__story-text">
              <strong>Krysto est né de cette urgence</strong> : transformer ce
              fléau en opportunité et prouver qu'un autre modèle est possible.
            </p>
            <div className="about__story-signature">
              <div className="about__story-badge">
                <FiMapPin />
                <span>Nouméa, NC</span>
              </div>
              <div className="about__story-badge">
                <FiAward />
                <span>Depuis 2020</span>
              </div>
              <div className="about__story-badge">
                <FiPlusCircle />
                <span>Soutenue par la Province-Sud</span>
              </div>
            </div>
          </div>
          <div className="about__story-visual">
            <div className="about__story-image">
              <img src="/images/about-story.jfif" alt="L'équipe Krysto" />
            </div>
            <div className="about__story-float">
              <span className="about__story-float-icon">🇳🇨</span>
              <p>
                Fièrement
                <br />
                Calédonien
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VALEURS ==================== */}
      <section
        className={`about__values ${visibleSections.includes("values") ? "is-visible" : ""}`}
        data-section="values"
      >
        <div className="about__values-container">
          <div className="about__values-header">
            <span className="about__label about__label--center">
              Nos Valeurs
            </span>
            <h2 className="about__values-title">
              Ce qui nous <span>anime</span>
            </h2>
          </div>
          <div className="about__values-grid">
            {values.map((value, index) => (
              <div
                key={index}
                className="about__value-card"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="about__value-icon">{value.icon}</div>
                <div className="about__value-content">
                  <h3 className="about__value-title">{value.title}</h3>
                  <p className="about__value-text">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROCESSUS ==================== */}
      <section className="about__process">
        <div className="about__process-container">
          <div className="about__process-header">
            <span className="about__label about__label--light about__label--center">
              Notre Processus
            </span>
            <h2 className="about__process-title">
              Du déchet à l'objet
              <span>une transformation vertueuse</span>
            </h2>
          </div>

          <div className="about__process-steps">
            {/* Timeline centrale */}
            <div className="about__process-timeline">
              <div className="about__process-timeline-track">
                <div
                  className="about__process-timeline-progress"
                  style={{
                    height: `${Math.min((visibleSteps.length / processSteps.length) * 100, 100)}%`,
                  }}
                />
              </div>
              {processSteps.map((_, index) => (
                <div
                  key={index}
                  className={`about__process-timeline-dot ${visibleSteps.includes(index.toString()) ? "is-active" : ""}`}
                  style={{
                    top: `${(index / (processSteps.length - 1)) * 100}%`,
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>

            {/* Steps */}
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`about__process-step ${visibleSteps.includes(index.toString()) ? "is-visible" : ""}`}
                data-step={index}
              >
                <div className="about__process-step-image">
                  <img src={step.image} alt={step.title} />
                  <div className="about__process-step-icon">{step.icon}</div>
                </div>
                <div className="about__process-step-content">
                  <div className="about__process-step-number">
                    {step.number}
                  </div>
                  <h3 className="about__process-step-title">{step.title}</h3>
                  <p className="about__process-step-text">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== IMPACT ==================== */}
      <section
        className={`about__impact ${visibleSections.includes("impact") ? "is-visible" : ""}`}
        data-section="impact"
      >
        <div className="about__impact-container">
          <div className="about__impact-header">
            <span className="about__label about__label--center">
              Notre Impact
            </span>
            <h2 className="about__impact-title">
              Ensemble, nous faisons <span>la différence</span>
            </h2>
          </div>
          <div className="about__impact-grid">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="about__impact-card"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="about__impact-value">
                  {stat.value}
                  {stat.unit && (
                    <span className="about__impact-unit">{stat.unit}</span>
                  )}
                </div>
                <p className="about__impact-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="about__cta">
        <div className="about__cta-container">
          <div className="about__cta-content">
            <h2 className="about__cta-title">Rejoignez le mouvement</h2>
            <p className="about__cta-text">
              Chaque achat est un geste pour notre planète.
            </p>
            <div className="about__cta-buttons">
              <Link
                to="/products"
                className="about__cta-btn about__cta-btn--primary"
              >
                <FiDroplet />
                <span>Nos créations</span>
                <FiArrowRight />
              </Link>
              <Link
                to="/contact"
                className="about__cta-btn about__cta-btn--secondary"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutScreen;
