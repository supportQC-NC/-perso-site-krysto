// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   FiArrowRight,
//   FiGlobe,
//   FiChevronRight,
//   FiCheck,
//   FiRefreshCw,
//   FiHeart,
//   FiStar,
//   FiMail,
//   FiDroplet,
//   FiX,
// } from "react-icons/fi";
// import { useSubscribeNewsletterMutation } from "../../../slices/prospectApiSlice";
// import { useGetProductsQuery } from "../../../slices/productApiSlice";

// // Components
// import Hero from "../../../components/public/Hero";

// import "./HomeScreen.css";

// const HomeScreen = () => {
//   // Newsletter
//   const [email, setEmail] = useState("");
//   const [subscribeNewsletter, { isLoading: isSubscribing }] =
//     useSubscribeNewsletterMutation();

//   // Popup states
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState({
//     type: "",
//     title: "",
//     text: "",
//   });

//   // Produits vedettes
//   const { data: productsData } = useGetProductsQuery({
//     limit: 4,
//     sortBy: "createdAt",
//   });

//   // Animations au scroll
//   const [isVisible, setIsVisible] = useState({});

//   useEffect(() => {
//     const observers = [];
//     const sections = [
//       "mission",
//       "products",
//       "process",
//       "impact",
//       "testimonials",
//       "newsletter",
//     ];

//     sections.forEach((section) => {
//       const element = document.getElementById(section);
//       if (element) {
//         const observer = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               setIsVisible((prev) => ({ ...prev, [section]: true }));
//             }
//           },
//           { threshold: 0.1 },
//         );
//         observer.observe(element);
//         observers.push(observer);
//       }
//     });

//     return () => observers.forEach((obs) => obs.disconnect());
//   }, []);

//   const handleNewsletterSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return;

//     try {
//       await subscribeNewsletter({ email, source: "landing_page" }).unwrap();
//       setPopupMessage({
//         type: "success",
//         title: "🎉 Bienvenue !",
//         text: "Vous êtes maintenant inscrit à notre newsletter. Vous recevrez bientôt nos actualités et offres exclusives.",
//       });
//       setShowPopup(true);
//       setEmail("");
//     } catch (err) {
//       if (err?.data?.message?.includes("déjà inscrit")) {
//         setPopupMessage({
//           type: "info",
//           title: "📧 Déjà inscrit",
//           text: "Cette adresse email est déjà inscrite à notre newsletter.",
//         });
//       } else {
//         setPopupMessage({
//           type: "error",
//           title: "❌ Erreur",
//           text:
//             err?.data?.message ||
//             "Une erreur est survenue. Veuillez réessayer.",
//         });
//       }
//       setShowPopup(true);
//     }
//   };

//   return (
//     <div className="landing">
//       {/* ==================== HERO ==================== */}
//       <Hero />

//       {/* ==================== MISSION ==================== */}
//       <section
//         id="mission"
//         className={`mission ${isVisible.mission ? "visible" : ""}`}
//       >
//         <div className="mission__container">
//           <div className="mission__content">
//             <span className="section-label">Notre Mission</span>
//             <h2 className="mission__title">
//               Un océan plus propre,
//               <br />
//               <span>un produit à la fois</span>
//             </h2>
//             <p className="mission__text">
//               En Nouvelle-Calédonie, nous assistons chaque jour aux ravages du
//               plastique sur notre écosystème unique. Krysto est né de cette
//               urgence : transformer ce fléau en opportunité, créer de la valeur
//               à partir des déchets, et prouver qu'un autre modèle est possible.
//             </p>
//             <div className="mission__values">
//               <div className="mission__value">
//                 <div className="mission__value-icon">
//                   <FiGlobe />
//                 </div>
//                 <h4>Impact Local</h4>
//                 <p>
//                   Chaque déchet collecté est un pas vers un océan plus propre
//                 </p>
//               </div>
//               <div className="mission__value">
//                 <div className="mission__value-icon">
//                   <FiRefreshCw />
//                 </div>
//                 <h4>Économie Circulaire</h4>
//                 <p>Rien ne se perd, tout se transforme en objets durables</p>
//               </div>
//               <div className="mission__value">
//                 <div className="mission__value-icon">
//                   <FiHeart />
//                 </div>
//                 <h4>Artisanat Local</h4>
//                 <p>Fabriqué avec passion par des artisans calédoniens</p>
//               </div>
//             </div>
//           </div>
//           <div className="mission__visual">
//             <div className="mission__image-stack">
//               <div className="mission__image mission__image--1">
//                 <img
//                   src={`${process.env.PUBLIC_URL}/mission-1.jpg`}
//                   alt="Collecte de plastique océanique"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                     e.target.parentElement.classList.add(
//                       "mission__image--placeholder",
//                     );
//                   }}
//                 />
//               </div>
//               <div className="mission__image mission__image--2">
//                 <img
//                   src={`${process.env.PUBLIC_URL}/mission-2.jpg`}
//                   alt="Transformation du plastique"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                     e.target.parentElement.classList.add(
//                       "mission__image--placeholder",
//                     );
//                   }}
//                 />
//               </div>
//               <div className="mission__image-badge">
//                 <span>🇳🇨</span>
//                 <p>
//                   Fièrement
//                   <br />
//                   Calédonien
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== PRODUCTS ==================== */}
//       <section
//         id="products"
//         className={`products ${isVisible.products ? "visible" : ""}`}
//       >
//         <div className="products__container">
//           <div className="products__header">
//             <span className="section-label">Nos Créations</span>
//             <h2 className="products__title">
//               Des objets uniques,
//               <br />
//               <span>une seconde vie pour le plastique</span>
//             </h2>
//             <p className="products__subtitle">
//               Chaque produit raconte une histoire : celle du plastique sauvé de
//               l'océan, transformé par nos artisans en objet du quotidien.
//             </p>
//           </div>

//           <div className="products__grid">
//             {productsData?.products?.slice(0, 4).map((product, index) => (
//               <Link
//                 to={`/product/${product._id}`}
//                 key={product._id}
//                 className="product-card"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="product-card__image">
//                   <img
//                     src={
//                       product.images?.[0] ||
//                       `${process.env.PUBLIC_URL}/placeholder-product.jpg`
//                     }
//                     alt={product.name}
//                   />
//                   <div className="product-card__overlay">
//                     <span>Voir le produit</span>
//                     <FiArrowRight />
//                   </div>
//                   {product.isNew && (
//                     <span className="product-card__badge">Nouveau</span>
//                   )}
//                 </div>
//                 <div className="product-card__content">
//                   <span className="product-card__category">
//                     {product.subUniverse?.name || "Collection"}
//                   </span>
//                   <h3 className="product-card__name">{product.name}</h3>
//                   <div className="product-card__footer">
//                     <span className="product-card__price">
//                       {product.price?.toLocaleString()} XPF
//                     </span>
//                     <span className="product-card__eco">
//                       <FiDroplet /> {product.plasticWeight || 50}g recyclés
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             )) ||
//               [...Array(4)].map((_, i) => (
//                 <div key={i} className="product-card product-card--placeholder">
//                   <div className="product-card__image">
//                     <div className="placeholder-shimmer" />
//                   </div>
//                   <div className="product-card__content">
//                     <div className="placeholder-text" />
//                     <div className="placeholder-text placeholder-text--short" />
//                   </div>
//                 </div>
//               ))}
//           </div>

