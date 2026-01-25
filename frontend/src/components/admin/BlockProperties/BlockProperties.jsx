import { useState } from "react";
import {
  FiX,
  FiTrash2,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import "./BlockProperties.css";

const BlockProperties = ({
  block,
  onUpdateData,
  onUpdateStyles,
  onDelete,
  onDuplicate,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({
    content: true,
    style: true,
    spacing: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Render input basé sur le type
  const renderInput = (label, value, onChange, type = "text", options = {}) => {
    const { placeholder, min, max, step, choices } = options;

    return (
      <div className="property-field">
        <label>{label}</label>
        {type === "select" ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        ) : type === "color" ? (
          <div className="color-input">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        ) : type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
        ) : type === "number" ? (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        ) : type === "checkbox" ? (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span>{placeholder}</span>
          </label>
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  // Render les propriétés spécifiques à chaque type de bloc
  const renderBlockProperties = () => {
    switch (block.type) {
      case "header":
        return (
          <>
            {renderInput("Titre", block.data.title, (v) =>
              onUpdateData({ title: v }),
            )}
            {renderInput("Sous-titre", block.data.subtitle, (v) =>
              onUpdateData({ subtitle: v }),
            )}
            {renderInput(
              "URL du logo",
              block.data.logoUrl,
              (v) => onUpdateData({ logoUrl: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput(
              "Largeur logo (px)",
              block.data.logoWidth,
              (v) => onUpdateData({ logoWidth: v }),
              "number",
              { min: 50, max: 300 },
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                ],
              },
            )}
            {renderInput(
              "Couleur de fond",
              block.data.backgroundColor,
              (v) => onUpdateData({ backgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur titre",
              block.data.titleColor,
              (v) => onUpdateData({ titleColor: v }),
              "color",
            )}
            {renderInput(
              "Taille titre (px)",
              block.data.titleFontSize,
              (v) => onUpdateData({ titleFontSize: v }),
              "number",
              { min: 14, max: 48 },
            )}
            {renderInput(
              "Couleur sous-titre",
              block.data.subtitleColor,
              (v) => onUpdateData({ subtitleColor: v }),
              "color",
            )}
            {renderInput(
              "Afficher icône",
              block.data.showIcon,
              (v) => onUpdateData({ showIcon: v }),
              "checkbox",
            )}
            {block.data.showIcon &&
              renderInput(
                "Icône (emoji)",
                block.data.icon,
                (v) => onUpdateData({ icon: v }),
                "text",
                { placeholder: "📬" },
              )}
          </>
        );

      case "text":
        return (
          <>
            {renderInput(
              "Contenu (HTML)",
              block.data.content,
              (v) => onUpdateData({ content: v }),
              "textarea",
              { placeholder: "<p>Votre texte...</p>" },
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                  { value: "justify", label: "Justifié" },
                ],
              },
            )}
            {renderInput(
              "Couleur du texte",
              block.data.textColor,
              (v) => onUpdateData({ textColor: v }),
              "color",
            )}
            {renderInput(
              "Taille (px)",
              block.data.fontSize,
              (v) => onUpdateData({ fontSize: v }),
              "number",
              { min: 10, max: 32 },
            )}
            {renderInput(
              "Hauteur de ligne",
              block.data.lineHeight,
              (v) => onUpdateData({ lineHeight: v }),
              "number",
              { min: 1, max: 3, step: 0.1 },
            )}
          </>
        );

      case "image":
        return (
          <>
            {renderInput(
              "URL de l'image",
              block.data.src,
              (v) => onUpdateData({ src: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput("Texte alternatif", block.data.alt, (v) =>
              onUpdateData({ alt: v }),
            )}
            {renderInput("Légende", block.data.caption, (v) =>
              onUpdateData({ caption: v }),
            )}
            {renderInput(
              "Lien (URL)",
              block.data.linkUrl,
              (v) => onUpdateData({ linkUrl: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                ],
              },
            )}
            {renderInput(
              "Largeur max (px)",
              block.data.maxWidth,
              (v) => onUpdateData({ maxWidth: v }),
              "number",
              { min: 100, max: 600 },
            )}
            {renderInput(
              "Arrondi (px)",
              block.data.borderRadius,
              (v) => onUpdateData({ borderRadius: v }),
              "number",
              { min: 0, max: 50 },
            )}
          </>
        );

      case "button":
        return (
          <>
            {renderInput("Texte du bouton", block.data.text, (v) =>
              onUpdateData({ text: v }),
            )}
            {renderInput(
              "URL du lien",
              block.data.url,
              (v) => onUpdateData({ url: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                ],
              },
            )}
            {renderInput(
              "Pleine largeur",
              block.data.fullWidth,
              (v) => onUpdateData({ fullWidth: v }),
              "checkbox",
            )}
            {renderInput(
              "Couleur de fond",
              block.data.backgroundColor,
              (v) => onUpdateData({ backgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur du texte",
              block.data.textColor,
              (v) => onUpdateData({ textColor: v }),
              "color",
            )}
            {renderInput(
              "Taille (px)",
              block.data.fontSize,
              (v) => onUpdateData({ fontSize: v }),
              "number",
              { min: 12, max: 24 },
            )}
            {renderInput(
              "Arrondi (px)",
              block.data.borderRadius,
              (v) => onUpdateData({ borderRadius: v }),
              "number",
              { min: 0, max: 50 },
            )}
            {renderInput(
              "Padding V (px)",
              block.data.paddingVertical,
              (v) => onUpdateData({ paddingVertical: v }),
              "number",
              { min: 5, max: 30 },
            )}
            {renderInput(
              "Padding H (px)",
              block.data.paddingHorizontal,
              (v) => onUpdateData({ paddingHorizontal: v }),
              "number",
              { min: 10, max: 60 },
            )}
          </>
        );

      case "divider":
        return (
          <>
            {renderInput(
              "Style",
              block.data.style,
              (v) => onUpdateData({ style: v }),
              "select",
              {
                choices: [
                  { value: "solid", label: "Plein" },
                  { value: "dashed", label: "Tirets" },
                  { value: "dotted", label: "Points" },
                ],
              },
            )}
            {renderInput(
              "Couleur",
              block.data.color,
              (v) => onUpdateData({ color: v }),
              "color",
            )}
            {renderInput(
              "Épaisseur (px)",
              block.data.thickness,
              (v) => onUpdateData({ thickness: v }),
              "number",
              { min: 1, max: 10 },
            )}
            {renderInput(
              "Largeur",
              block.data.width,
              (v) => onUpdateData({ width: v }),
              "text",
              { placeholder: "100% ou 200px" },
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                ],
              },
            )}
          </>
        );

      case "spacer":
        return (
          <>
            {renderInput(
              "Hauteur (px)",
              block.data.height,
              (v) => onUpdateData({ height: v }),
              "number",
              { min: 10, max: 200 },
            )}
          </>
        );

      case "promo-code":
        return (
          <>
            {renderInput("Code promo", block.data.code, (v) =>
              onUpdateData({ code: v }),
            )}
            {renderInput("Description", block.data.description, (v) =>
              onUpdateData({ description: v }),
            )}
            {renderInput(
              "Réduction",
              block.data.discount,
              (v) => onUpdateData({ discount: v }),
              "text",
              { placeholder: "-20%" },
            )}
            {renderInput(
              "Afficher expiration",
              block.data.showExpiry,
              (v) => onUpdateData({ showExpiry: v }),
              "checkbox",
            )}
            {renderInput(
              "Couleur de fond",
              block.data.backgroundColor,
              (v) => onUpdateData({ backgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur bordure",
              block.data.borderColor,
              (v) => onUpdateData({ borderColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur du code",
              block.data.codeColor,
              (v) => onUpdateData({ codeColor: v }),
              "color",
            )}
          </>
        );

      case "product-card":
        return (
          <>
            {renderInput(
              "URL de l'image",
              block.data.imageUrl,
              (v) => onUpdateData({ imageUrl: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput("Nom du produit", block.data.name, (v) =>
              onUpdateData({ name: v }),
            )}
            {renderInput(
              "Description",
              block.data.description,
              (v) => onUpdateData({ description: v }),
              "textarea",
            )}
            {renderInput(
              "Prix",
              block.data.price,
              (v) => onUpdateData({ price: v }),
              "text",
              { placeholder: "2 500 XPF" },
            )}
            {renderInput(
              "Ancien prix",
              block.data.oldPrice,
              (v) => onUpdateData({ oldPrice: v }),
              "text",
              { placeholder: "3 000 XPF" },
            )}
            {renderInput(
              "Afficher prix",
              block.data.showPrice,
              (v) => onUpdateData({ showPrice: v }),
              "checkbox",
            )}
            {renderInput("Texte du bouton", block.data.buttonText, (v) =>
              onUpdateData({ buttonText: v }),
            )}
            {renderInput(
              "URL du bouton",
              block.data.buttonUrl,
              (v) => onUpdateData({ buttonUrl: v }),
              "text",
              { placeholder: "https://..." },
            )}
            {renderInput(
              "Afficher bouton",
              block.data.showButton,
              (v) => onUpdateData({ showButton: v }),
              "checkbox",
            )}
          </>
        );

      case "footer":
        return (
          <>
            {renderInput("Nom entreprise", block.data.companyName, (v) =>
              onUpdateData({ companyName: v }),
            )}
            {renderInput("Adresse", block.data.companyAddress, (v) =>
              onUpdateData({ companyAddress: v }),
            )}
            {renderInput(
              "Lien désabonnement",
              block.data.showUnsubscribe,
              (v) => onUpdateData({ showUnsubscribe: v }),
              "checkbox",
            )}
            {renderInput(
              "Texte désabonnement",
              block.data.unsubscribeText,
              (v) => onUpdateData({ unsubscribeText: v }),
            )}
            {renderInput(
              "Alignement",
              block.data.alignment,
              (v) => onUpdateData({ alignment: v }),
              "select",
              {
                choices: [
                  { value: "left", label: "Gauche" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Droite" },
                ],
              },
            )}
            {renderInput(
              "Couleur de fond",
              block.data.backgroundColor,
              (v) => onUpdateData({ backgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur texte",
              block.data.textColor,
              (v) => onUpdateData({ textColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur liens",
              block.data.linkColor,
              (v) => onUpdateData({ linkColor: v }),
              "color",
            )}
          </>
        );

      case "html":
        return (
          <>
            {renderInput(
              "Code HTML",
              block.data.content,
              (v) => onUpdateData({ content: v }),
              "textarea",
              { placeholder: "<div>...</div>" },
            )}
          </>
        );

      default:
        return <p className="no-properties">Aucune propriété disponible</p>;
    }
  };

  return (
    <div className="block-properties">
      {/* Header */}
      <div className="properties-header">
        <h3>Propriétés</h3>
        <button className="properties-close" onClick={onClose}>
          <FiX />
        </button>
      </div>

      {/* Block Type */}
      <div className="properties-type">
        <span className="properties-type__label">{block.type}</span>
        <div className="properties-type__actions">
          <button onClick={onDuplicate} title="Dupliquer">
            <FiCopy />
          </button>
          <button onClick={onDelete} className="btn-danger" title="Supprimer">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="properties-section">
        <button
          className="properties-section__header"
          onClick={() => toggleSection("content")}
        >
          <span>Contenu</span>
          {openSections.content ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.content && (
          <div className="properties-section__content">
            {renderBlockProperties()}
          </div>
        )}
      </div>

      {/* Style Section */}
      <div className="properties-section">
        <button
          className="properties-section__header"
          onClick={() => toggleSection("style")}
        >
          <span>Style du bloc</span>
          {openSections.style ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.style && (
          <div className="properties-section__content">
            {renderInput(
              "Couleur de fond",
              block.styles?.backgroundColor,
              (v) => onUpdateStyles({ backgroundColor: v }),
              "color",
            )}
          </div>
        )}
      </div>

      {/* Spacing Section */}
      <div className="properties-section">
        <button
          className="properties-section__header"
          onClick={() => toggleSection("spacing")}
        >
          <span>Espacement</span>
          {openSections.spacing ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.spacing && (
          <div className="properties-section__content">
            <div className="spacing-grid">
              {renderInput(
                "Haut",
                block.styles?.paddingTop,
                (v) => onUpdateStyles({ paddingTop: v }),
                "number",
                { min: 0, max: 100 },
              )}
              {renderInput(
                "Bas",
                block.styles?.paddingBottom,
                (v) => onUpdateStyles({ paddingBottom: v }),
                "number",
                { min: 0, max: 100 },
              )}
              {renderInput(
                "Gauche",
                block.styles?.paddingLeft,
                (v) => onUpdateStyles({ paddingLeft: v }),
                "number",
                { min: 0, max: 100 },
              )}
              {renderInput(
                "Droite",
                block.styles?.paddingRight,
                (v) => onUpdateStyles({ paddingRight: v }),
                "number",
                { min: 0, max: 100 },
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockProperties;
