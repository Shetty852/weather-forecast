// src/components/ui/Button.jsx
import React from 'react';

export default function Button({ children, onClick, type = 'button', className = '', ...rest }) {
  return (
    <button type={type} onClick={onClick} className={`button ${className}`} {...rest}>
      {children}
    </button>
  );
}
