import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import "./Message.css";

const Message = ({
  variant = "info",
  children,
  title,
  closable = false,
  onClose,
  icon: CustomIcon,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
  };

  const Icon = CustomIcon || icons[variant];

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`message message-${variant} ${className}`}>
      <div className="message-icon">
        <Icon />
      </div>
      <div className="message-content">
        {title && <h4 className="message-title">{title}</h4>}
        <p className="message-text">{children}</p>
      </div>
      {closable && (
        <button className="message-close" onClick={handleClose}>
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Message;
