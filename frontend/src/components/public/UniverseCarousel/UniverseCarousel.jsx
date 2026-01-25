import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import "./UniverseCarousel.css";

const UniverseCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: universes, isLoading, error } = useGetActiveUniversesQuery();

  const totalItems = universes?.length || 0;

  // Navigation
  const goToSlide = useCallback(
    (index) => {
      if (isAnimating || totalItems === 0) return;

      setIsAnimating(true);
      let newIndex = index;

      if (index < 0) {
        newIndex = totalItems - 1;
      } else if (index >= totalItems) {
        newIndex = 0;
      }

      setActiveIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, totalItems],
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Auto-rotation (4 secondes)
  useEffect(() => {
    if (isPaused || totalItems <= 1) return;

    const interval = setInterval(() => {
      goNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, goNext, totalItems]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Calculate card position and style
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    let adjustedDiff = diff;

    // Handle wrap-around for circular effect
    if (totalItems > 2) {
      if (diff > totalItems / 2) adjustedDiff = diff - totalItems;
      if (diff < -totalItems / 2) adjustedDiff = diff + totalItems;
    }

    const isActive = adjustedDiff === 0;
    const isAdjacent = Math.abs(adjustedDiff) === 1;
    const isVisible = Math.abs(adjustedDiff) <= 2;

    if (!isVisible) {
      return {
        opacity: 0,
        transform: `translateX(${adjustedDiff * 100}%) scale(0.5) rotateY(${adjustedDiff * 45}deg)`,
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    const translateX = adjustedDiff * 280;
    const scale = isActive ? 1 : isAdjacent ? 0.85 : 0.7;
    const rotateY = adjustedDiff * -35;
    const zIndex = 10 - Math.abs(adjustedDiff);
    const opacity = isActive ? 1 : isAdjacent ? 0.7 : 0.4;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      pointerEvents: isActive ? "auto" : "none",
    };
  };

  if (isLoading) {
    return (
      <section className="universe-carousel">
        <div className="universe-carousel__container">
          <div className="universe-carousel__header">
            <span className="universe-carousel__label">Explorez</span>
            <h2 className="universe-carousel__title">Nos Univers</h2>
          </div>
          <div className="universe-carousel__stage">
            <div className="universe-card universe-card--skeleton">
              <div className="universe-card__image-skeleton" />
              <div className="universe-card__content">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !universes?.length) {
    return null;
  }

  return (
    <section className="universe-carousel">
      <div className="universe-carousel__container">
        {/* Header */}
        <div className="universe-carousel__header">
          <div className="universe-carousel__header-content">
            <span className="universe-carousel__label">Explorez</span>
            <h2 className="universe-carousel__title">Nos Univers</h2>
            <p className="universe-carousel__subtitle">
              Découvrez nos collections thématiques
            </p>
          </div>
          <Link to="/universes" className="universe-carousel__view-all">
            Voir tout
            <FiArrowRight />
          </Link>
        </div>

        {/* 3D Carousel Stage */}
        <div
          className="universe-carousel__stage"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left Arrow */}
          <button
            className="universe-carousel__arrow universe-carousel__arrow--left"
            onClick={goPrev}
            aria-label="Précédent"
          >
            <FiChevronLeft />
          </button>

          {/* Cards Container */}
          <div className="universe-carousel__cards">
            {universes.map((universe, index) => (
              <Link
                key={universe._id}
                to={`/universe/${universe.slug}`}
                className={`universe-card ${index === activeIndex ? "universe-card--active" : ""}`}
                style={getCardStyle(index)}
                onClick={(e) => {
                  if (index !== activeIndex) {
                    e.preventDefault();
                    goToSlide(index);
                  }
                }}
              >
                <div className="universe-card__image">
                  <img
                    src={universe.image}
                    alt={universe.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-universe.jpg`;
                    }}
                  />
                  <div className="universe-card__shine" />
                </div>

                <div className="universe-card__content">
                  <h3 className="universe-card__name">{universe.name}</h3>
                  <p className="universe-card__description">
                    {universe.description}
                  </p>
                  <div className="universe-card__footer">
                    <span className="universe-card__count">
                      {universe.productCount || 0} produit
                      {(universe.productCount || 0) !== 1 ? "s" : ""}
                    </span>
                    <span className="universe-card__cta">
                      Explorer <FiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="universe-carousel__arrow universe-carousel__arrow--right"
            onClick={goNext}
            aria-label="Suivant"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="universe-carousel__dots">
          {universes.map((_, index) => (
            <button
              key={index}
              className={`universe-carousel__dot ${index === activeIndex ? "universe-carousel__dot--active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à l'univers ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="universe-carousel__progress">
          <div
            className="universe-carousel__progress-bar"
            style={{
              animationDuration: isPaused ? "0s" : "4s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
            key={activeIndex}
          />
        </div>
      </div>
    </section>
  );
};

export default UniverseCarousel;
