import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiCopy,
  FiChevronUp,
  FiChevronDown,
  FiMove,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import "./BlockCanvas.css";

const BlockCanvas = ({
  blocks,
  settings,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onReorderBlocks,
  viewMode,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Drag & Drop depuis le panel
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType");
    if (blockType) {
      onAddBlock(blockType, index);
    }
    setDragOverIndex(null);
  };

  // Drag & Drop réorganisation
  const handleBlockDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleBlockDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null) return;
    if (index !== draggingIndex) {
      setDragOverIndex(index);
    }
  };

  const handleBlockDrop = (e, index) => {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      onReorderBlocks(draggingIndex, index);
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleBlockDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  // Rendu d'un bloc
  const renderBlockContent = (block) => {
    switch (block.type) {
      case "header":
        return (
          <div
            className="block-preview block-preview--header"
            style={{
              backgroundColor: block.data.backgroundColor || "#2d6a4f",
              textAlign: block.data.alignment || "center",
            }}
          >
            {block.data.logoUrl && (
              <img
                src={block.data.logoUrl}
                alt={block.data.logoAlt || "Logo"}
                style={{
                  maxWidth: block.data.logoWidth || 150,
                  marginBottom: 10,
                }}
              />
            )}
            {block.data.showIcon && (
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>
                {block.data.icon || "📬"}
              </div>
            )}
            <h2
              style={{
                color: block.data.titleColor || "#ffffff",
                fontSize: block.data.titleFontSize || 28,
                margin: 0,
              }}
            >
              {block.data.title || "Titre de l'email"}
            </h2>
            {block.data.subtitle && (
              <p
                style={{
                  color: block.data.subtitleColor || "#e0e0e0",
                  fontSize: block.data.subtitleFontSize || 16,
                  margin: "8px 0 0",
                }}
              >
                {block.data.subtitle}
              </p>
            )}
          </div>
        );

      case "text":
        return (
          <div
            className="block-preview block-preview--text"
            style={{
              textAlign: block.data.alignment || "left",
              color: block.data.textColor || "#333333",
              fontSize: block.data.fontSize || 16,
              lineHeight: block.data.lineHeight || 1.6,
            }}
            dangerouslySetInnerHTML={{
              __html: block.data.content || "<p>Votre texte ici...</p>",
            }}
          />
        );

      case "image":
        return (
          <div
            className="block-preview block-preview--image"
            style={{ textAlign: block.data.alignment || "center" }}
          >
            {block.data.src ? (
              <img
                src={block.data.src}
                alt={block.data.alt || "Image"}
                style={{
                  maxWidth: "100%",
                  borderRadius: block.data.borderRadius || 8,
                }}
              />
            ) : (
              <div className="image-placeholder">
                <span>📷</span>
                <p>Ajouter une image</p>
              </div>
            )}
            {block.data.caption && (
              <p
                style={{
                  color: block.data.captionColor || "#666",
                  fontSize: 14,
                  marginTop: 8,
                }}
              >
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case "button":
        return (
          <div
            className="block-preview block-preview--button"
            style={{ textAlign: block.data.alignment || "center" }}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: block.data.fullWidth ? "block" : "inline-block",
                backgroundColor: block.data.backgroundColor || "#2d6a4f",
                color: block.data.textColor || "#ffffff",
                fontSize: block.data.fontSize || 16,
                fontWeight: block.data.fontWeight || "bold",
                padding: `${block.data.paddingVertical || 14}px ${block.data.paddingHorizontal || 32}px`,
                borderRadius: block.data.borderRadius || 25,
                textDecoration: "none",
              }}
            >
              {block.data.text || "Cliquez ici"}
            </a>
          </div>
        );

      case "divider":
        return (
          <div
            className="block-preview block-preview--divider"
            style={{ textAlign: block.data.alignment || "center" }}
          >
            <hr
              style={{
                border: "none",
                borderTop: `${block.data.thickness || 1}px ${block.data.style || "solid"} ${block.data.color || "#e0e0e0"}`,
                width: block.data.width || "100%",
                margin: block.data.alignment === "center" ? "0 auto" : 0,
              }}
            />
          </div>
        );

      case "spacer":
        return (
          <div
            className="block-preview block-preview--spacer"
            style={{ height: block.data.height || 30 }}
          >
            <span className="spacer-label">{block.data.height || 30}px</span>
          </div>
        );

      case "promo-code":
        return (
          <div
            className="block-preview block-preview--promo"
            style={{
              backgroundColor: block.data.backgroundColor || "#fff8e1",
              borderColor: block.data.borderColor || "#ffc107",
            }}
          >
            <p className="promo-description">
              {block.data.description || "Votre code promo exclusif"}
            </p>
            <p
              className="promo-code"
              style={{ color: block.data.codeColor || "#e53935" }}
            >
              {block.data.code || "CODE10"}
            </p>
            {block.data.discount && (
              <p className="promo-discount">{block.data.discount}</p>
            )}
          </div>
        );

      case "product-card":
        return (
          <div className="block-preview block-preview--product">
            {block.data.imageUrl ? (
              <img src={block.data.imageUrl} alt={block.data.name} />
            ) : (
              <div className="product-image-placeholder">🛍️</div>
            )}
            <h4>{block.data.name || "Nom du produit"}</h4>
            {block.data.description && <p>{block.data.description}</p>}
            {block.data.showPrice && block.data.price && (
              <p className="product-price">
                {block.data.oldPrice && (
                  <span className="old-price">{block.data.oldPrice}</span>
                )}
                {block.data.price}
              </p>
            )}
            {block.data.showButton && (
              <button className="product-btn">
                {block.data.buttonText || "Voir le produit"}
              </button>
            )}
          </div>
        );

      case "social":
        return (
          <div
            className="block-preview block-preview--social"
            style={{ textAlign: block.data.alignment || "center" }}
          >
            <div className="social-icons">
              {block.data.links?.length > 0 ? (
                block.data.links
                  .filter((l) => l.enabled)
                  .map((link, i) => (
                    <span key={i} className="social-icon">
                      {link.platform === "facebook" && "📘"}
                      {link.platform === "instagram" && "📸"}
                      {link.platform === "twitter" && "🐦"}
                      {link.platform === "linkedin" && "💼"}
                      {link.platform === "youtube" && "▶️"}
                      {link.platform === "email" && "✉️"}
                      {link.platform === "website" && "🌐"}
                    </span>
                  ))
              ) : (
                <span className="social-placeholder">
                  Ajouter des réseaux sociaux
                </span>
              )}
            </div>
          </div>
        );

      case "columns":
        return (
          <div
            className="block-preview block-preview--columns"
            style={{ gap: block.data.gap || 20 }}
          >
            {(block.data.columns || [{ type: "text" }, { type: "text" }]).map(
              (col, i) => (
                <div key={i} className="column-placeholder">
                  Colonne {i + 1}
                </div>
              ),
            )}
          </div>
        );

      case "footer":
        return (
          <div
            className="block-preview block-preview--footer"
            style={{
              backgroundColor: block.data.backgroundColor || "#f5f5f5",
              textAlign: block.data.alignment || "center",
              color: block.data.textColor || "#888888",
            }}
          >
            <p>
              Vous recevez cet email car vous êtes inscrit à notre newsletter.
            </p>
            <div className="footer-links">
              <a style={{ color: block.data.linkColor || "#2d6a4f" }}>
                Site web
              </a>
              <span>|</span>
              <a style={{ color: block.data.linkColor || "#2d6a4f" }}>
                Boutique
              </a>
              <span>|</span>
              <a style={{ color: block.data.linkColor || "#2d6a4f" }}>
                Contact
              </a>
            </div>
            {block.data.showUnsubscribe && (
              <a className="unsubscribe-link">
                {block.data.unsubscribeText || "Se désinscrire"}
              </a>
            )}
            <p className="footer-copyright">
              © {new Date().getFullYear()} {block.data.companyName || "Krysto"}{" "}
              - {block.data.companyAddress || "Nouvelle-Calédonie 🇳🇨"}
            </p>
          </div>
        );

      case "html":
        return (
          <div
            className="block-preview block-preview--html"
            dangerouslySetInnerHTML={{
              __html: block.data.content || "<p>Code HTML personnalisé</p>",
            }}
          />
        );

      default:
        return (
          <div className="block-preview block-preview--unknown">
            Bloc inconnu: {block.type}
          </div>
        );
    }
  };

  return (
    <div
      className="block-canvas"
      style={{
        backgroundColor: settings.backgroundColor || "#f4f4f4",
        padding: 20,
      }}
    >
      <div
        className="block-canvas__content"
        style={{
          backgroundColor: settings.contentBackgroundColor || "#ffffff",
          borderRadius: settings.borderRadius || 16,
          maxWidth: settings.maxWidth || 600,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Drop zone au début */}
        <div
          className={`drop-zone ${dragOverIndex === 0 ? "drop-zone--active" : ""}`}
          onDragOver={(e) => handleDragOver(e, 0)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 0)}
        >
          <FiPlus />
        </div>

        {blocks.length === 0 ? (
          <div className="block-canvas__empty">
            <p>Glissez des blocs ici pour construire votre email</p>
            <button
              className="btn btn--primary"
              onClick={() => onAddBlock("header")}
            >
              <FiPlus /> Ajouter un en-tête
            </button>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id}>
              <div
                className={`block-wrapper ${selectedBlockId === block.id ? "block-wrapper--selected" : ""} ${draggingIndex === index ? "block-wrapper--dragging" : ""} ${block.hidden ? "block-wrapper--hidden" : ""}`}
                onClick={() => onSelectBlock(block.id)}
                draggable
                onDragStart={(e) => handleBlockDragStart(e, index)}
                onDragOver={(e) => handleBlockDragOver(e, index)}
                onDrop={(e) => handleBlockDrop(e, index)}
                onDragEnd={handleBlockDragEnd}
              >
                {/* Block Toolbar */}
                <div className="block-toolbar">
                  <span className="block-toolbar__type">{block.type}</span>
                  <div className="block-toolbar__actions">
                    <button
                      className="block-toolbar__btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, "up");
                      }}
                      disabled={index === 0}
                      title="Monter"
                    >
                      <FiChevronUp />
                    </button>
                    <button
                      className="block-toolbar__btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, "down");
                      }}
                      disabled={index === blocks.length - 1}
                      title="Descendre"
                    >
                      <FiChevronDown />
                    </button>
                    <button
                      className="block-toolbar__btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateBlock(block.id);
                      }}
                      title="Dupliquer"
                    >
                      <FiCopy />
                    </button>
                    <button
                      className="block-toolbar__btn block-toolbar__btn--danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* Block Content */}
                <div
                  className="block-content"
                  style={{
                    backgroundColor:
                      block.styles?.backgroundColor || "transparent",
                    paddingTop: block.styles?.paddingTop || 20,
                    paddingBottom: block.styles?.paddingBottom || 20,
                    paddingLeft: block.styles?.paddingLeft || 20,
                    paddingRight: block.styles?.paddingRight || 20,
                    marginTop: block.styles?.marginTop || 0,
                    marginBottom: block.styles?.marginBottom || 0,
                    borderRadius: block.styles?.borderRadius || 0,
                  }}
                >
                  {renderBlockContent(block)}
                </div>
              </div>

              {/* Drop zone après chaque bloc */}
              <div
                className={`drop-zone ${dragOverIndex === index + 1 ? "drop-zone--active" : ""}`}
                onDragOver={(e) => handleDragOver(e, index + 1)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index + 1)}
              >
                <FiPlus />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockCanvas;
