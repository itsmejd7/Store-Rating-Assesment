import React from 'react';

export default function FormInput({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <input
        id={props.id || props.name}
        className={`input${error ? ' input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