//           <div className="products__cta">
//             <Link to="/boutique" className="btn btn--large btn--secondary">
//               Voir toute la collection
//               <FiChevronRight />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ==================== PROCESS ==================== */}
//       <section
//         id="process"
//         className={`process ${isVisible.process ? "visible" : ""}`}
//       >
//         <div
//           className="process__bg"
//           style={{
//             backgroundImage: `url(${process.env.PUBLIC_URL}/process-bg.jpg)`,
//           }}
//         />
//         <div className="process__container">
//           <div className="process__header">
//             <span className="section-label section-label--light">
//               Notre Processus
//             </span>
//             <h2 className="process__title">
//               Du déchet à l'objet,
//               <br />
//               <span>une transformation vertueuse</span>
//             </h2>
//           </div>

//           <div className="process__timeline">
//             <div className="process__step">
//               <div className="process__step-number">01</div>
//               <div className="process__step-icon">🌊</div>
//               <h3>Collecte</h3>
//               <p>
//                 Nous récupérons le plastique sur les plages et dans les océans
//                 de Nouvelle-Calédonie
//               </p>
//             </div>

//             <div className="process__connector" />

//             <div className="process__step">
//               <div className="process__step-number">02</div>
//               <div className="process__step-icon">🔬</div>
//               <h3>Tri & Nettoyage</h3>
//               <p>
//                 Chaque déchet est trié par type de plastique, nettoyé et préparé
//               </p>
//             </div>

