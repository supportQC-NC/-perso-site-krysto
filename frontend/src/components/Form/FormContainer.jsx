import "./Form.css";

const FormContainer = ({ children, title, subtitle }) => {
  return (
    <div className="form-container">
      <div className="form-content">
        {title && <h1>{title}</h1>}
        {subtitle && <p className="form-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
