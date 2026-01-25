import {
  FiLayout,
  FiType,
  FiImage,
  FiMousePointer,
  FiMinus,
  FiGrid,
  FiShare2,
  FiTag,
  FiShoppingBag,
  FiCode,
  FiAlignLeft,
  FiSquare,
} from "react-icons/fi";
import "./BlockPanel.css";

const BLOCK_ICONS = {
  header: FiLayout,
  text: FiType,
  image: FiImage,
  button: FiMousePointer,
  divider: FiMinus,
  spacer: FiSquare,
  social: FiShare2,
  "promo-code": FiTag,
  "product-card": FiShoppingBag,
  columns: FiGrid,
  footer: FiAlignLeft,
  html: FiCode,
};

const BLOCK_LABELS = {
  header: { label: "En-tête", description: "Logo, titre et sous-titre" },
  text: { label: "Texte", description: "Paragraphe de texte" },
  image: { label: "Image", description: "Image avec lien optionnel" },
  button: { label: "Bouton", description: "Bouton d'action" },
  divider: { label: "Séparateur", description: "Ligne horizontale" },
  spacer: { label: "Espace", description: "Espace vide" },
  social: { label: "Réseaux sociaux", description: "Liens sociaux" },
  "promo-code": { label: "Code promo", description: "Code promotionnel" },
  "product-card": { label: "Produit", description: "Carte produit" },
  columns: { label: "Colonnes", description: "Mise en page colonnes" },
  footer: { label: "Pied de page", description: "Footer avec liens" },
  html: { label: "HTML", description: "Code HTML personnalisé" },
};

const BLOCK_CATEGORIES = [
  {
    name: "Structure",
    blocks: ["header", "footer", "columns", "divider", "spacer"],
  },
  {
    name: "Contenu",
    blocks: ["text", "image", "button"],
  },
  {
    name: "E-commerce",
    blocks: ["promo-code", "product-card"],
  },
  {
    name: "Avancé",
    blocks: ["social", "html"],
  },
];

const BlockPanel = ({ blockTypes, onAddBlock }) => {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("blockType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="block-panel">
      <p className="block-panel__hint">
        Cliquez ou glissez un bloc pour l'ajouter
      </p>

      {BLOCK_CATEGORIES.map((category) => (
        <div key={category.name} className="block-category">
          <h4 className="block-category__title">{category.name}</h4>
          <div className="block-category__grid">
            {category.blocks.map((type) => {
              const Icon = BLOCK_ICONS[type] || FiSquare;
              const label = BLOCK_LABELS[type] || {
                label: type,
                description: "",
              };

              return (
                <button
                  key={type}
                  className="block-item"
                  onClick={() => onAddBlock(type)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  title={label.description}
                >
                  <div className="block-item__icon">
                    <Icon />
                  </div>
                  <span className="block-item__label">{label.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockPanel;
