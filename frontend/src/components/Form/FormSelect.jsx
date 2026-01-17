import "./Form.css";
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionnez une option",
  required = false,
  error,
  disabled = false,
  helperText,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={error ? "input-error" : ""}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">▼</span>
      </div>
      {helperText && !error && (
        <span className="helper-text">{helperText}</span>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormSelect;
