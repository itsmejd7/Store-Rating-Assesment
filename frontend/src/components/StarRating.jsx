import React, { useState } from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="stars" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star${star <= (hovered || value) ? ' filled' : ''}${readOnly ? ' readonly' : ''}`}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          role={readOnly ? 'img' : 'button'}
          tabIndex={readOnly ? -1 : 0}
          onKeyDown={(e) => {
            if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onChange && onChange(star);
            }
          }}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
