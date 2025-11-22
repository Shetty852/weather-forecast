// src/components/ui/DatePicker.jsx
import React from 'react';

export default function DatePicker({ label, name, register, error, ...rest }) {
  return (
    <div className="field">
      {label && <label className="label" htmlFor={name}>{label}</label>}
      <input id={name} name={name} type="date" className="input" {...register(name)} {...rest} />
      {error && <div className="error">{error.message || error}</div>}
    </div>
  );
}
