import "./Form.css";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  icon,
  iconPosition = "left",
  helperText,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`input-wrapper ${
          icon ? `has-icon icon-${iconPosition}` : ""
        }`}
      >
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={error ? "input-error" : ""}
        />
      </div>
      {helperText && !error && (
        <span className="helper-text">{helperText}</span>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormInput;
