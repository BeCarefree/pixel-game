import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`pixel-box ${className}`}>
      {children}
    </div>
  );
};

export default Card;
