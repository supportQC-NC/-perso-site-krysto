import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateContactMutation } from "../../slices/contactApiSlice";
import FormInput from "../../components/Form/FormInput";
import FormTextarea from "../../components/Form/FormTextarea";
import FormSelect from "../../components/Form/FormSelect";
import FormButton from "../../components/Form/FormButton";
import "./ContactScreen.css";

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const { name, email, phone, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createContact(formData).unwrap();
      toast.success(
        "Message envoyé avec succès ! Nous vous répondrons rapidement.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi du message");
    }
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contactez-nous</h1>
          <p>
            Une question, une suggestion ou envie de collaborer ? N'hésitez pas
            à nous écrire !
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-grid">
          <div className="contact-form-wrapper">
            <h2>Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <FormInput
                  label="Nom complet"
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  icon="👤"
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  icon="📧"
                  required
                />
              </div>

              <div className="form-row">
                <FormInput
                  label="Téléphone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  placeholder="00 00 00"
                  icon="📱"
                />
                <FormSelect
                  label="Sujet"
                  name="subject"
                  value={subject}
                  onChange={handleChange}
                  options={[
                    { value: "information", label: "Demande d'information" },
                    { value: "commande", label: "Question sur une commande" },
                    {
                      value: "partenariat",
                      label: "Proposition de partenariat",
                    },
                    { value: "presse", label: "Contact presse" },
                    { value: "autre", label: "Autre" },
                  ]}
                  required
                />
              </div>

              <FormTextarea
                label="Votre message"
                name="message"
                value={message}
                onChange={handleChange}
                placeholder="Décrivez votre demande..."
                rows={6}
                maxLength={1000}
                required
              />

              <FormButton type="submit" isLoading={isLoading}>
                Envoyer le message
              </FormButton>
            </form>
          </div>

          <div className="contact-info-wrapper">
            <h2>Nos coordonnées</h2>

            <div className="contact-info-card">
              <div className="contact-info-item">
                <span className="contact-info-icon">📍</span>
                <div>
                  <h3>Adresse</h3>
                  <p>
                    123 Rue de l'Environnement
                    <br />
                    98800 Nouméa
                    <br />
                    Nouvelle-Calédonie
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:contact@krysto.nc">contact@krysto.nc</a>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">📱</span>
                <div>
                  <h3>Téléphone</h3>
                  <p>
                    <a href="tel:+687000000">+687 00 00 00</a>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">🕐</span>
                <div>
                  <h3>Horaires</h3>
                  <p>
                    Lundi - Vendredi : 8h - 17h
                    <br />
                    Samedi : 8h - 12h
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <h3>Suivez-nous</h3>
              <div className="social-links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  📘 Facebook
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  📸 Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-faq">
        <h2>Questions fréquentes</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>🚚 Quels sont les délais de livraison ?</h3>
            <p>
              Les livraisons sont effectuées sous 3 à 5 jours ouvrés sur Nouméa
              et ses environs.
            </p>
          </div>
          <div className="faq-item">
            <h3>♻️ Comment sont fabriqués vos produits ?</h3>
            <p>
              Tous nos produits sont fabriqués à partir de plastique recyclé
              collecté localement en Nouvelle-Calédonie.
            </p>
          </div>
          <div className="faq-item">
            <h3>🤝 Peut-on visiter votre atelier ?</h3>
            <p>
              Oui ! Nous organisons des visites sur rendez-vous. Contactez-nous
              pour en savoir plus.
            </p>
          </div>
          <div className="faq-item">
            <h3>💳 Quels moyens de paiement acceptez-vous ?</h3>
            <p>
              Nous acceptons les paiements par carte bancaire, PayPal, virement
              et espèces à la livraison.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactScreen;
