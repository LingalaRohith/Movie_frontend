import React from 'react';
import './Seat.css';

const Seat = ({ id, selected, taken, onClick }) => {
  const className = `seat ${taken ? 'taken' : selected ? 'selected' : 'available'}`;
  return (
    <div
      className={className}
      onClick={() => !taken && onClick()}
      aria-label={`Seat ${id}`}
    ></div>
  );
};

export default Seat;
