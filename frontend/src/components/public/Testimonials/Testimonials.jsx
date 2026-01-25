import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Marie Laurent",
    location: "Nouméa",
    avatar: null, // null = initiales
    rating: 5,
    text: "Des produits magnifiques et une démarche qui a du sens. Je suis fière de contribuer à la protection de nos océans tout en ayant des objets uniques chez moi. La qualité est au rendez-vous !",
    product: "Set de dessous de verre",
    date: "Décembre 2024",
  },
  {
    id: 2,
    name: "Thomas Rivière",
    location: "Bourail",
    avatar: null,
    rating: 5,
    text: "La qualité est exceptionnelle ! On ne dirait jamais que c'est du plastique recyclé. Krysto prouve qu'on peut allier écologie et esthétique. Bravo pour cette initiative locale !",
    product: "Pot à crayons",
    date: "Novembre 2024",
  },
  {
    id: 3,
    name: "Sophie Martin",
    location: "Koné",
    avatar: null,
    rating: 5,
    text: "J'ai offert un set de dessous de verre à ma famille en métropole. Ils ont adoré l'histoire derrière chaque pièce. Un cadeau qui a du sens et qui fait parler !",
    product: "Coffret cadeau",
    date: "Octobre 2024",
  },
  {
    id: 4,
    name: "Jean-Pierre Dubois",
    location: "Lifou",
    avatar: null,
    rating: 5,
    text: "En tant que professionnel du tourisme, je recommande les produits Krysto à tous mes clients. C'est le souvenir parfait de Nouvelle-Calédonie : beau, utile et éco-responsable.",
    product: "Porte-clés baleine",
    date: "Septembre 2024",
  },
  {
    id: 5,
    name: "Isabelle Chen",
    location: "Dumbéa",
    avatar: null,
    rating: 5,
    text: "Je suis cliente depuis le début et je vois l'évolution de Krysto. Chaque nouveau produit est une surprise. L'équipe est passionnée et ça se ressent dans la qualité de leur travail.",
    product: "Collection complète",
    date: "Août 2024",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);

  const goToSlide = useCallback((index) => {
    let newIndex = index;
    if (index < 0) newIndex = testimonials.length - 1;
    else if (index >= testimonials.length) newIndex = 0;
    setActiveIndex(newIndex);
  }, []);

  const goNext = useCallback(
    () => goToSlide(activeIndex + 1),
    [activeIndex, goToSlide],
  );
  const goPrev = useCallback(
    () => goToSlide(activeIndex - 1),
    [activeIndex, goToSlide],
  );

  // Auto-rotation 6s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPosition = (index) => {
    let diff = index - activeIndex;
    const total = testimonials.length;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="testimonials">
      {/* Background Elements */}
      <div className="testimonials__bg">
        <div className="testimonials__bg-quote">"</div>
        <div className="testimonials__bg-circle testimonials__bg-circle--1" />
        <div className="testimonials__bg-circle testimonials__bg-circle--2" />
      </div>

      <div className="testimonials__container">
        {/* Header */}
        <div className="testimonials__header">
          <span className="testimonials__label">Témoignages</span>
          <h2 className="testimonials__title">
            Ce que nos clients
            <br />
            <span>disent de nous</span>
          </h2>
          <p className="testimonials__subtitle">
            Découvrez les avis de ceux qui ont choisi Krysto
          </p>
        </div>

        {/* Carousel */}
        <div
          className="testimonials__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Arrow Left */}
          <button
            className="testimonials__arrow testimonials__arrow--left"
            onClick={goPrev}
          >
            <FiChevronLeft />
          </button>

          {/* Cards */}
          <div className="testimonials__track">
            {testimonials.map((testimonial, index) => {
              const pos = getPosition(index);
              const isActive = pos === 0;

              return (
                <article
                  key={testimonial.id}
                  className={`testi-card ${isActive ? "testi-card--active" : ""}`}
                  data-pos={pos}
                  onClick={() => goToSlide(index)}
                >
                  {/* Quote Icon */}
                  <div className="testi-card__quote">"</div>

                  {/* Stars */}
                  <div className="testi-card__stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`testi-card__star ${i < testimonial.rating ? "testi-card__star--filled" : ""} ${hoveredStar !== null && i <= hoveredStar && isActive ? "testi-card__star--hover" : ""}`}
                        onMouseEnter={() => isActive && setHoveredStar(i)}
                        onMouseLeave={() => setHoveredStar(null)}
                      >
                        <FiStar />
                      </span>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="testi-card__text">{testimonial.text}</p>

                  {/* Product Badge */}
                  <span className="testi-card__product">
                    ✓ A acheté : {testimonial.product}
                  </span>

                  {/* Author */}
                  <div className="testi-card__author">
                    <div className="testi-card__avatar">
                      {testimonial.avatar ? (
                        <img src={testimonial.avatar} alt={testimonial.name} />
                      ) : (
                        <span>{getInitials(testimonial.name)}</span>
                      )}
                    </div>
                    <div className="testi-card__author-info">
                      <strong className="testi-card__name">
                        {testimonial.name}
                      </strong>
                      <span className="testi-card__location">
                        📍 {testimonial.location} • {testimonial.date}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Arrow Right */}
          <button
            className="testimonials__arrow testimonials__arrow--right"
            onClick={goNext}
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Dots */}
        <div className="testimonials__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonials__dot ${i === activeIndex ? "testimonials__dot--active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="testimonials__trust">
          <div className="testimonials__trust-item">
            <span className="testimonials__trust-value">4.9/5</span>
            <span className="testimonials__trust-label">Note moyenne</span>
          </div>
          <div className="testimonials__trust-divider" />
          <div className="testimonials__trust-item">
            <span className="testimonials__trust-value">500+</span>
            <span className="testimonials__trust-label">Avis clients</span>
          </div>
          <div className="testimonials__trust-divider" />
          <div className="testimonials__trust-item">
            <span className="testimonials__trust-value">98%</span>
            <span className="testimonials__trust-label">Satisfaits</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
