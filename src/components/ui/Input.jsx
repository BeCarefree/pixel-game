import React from 'react';

const Input = ({ value, onChange, placeholder, className = '', ...props }) => {
  return (
    <input
      className={`pixel-input ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