//             <div className="process__connector" />

//             <div className="process__step">
//               <div className="process__step-number">03</div>
//               <div className="process__step-icon">⚙️</div>
//               <h3>Transformation</h3>
//               <p>
//                 Le plastique est broyé, fondu et moulé dans notre atelier local
//               </p>
//             </div>

//             <div className="process__connector" />

//             <div className="process__step">
//               <div className="process__step-number">04</div>
//               <div className="process__step-icon">✨</div>
//               <h3>Création</h3>
//               <p>
//                 Nos artisans donnent vie à des objets uniques, durables et
//                 utiles
//               </p>
//             </div>
//           </div>

//           <div className="process__video-cta">
//             <button className="btn btn--glass btn--large">
//               <span>Voir notre atelier en vidéo</span>
//               <div className="btn__play">▶</div>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ==================== IMPACT ==================== */}
//       <section
//         id="impact"
//         className={`impact ${isVisible.impact ? "visible" : ""}`}
//       >
//         <div className="impact__container">
//           <div className="impact__header">
//             <span className="section-label">Notre Impact</span>
//             <h2 className="impact__title">
//               Ensemble, nous faisons
//               <br />
//               <span>la différence</span>
//             </h2>
//           </div>

//           <div className="impact__grid">
//             <div className="impact__card impact__card--large">
//               <div className="impact__card-icon">🌊</div>
//               <div className="impact__card-value">12,5</div>
//               <div className="impact__card-unit">tonnes</div>
//               <p>de plastique collecté depuis 2020</p>
//             </div>
//             <div className="impact__card">
//               <div className="impact__card-icon">🐢</div>
//               <div className="impact__card-value">850+</div>
//               <p>animaux marins protégés</p>
//             </div>
//             <div className="impact__card">
//               <div className="impact__card-icon">👥</div>
//               <div className="impact__card-value">15</div>
//               <p>emplois locaux créés</p>
//             </div>
//             <div className="impact__card">
//               <div className="impact__card-icon">🏖️</div>
//               <div className="impact__card-value">47</div>
//               <p>plages nettoyées</p>
//             </div>
//             <div className="impact__card">
//               <div className="impact__card-icon">♻️</div>
//               <div className="impact__card-value">98%</div>
//               <p>taux de recyclage</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== TESTIMONIALS ==================== */}
//       <section
//         id="testimonials"
//         className={`testimonials ${isVisible.testimonials ? "visible" : ""}`}
//       >
//         <div className="testimonials__container">
//           <div className="testimonials__header">
//             <span className="section-label">Témoignages</span>
//             <h2 className="testimonials__title">
//               Ce qu'ils disent
//               <br />
//               <span>de nos produits</span>
//             </h2>
//           </div>

//           <div className="testimonials__grid">
//             <div className="testimonial-card">
//               <div className="testimonial-card__stars">
//                 {[...Array(5)].map((_, i) => (
//                   <FiStar key={i} />
//                 ))}
//               </div>
//               <p className="testimonial-card__text">
//                 "Des produits magnifiques et une démarche qui a du sens. Je suis
//                 fière de contribuer à la protection de nos océans tout en ayant
//                 des objets uniques chez moi."
//               </p>
//               <div className="testimonial-card__author">
//                 <div className="testimonial-card__avatar">ML</div>
//                 <div>
//                   <strong>Marie L.</strong>
//                   <span>Nouméa</span>
//                 </div>
//               </div>
//             </div>

