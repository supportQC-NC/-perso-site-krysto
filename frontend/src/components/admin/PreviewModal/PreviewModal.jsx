import { FiX, FiMonitor, FiSmartphone } from "react-icons/fi";
import "./PreviewModal.css";

const PreviewModal = ({ html, onClose, viewMode, onChangeViewMode }) => {
  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-modal__header">
          <h3>Aperçu de l'email</h3>
          <div className="preview-modal__controls">
            <div className="view-toggle">
              <button
                className={`view-toggle__btn ${viewMode === "desktop" ? "active" : ""}`}
                onClick={() => onChangeViewMode("desktop")}
                title="Vue desktop"
              >
                <FiMonitor />
              </button>
              <button
                className={`view-toggle__btn ${viewMode === "mobile" ? "active" : ""}`}
                onClick={() => onChangeViewMode("mobile")}
                title="Vue mobile"
              >
                <FiSmartphone />
              </button>
            </div>
            <button className="preview-modal__close" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="preview-modal__content">
          <div
            className={`preview-frame ${viewMode === "mobile" ? "preview-frame--mobile" : ""}`}
          >
            <iframe
              srcDoc={html}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
