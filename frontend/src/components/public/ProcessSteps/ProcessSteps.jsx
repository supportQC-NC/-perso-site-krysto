import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import "./ProcessSteps.css";

const YOUTUBE_VIDEO_ID = "PcV0WUYh6Oo"; // Remplacer par votre ID vidéo YouTube

const steps = [
  {
    id: 1,
    number: "01",
    icon: "🌊",
    title: "Collecte",
    subtitle: "Sur les plages & océans",
    description:
      "Nos équipes et bénévoles parcourent les plages de Nouvelle-Calédonie pour récupérer le plastique qui pollue notre lagon et nos côtes.",
    stat: "12.5 tonnes",
    statLabel: "collectées",
  },
  {
    id: 2,
    number: "02",
    icon: "🔬",
    title: "Tri & Nettoyage",
    subtitle: "Préparation minutieuse",
    description:
      "Chaque déchet est trié par type de plastique (PET, HDPE, PP...), nettoyé soigneusement et préparé pour la transformation.",
    stat: "7 types",
    statLabel: "de plastiques",
  },
  {
    id: 3,
    number: "03",
    icon: "⚙️",
    title: "Transformation",
    subtitle: "Dans notre atelier",
    description:
      "Le plastique est broyé en paillettes, fondu à haute température puis injecté dans nos moules pour créer la matière première.",
    stat: "100%",
    statLabel: "local",
  },
  {
    id: 4,
    number: "04",
    icon: "✨",
    title: "Création",
    subtitle: "Artisanat unique",
    description:
      "Nos artisans façonnent chaque pièce avec passion, créant des objets uniques, durables et utiles pour votre quotidien.",
    stat: "5000+",
    statLabel: "produits créés",
  },
];

const ProcessSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const goToStep = useCallback((index) => {
    let newIndex = index;
    if (index < 0) newIndex = steps.length - 1;
    else if (index >= steps.length) newIndex = 0;
    setActiveStep(newIndex);
  }, []);

  const goNext = useCallback(
    () => goToStep(activeStep + 1),
    [activeStep, goToStep],
  );
  const goPrev = useCallback(
    () => goToStep(activeStep - 1),
    [activeStep, goToStep],
  );

  // Auto-rotation 5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  return (
    <section className="process">
      {/* Video Background */}
      <div className="process__video-bg">
        <div className="process__video-container">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="Krysto Process Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="process__video-overlay" />
      </div>

      <div className="process__container">
        {/* Header */}
        <div className="process__header">
          <span className="process__label">Notre savoir-faire</span>
          <h2 className="process__title">
            Du déchet à l'objet,
            <br />
            <span>une transformation vertueuse</span>
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="process__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Arrow Left */}
          <button
            className="process__arrow process__arrow--left"
            onClick={goPrev}
          >
            <FiChevronLeft />
          </button>

          {/* Cards Track */}
          <div className="process__track">
            {steps.map((step, index) => {
              const pos = index - activeStep;
              const isActive = pos === 0;

              return (
                <article
                  key={step.id}
                  className={`process-card ${isActive ? "process-card--active" : ""}`}
                  data-pos={pos}
                  onClick={() => goToStep(index)}
                >
                  <div className="process-card__inner">
                    {/* Number */}
                    <span className="process-card__number">{step.number}</span>

                    {/* Icon */}
                    <div className="process-card__icon">{step.icon}</div>

                    {/* Content */}
                    <div className="process-card__content">
                      <span className="process-card__subtitle">
                        {step.subtitle}
                      </span>
                      <h3 className="process-card__title">{step.title}</h3>
                      <p className="process-card__desc">{step.description}</p>

                      {/* Stat */}
                      <div className="process-card__stat">
                        <span className="process-card__stat-value">
                          {step.stat}
                        </span>
                        <span className="process-card__stat-label">
                          {step.statLabel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Line */}
                    {isActive && (
                      <div className="process-card__progress">
                        <div className="process-card__progress-bar" />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Arrow Right */}
          <button
            className="process__arrow process__arrow--right"
            onClick={goNext}
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="process__indicators">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`process__indicator ${index === activeStep ? "process__indicator--active" : ""}`}
              onClick={() => goToStep(index)}
            >
              <span className="process__indicator-icon">{step.icon}</span>
              <span className="process__indicator-title">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Video Control */}
        <button
          className="process__video-btn"
          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
        >
          <FiPlay />
          <span>Voir la vidéo complète</span>
        </button>
      </div>
    </section>
  );
};

export default ProcessSteps;