//             <div className="testimonial-card testimonial-card--featured">
//               <div className="testimonial-card__stars">
//                 {[...Array(5)].map((_, i) => (
//                   <FiStar key={i} />
//                 ))}
//               </div>
//               <p className="testimonial-card__text">
//                 "La qualité est exceptionnelle ! On ne dirait jamais que c'est
//                 du plastique recyclé. Krysto prouve qu'on peut allier écologie
//                 et esthétique. Bravo pour cette initiative !"
//               </p>
//               <div className="testimonial-card__author">
//                 <div className="testimonial-card__avatar">TR</div>
//                 <div>
//                   <strong>Thomas R.</strong>
//                   <span>Bourail</span>
//                 </div>
//               </div>
//             </div>

//             <div className="testimonial-card">
//               <div className="testimonial-card__stars">
//                 {[...Array(5)].map((_, i) => (
//                   <FiStar key={i} />
//                 ))}
//               </div>
//               <p className="testimonial-card__text">
//                 "J'ai offert un set de dessous de verre à ma famille en
//                 métropole. Ils ont adoré l'histoire derrière chaque pièce. Un
//                 cadeau qui a du sens !"
//               </p>
//               <div className="testimonial-card__author">
//                 <div className="testimonial-card__avatar">SM</div>
//                 <div>
//                   <strong>Sophie M.</strong>
//                   <span>Koné</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== NEWSLETTER ==================== */}
//       <section
//         id="newsletter"
//         className={`newsletter ${isVisible.newsletter ? "visible" : ""}`}
//       >
//         <div className="newsletter__container">
//           <div className="newsletter__content">
//             <div className="newsletter__icon">📬</div>
//             <h2 className="newsletter__title">Rejoignez le mouvement</h2>
//             <p className="newsletter__text">
//               Recevez nos actualités, nouveaux produits et offres exclusives.
//               Ensemble, construisons un avenir plus durable pour la
//               Nouvelle-Calédonie.
//             </p>
//             <form
//               className="newsletter__form"
//               onSubmit={handleNewsletterSubmit}
//             >
//               <div className="newsletter__input-wrapper">
//                 <FiMail className="newsletter__input-icon" />
//                 <input
//                   type="email"
//                   placeholder="Votre adresse email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 disabled={isSubscribing}
//               >
//                 {isSubscribing ? "..." : "S'inscrire"}
//                 <FiArrowRight />
//               </button>
//             </form>
//             <p className="newsletter__privacy">
//               <FiCheck /> Pas de spam, uniquement du contenu de qualité
//             </p>
//           </div>
//           <div className="newsletter__visual">
//             <div className="newsletter__blob" />
//           </div>
//         </div>
//       </section>

//       {/* ==================== POPUP MODAL ==================== */}
//       {showPopup && (
//         <div className="popup-overlay" onClick={() => setShowPopup(false)}>
//           <div
//             className={`popup popup--${popupMessage.type}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="popup__close"
//               onClick={() => setShowPopup(false)}
//             >
//               <FiX />
//             </button>
//             <div className="popup__icon">
//               {popupMessage.type === "success" && "✅"}
//               {popupMessage.type === "info" && "ℹ️"}
//               {popupMessage.type === "error" && "❌"}
//             </div>
//             <h3 className="popup__title">{popupMessage.title}</h3>
//             <p className="popup__text">{popupMessage.text}</p>
//             <button
//               className="btn btn--primary popup__btn"
//               onClick={() => setShowPopup(false)}
//             >
//               Compris !
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomeScreen;

import Hero from "../../../components/public/Hero";
import UniverseCarousel from "../../../components/public/UniverseCarousel";

const HomeScreen = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <Hero />

      {/* Universe Carousel */}
      <UniverseCarousel />

      {/* Autres sections à venir... */}
    </div>
  );
};

export default HomeScreen;
