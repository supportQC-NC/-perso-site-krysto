import "./Form.css";

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  helperText,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={error ? "input-error" : ""}
      />
      <div className="textarea-footer">
        {helperText && !error && (
          <span className="helper-text">{helperText}</span>
        )}
        {error && <span className="error-message">{error}</span>}
        {maxLength && (
          <span className="char-count">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormTextarea;
