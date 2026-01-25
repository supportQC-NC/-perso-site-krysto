import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiChevronLeft,
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiChevronDown,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";
import { useCreateContactMutation } from "../../../slices/contactApiSlice";
import * as THREE from "three";
import "./ContactScreen.css";

const ContactScreen = () => {
  const canvasRef = useRef(null);

  // Form state - tous les champs du modèle
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // API
  const [createContact, { isLoading }] = useCreateContactMutation();

  // Options du dropdown sujet (depuis le modèle)
  const subjectOptions = [
    { value: "", label: "Sélectionnez un sujet...", disabled: true },
    { value: "information", label: "Demande d'information" },
    { value: "commande", label: "Question sur une commande" },
    { value: "partenariat", label: "Proposition de partenariat" },
    { value: "presse", label: "Contact presse" },
    { value: "autre", label: "Autre" },
  ];

  // Three.js Background
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

    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixRatio = Math.random();
      colors[i * 3] = 0.06 + mixRatio * 0.35;
      colors[i * 3 + 1] = 0.73 + mixRatio * 0.18;
      colors[i * 3 + 2] = 0.51 + mixRatio * 0.47;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 5;

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0003;
      particles.rotation.x += mouseY * 0.0002;
      particles.rotation.y += mouseX * 0.0002;
      renderer.render(scene, camera);
    };
    animate();

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

  // Validation selon le modèle
  const validateForm = () => {
    const newErrors = {};

    // name: required, max 100
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    } else if (formData.name.length > 100) {
      newErrors.name = "Le nom ne peut pas dépasser 100 caractères";
    }

    // email: required, format
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Veuillez fournir un email valide";
    }

    // subject: required, enum
    if (!formData.subject) {
      newErrors.subject = "Le sujet est obligatoire";
    }

    // message: required, max 1000
    if (!formData.message.trim()) {
      newErrors.message = "Le message est obligatoire";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Le message ne peut pas dépasser 1000 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createContact(formData).unwrap();
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <FiMapPin />,
      title: "Adresse",
      content: "Nouméa, Nouvelle-Calédonie",
      link: null,
    },
    {
      icon: <FiMail />,
      title: "Email",
      content: "contact@krysto.nc",
      link: "mailto:contact@krysto.nc",
    },
    {
      icon: <FiPhone />,
      title: "Téléphone",
      content: "+687 XX XX XX",
      link: "tel:+687XXXXXX",
    },
    {
      icon: <FiClock />,
      title: "Horaires",
      content: "Lun - Ven : 8h - 17h",
      link: null,
    },
  ];

  return (
    <div className="contact">
      {/* ==================== HERO ==================== */}
      <section className="contact__hero">
        <canvas ref={canvasRef} className="contact__hero-canvas" />
        <div className="contact__hero-bg">
          <img src="/images/contact-hero.webp" alt="" />
        </div>
        <div className="contact__hero-overlay"></div>
        <div className="contact__hero-content">
          <Link to="/" className="contact__back-btn">
            <FiChevronLeft />
            <span>Accueil</span>
          </Link>
          <h1 className="contact__hero-title">
            <span className="contact__hero-title-line">Parlons de</span>
            <span className="contact__hero-title-highlight">votre projet</span>
          </h1>
          <p className="contact__hero-subtitle">
            Une question, une idée, un partenariat ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      {/* ==================== MAIN ==================== */}
      <section className="contact__main">
        <div className="contact__container">
          {/* Info Column */}
          <div className="contact__info">
            <div className="contact__info-header">
              <span className="contact__label">Nos coordonnées</span>
              <h2 className="contact__info-title">
                Restons en <span>contact</span>
              </h2>
              <p className="contact__info-desc">
                N'hésitez pas à nous contacter pour toute question. Notre équipe
                vous répondra dans les plus brefs délais.
              </p>
            </div>

            <div className="contact__info-cards">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact__info-card">
                  <div className="contact__info-icon">{item.icon}</div>
                  <div className="contact__info-content">
                    <h3>{item.title}</h3>
                    {item.link ? (
                      <a href={item.link}>{item.content}</a>
                    ) : (
                      <p>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact__social">
              <p>Suivez-nous sur les réseaux</p>
              <div className="contact__social-links">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FiInstagram />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FiFacebook />
                </a>
              </div>
            </div>

            <div
              className="contact__map"
              style={{ position: "relative", height: "400px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7384.352088591662!2d166.4468350698423!3d-22.271320258505643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6c27e378b6573389%3A0x1eb6c50938e540e7!2sKrysto!5e0!3m2!1sfr!2sfr!4v1769317577372!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte Krysto Nouméa"
              ></iframe>

              {/* <div
                className="contact__map-overlay"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  //   background: "rgba(255,255,255,0.8)",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  background: "transparent",
                }}
              > */}
              <FiMapPin />
              <span>Nouméa, NC</span>
              {/* </div> */}
            </div>
          </div>

          {/* Form Column */}
          <div className="contact__form-wrapper">
            <div className="contact__form-header">
              <span className="contact__label">Formulaire</span>
              <h2 className="contact__form-title">
                Envoyez-nous un <span>message</span>
              </h2>
            </div>

            {/* Alerts */}
            {submitStatus === "success" && (
              <div className="contact__alert contact__alert--success">
                <FiCheck />
                <div>
                  <strong>Message envoyé avec succès !</strong>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="contact__alert contact__alert--error">
                <FiAlertCircle />
                <div>
                  <strong>Erreur d'envoi</strong>
                  <p>Une erreur est survenue. Veuillez réessayer.</p>
                </div>
              </div>
            )}

            <form className="contact__form" onSubmit={handleSubmit}>
              {/* Nom */}
              <div
                className={`contact__form-group ${errors.name ? "has-error" : ""}`}
              >
                <label htmlFor="name">
                  <FiUser />
                  Nom complet <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                  maxLength={100}
                />
                {errors.name && (
                  <span className="contact__form-error">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div
                className={`contact__form-group ${errors.email ? "has-error" : ""}`}
              >
                <label htmlFor="email">
                  <FiMail />
                  Adresse email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <span className="contact__form-error">{errors.email}</span>
                )}
              </div>

              {/* Téléphone */}
              <div className="contact__form-group">
                <label htmlFor="phone">
                  <FiPhone />
                  Téléphone <span className="optional">(optionnel)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+687 XX XX XX"
                />
              </div>

              {/* Sujet - Dropdown */}
              <div
                className={`contact__form-group ${errors.subject ? "has-error" : ""}`}
              >
                <label htmlFor="subject">
                  <FiMessageSquare />
                  Sujet <span className="required">*</span>
                </label>
                <div className="contact__select-wrapper">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    {subjectOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="contact__select-icon" />
                </div>
                {errors.subject && (
                  <span className="contact__form-error">{errors.subject}</span>
                )}
              </div>

              {/* Message */}
              <div
                className={`contact__form-group ${errors.message ? "has-error" : ""}`}
              >
                <label htmlFor="message">
                  <FiMessageSquare />
                  Votre message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows={6}
                  maxLength={1000}
                />
                <div className="contact__form-counter">
                  <span
                    className={formData.message.length > 900 ? "warning" : ""}
                  >
                    {formData.message.length}
                  </span>
                  /1000 caractères
                </div>
                {errors.message && (
                  <span className="contact__form-error">{errors.message}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="contact__form-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="contact__spinner"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Envoyer le message
                  </>
                )}
              </button>

              <p className="contact__form-privacy">
                En soumettant ce formulaire, vous acceptez que vos données
                soient traitées conformément à notre politique de
                confidentialité.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="contact__faq">
        <div className="contact__faq-container">
          <div className="contact__faq-header">
            <span className="contact__label contact__label--center">FAQ</span>
            <h2 className="contact__faq-title">
              Questions <span>fréquentes</span>
            </h2>
          </div>
          <div className="contact__faq-grid">
            <div className="contact__faq-item">
              <h3>🌊 Quels types de plastique recyclés utilisez-vous ?</h3>
              <p>
                Nous utilisons principalement le HDPE, PP et PET collectés
                localement sur les plages et auprès de nos partenaires en
                Nouvelle-Calédonie.
              </p>
            </div>
            <div className="contact__faq-item">
              <h3>🎨 Proposez-vous des créations sur mesure ?</h3>
              <p>
                Oui ! Contactez-nous avec votre projet via le formulaire en
                sélectionnant "Partenariat" et nous étudierons sa faisabilité.
              </p>
            </div>
            <div className="contact__faq-item">
              <h3>♻️ Comment puis-je participer à la collecte ?</h3>
              <p>
                Vous pouvez déposer vos plastiques dans nos points de collecte
                ou nous contacter pour organiser une collecte groupée.
              </p>
            </div>
            <div className="contact__faq-item">
              <h3>📦 Livrez-vous en dehors de la Nouvelle-Calédonie ?</h3>
              <p>
                Actuellement, nous livrons uniquement en Nouvelle-Calédonie.
                Contactez-nous pour des demandes spéciales à l'international.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactScreen;
