import "./Form.css";

const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  error,
}) => {
  return (
    <div className={`form-checkbox-wrapper ${error ? "has-error" : ""}`}>
      <label className="form-checkbox">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="checkmark"></span>
        <span className="checkbox-label">{label}</span>
      </label>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormCheckbox;
