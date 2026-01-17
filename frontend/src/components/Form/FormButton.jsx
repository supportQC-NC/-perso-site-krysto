import "./Form.css";

const FormButton = ({
  children,
  type = "submit",
  onClick,
  disabled = false,
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = true,
  icon,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`form-btn ${variant} ${size} ${fullWidth ? "full-width" : ""}`}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          Chargement...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default FormButton;
