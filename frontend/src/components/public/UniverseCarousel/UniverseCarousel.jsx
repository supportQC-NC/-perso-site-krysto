import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import "./UniverseCarousel.css";

const UniverseCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: universes, isLoading, error } = useGetActiveUniversesQuery();
  const totalItems = universes?.length || 0;

  const goToSlide = useCallback(
    (index) => {
      if (isAnimating || totalItems === 0) return;

      setIsAnimating(true);
      let newIndex = index;
      if (index < 0) newIndex = totalItems - 1;
      else if (index >= totalItems) newIndex = 0;

      setActiveIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, totalItems],
  );

  const goNext = useCallback(
    () => goToSlide(activeIndex + 1),
    [activeIndex, goToSlide],
  );
  const goPrev = useCallback(
    () => goToSlide(activeIndex - 1),
    [activeIndex, goToSlide],
  );

  // Auto-rotation 4s
  useEffect(() => {
    if (isPaused || totalItems <= 1) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [isPaused, goNext, totalItems]);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const getPosition = (index) => {
    let diff = index - activeIndex;
    if (totalItems > 2) {
      if (diff > totalItems / 2) diff -= totalItems;
      if (diff < -totalItems / 2) diff += totalItems;
    }
    return diff;
  };

  if (isLoading) {
    return (
      <section className="uc">
        <div className="uc__bg" />
        <div className="uc__container">
          <div className="uc__header">
            <h2 className="uc__title">Nos Univers</h2>
          </div>
          <div className="uc__stage">
            <div className="uc-card uc-card--skeleton">
              <div className="uc-card__img-skeleton" />
              <div className="uc-card__body">
                <div className="skeleton-text skeleton-text--lg" />
                <div className="skeleton-text" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !universes?.length) return null;

  return (
    <section className="uc">
      {/* Background avec motif */}
      <div className="uc__bg">
        <div className="uc__bg-pattern" />
        <div className="uc__bg-gradient" />
      </div>

      <div className="uc__container">
        {/* Header */}
        <div className="uc__header">
          <div className="uc__header-text">
            <span className="uc__label">Collections</span>
            <h2 className="uc__title">Découvrez Nos Univers</h2>
            <p className="uc__subtitle">
              Explorez nos collections de produits recyclés, organisées par
              thématique
            </p>
          </div>
          <Link to="/universes" className="uc__see-all">
            Voir toutes les collections
            <FiArrowRight />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="uc__stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Arrow Left */}
          <button className="uc__arrow uc__arrow--left" onClick={goPrev}>
            <FiChevronLeft />
          </button>

          {/* Cards */}
          <div className="uc__track">
            {universes.map((universe, index) => {
              const pos = getPosition(index);
              const isActive = pos === 0;

              return (
                <article
                  key={universe._id}
                  className={`uc-card ${isActive ? "uc-card--active" : ""}`}
                  data-pos={pos}
                  onClick={() => !isActive && goToSlide(index)}
                >
                  {/* Image */}
                  <div className="uc-card__img">
                    <img
                      src={universe.image}
                      alt={universe.name}
                      loading="lazy"
                    />
                    <div className="uc-card__img-gradient" />
                  </div>

                  {/* Content */}
                  <div className="uc-card__body">
                    <div className="uc-card__badge">
                      <FiPackage />
                      <span>{universe.productCount || 0} produits</span>
                    </div>

                    <h3 className="uc-card__title">{universe.name}</h3>

                    <p className="uc-card__desc">{universe.description}</p>

                    {isActive && (
                      <Link
                        to={`/universe/${universe.slug}`}
                        className="uc-card__btn"
                      >
                        Explorer
                        <FiArrowRight />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Arrow Right */}
          <button className="uc__arrow uc__arrow--right" onClick={goNext}>
            <FiChevronRight />
          </button>
        </div>

        {/* Dots */}
        <div className="uc__dots">
          {universes.map((_, i) => (
            <button
              key={i}
              className={`uc__dot ${i === activeIndex ? "uc__dot--active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniverseCarousel;
