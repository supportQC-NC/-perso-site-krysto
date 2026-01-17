import "./Form.css";
import { useRef, useState } from "react";

const FormFile = ({
  label,
  name,
  onChange,
  accept,
  multiple = false,
  required = false,
  error,
  disabled = false,
  helperText,
}) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      if (multiple) {
        setFileName(`${files.length} fichier(s) sélectionné(s)`);
      } else {
        setFileName(files[0].name);
      }
    } else {
      setFileName("");
    }
    onChange(e);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && (
        <label>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="file-input-wrapper" onClick={handleClick}>
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
        />
        <div className={`file-input-display ${disabled ? "disabled" : ""}`}>
          <span className="file-icon">📁</span>
          <span className="file-text">
            {fileName || "Choisir un fichier..."}
          </span>
          <span className="file-btn">Parcourir</span>
        </div>
      </div>
      {helperText && !error && (
        <span className="helper-text">{helperText}</span>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormFile;
