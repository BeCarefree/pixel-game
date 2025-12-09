import React from 'react';

const Button = ({ children, onClick, className = '', disabled = false, ...props }) => {
  return (
    <button
      className={`pixel-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
