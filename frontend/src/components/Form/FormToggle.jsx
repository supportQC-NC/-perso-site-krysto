import "./Form.css";

const FormToggle = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  labelPosition = "right",
}) => {
  return (
    <label
      className={`form-toggle ${labelPosition === "left" ? "label-left" : ""}`}
    >
      {labelPosition === "left" && (
        <span className="toggle-label">{label}</span>
      )}
      <div className="toggle-wrapper">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </div>
      {labelPosition === "right" && (
        <span className="toggle-label">{label}</span>
      )}
    </label>
  );
};

export default FormToggle;
