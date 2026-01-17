import "./Form.css";

const FormRadio = ({
  label,
  name,
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  inline = false,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && <label className="radio-group-label">{label}</label>}
      <div className={`radio-group ${inline ? "inline" : ""}`}>
        {options.map((option) => (
          <label key={option.value} className="form-radio">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
            />
            <span className="radio-mark"></span>
            <span className="radio-label">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormRadio;
