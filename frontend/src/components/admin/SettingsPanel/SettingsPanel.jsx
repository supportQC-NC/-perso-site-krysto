import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiSave } from "react-icons/fi";
import "./SettingPanel.css";

const SettingsPanel = ({
  settings,
  onUpdateSettings,
  campaignInfo,
  onUpdateCampaignInfo,
  onSaveAsTemplate,
}) => {
  const [openSections, setOpenSections] = useState({
    campaign: true,
    design: true,
    colors: false,
    recipients: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderInput = (label, value, onChange, type = "text", options = {}) => {
    const { placeholder, min, max, choices } = options;

    return (
      <div className="settings-field">
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
            rows={3}
          />
        ) : type === "number" ? (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
          />
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

  return (
    <div className="settings-panel">
      {/* Campaign Info Section */}
      <div className="settings-section">
        <button
          className="settings-section__header"
          onClick={() => toggleSection("campaign")}
        >
          <span>📧 Informations campagne</span>
          {openSections.campaign ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.campaign && (
          <div className="settings-section__content">
            {renderInput(
              "Nom de la campagne",
              campaignInfo.name,
              (v) => onUpdateCampaignInfo({ ...campaignInfo, name: v }),
              "text",
              { placeholder: "Ma campagne" },
            )}
            {renderInput(
              "Sujet de l'email",
              campaignInfo.subject,
              (v) => onUpdateCampaignInfo({ ...campaignInfo, subject: v }),
              "text",
              { placeholder: "Sujet accrocheur..." },
            )}
            {renderInput(
              "Texte de prévisualisation",
              settings.preheaderText,
              (v) => onUpdateSettings({ ...settings, preheaderText: v }),
              "textarea",
              { placeholder: "Texte visible dans la boîte de réception..." },
            )}
          </div>
        )}
      </div>

      {/* Recipients Section */}
      <div className="settings-section">
        <button
          className="settings-section__header"
          onClick={() => toggleSection("recipients")}
        >
          <span>👥 Destinataires</span>
          {openSections.recipients ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.recipients && (
          <div className="settings-section__content">
            {renderInput(
              "Envoyer à",
              campaignInfo.recipients,
              (v) => onUpdateCampaignInfo({ ...campaignInfo, recipients: v }),
              "select",
              {
                choices: [
                  { value: "all", label: "Tous (utilisateurs + prospects)" },
                  { value: "users", label: "Utilisateurs uniquement" },
                  { value: "prospects", label: "Prospects uniquement" },
                  {
                    value: "newsletter_subscribers",
                    label: "Abonnés newsletter",
                  },
                ],
              },
            )}
          </div>
        )}
      </div>

      {/* Design Section */}
      <div className="settings-section">
        <button
          className="settings-section__header"
          onClick={() => toggleSection("design")}
        >
          <span>🎨 Design</span>
          {openSections.design ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.design && (
          <div className="settings-section__content">
            {renderInput(
              "Largeur max (px)",
              settings.maxWidth,
              (v) => onUpdateSettings({ ...settings, maxWidth: v }),
              "number",
              { min: 400, max: 800 },
            )}
            {renderInput(
              "Arrondi (px)",
              settings.borderRadius,
              (v) => onUpdateSettings({ ...settings, borderRadius: v }),
              "number",
              { min: 0, max: 30 },
            )}
            {renderInput(
              "Taille police (px)",
              settings.baseFontSize,
              (v) => onUpdateSettings({ ...settings, baseFontSize: v }),
              "number",
              { min: 12, max: 20 },
            )}
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className="settings-section">
        <button
          className="settings-section__header"
          onClick={() => toggleSection("colors")}
        >
          <span>🎨 Couleurs</span>
          {openSections.colors ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.colors && (
          <div className="settings-section__content">
            {renderInput(
              "Fond page",
              settings.backgroundColor,
              (v) => onUpdateSettings({ ...settings, backgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Fond contenu",
              settings.contentBackgroundColor,
              (v) =>
                onUpdateSettings({ ...settings, contentBackgroundColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur principale",
              settings.primaryColor,
              (v) => onUpdateSettings({ ...settings, primaryColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur secondaire",
              settings.secondaryColor,
              (v) => onUpdateSettings({ ...settings, secondaryColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur texte",
              settings.baseTextColor,
              (v) => onUpdateSettings({ ...settings, baseTextColor: v }),
              "color",
            )}
            {renderInput(
              "Couleur liens",
              settings.baseLinkColor,
              (v) => onUpdateSettings({ ...settings, baseLinkColor: v }),
              "color",
            )}
          </div>
        )}
      </div>

      {/* Save as Template */}
      <div className="settings-actions">
        <button
          className="btn btn--secondary btn--full"
          onClick={onSaveAsTemplate}
        >
          <FiSave />
          Sauvegarder comme template
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
