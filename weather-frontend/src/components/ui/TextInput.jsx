// src/components/ui/TextInput.jsx
import React from 'react';

export default function TextInput({ label, name, register, error, ...rest }) {
  return (
    <div className="field">
      {label && <label className="label" htmlFor={name}>{label}</label>}
      <input id={name} name={name} className="input" {...register(name)} {...rest} />
      {error && <div className="error">{error.message || error}</div>}
    </div>
  );
}
