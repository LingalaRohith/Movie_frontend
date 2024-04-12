import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Seat from './Seat';
import Header from './Header';
import './BookSeats.css';

function BookSeats({ isLoggedIn }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [takenSeats, setTakenSeats] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, ticketQuantities, showDates, showTimes, existingSelections, selectedShowTime, selectedDate } = location.state || {};
  // Calculate the total tickets needed from the ticketQuantities passed in state
  const totalTicketsRequired = ticketQuantities ? Object.values(ticketQuantities).reduce((acc, value) => acc + value, 0) : 0;

  useEffect(() => {
    // Initialize taken seats and optionally pre-populate selected seats if coming from OrderSummary
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const newTakenSeats = rows.flatMap(row =>
      Array.from({ length: seatsPerRow }, (_, i) =>
        Math.random() < 0.3 ? `${row}${i + 1}` : null
      ).filter(Boolean)
    );

    setTakenSeats(newTakenSeats);

    if (existingSelections) {
      setSelectedSeats(existingSelections);
    }
  }, [existingSelections]); // Reacting to existingSelections ensures we reset selectedSeats if coming back to add more

  useEffect(() => {
    console.log(showDates); 
    console.log(showTimes);
  }, [movie]);

  const navigateToOrderSummary = () => {
    if (selectedSeats.length < totalTicketsRequired) {
      alert(`Please select ${totalTicketsRequired} seats before continuing.`);
      return;
    }
    navigate('/ordersummary', { 
      state: { 
        movie, 
        selectedSeats, 
        ticketQuantities, 
        showDates,
        showTimes 
      } 
    });
  };

  const handleSeatClick = (seatId) => {
    // Existing seat click logic to select/deselect seats
    if (!takenSeats.includes(seatId)) {
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.includes(seatId)) {
          return prevSelectedSeats.filter(id => id !== seatId);
        } else if (prevSelectedSeats.length < totalTicketsRequired) {
          return [...prevSelectedSeats, seatId];
        } else {
          alert(`You can only select ${totalTicketsRequired} seats in total.`);
          return prevSelectedSeats;
        }
      });
    }
  };


  const renderSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; 
    const seatsPerRow = 10; 
    return rows.map((row) => (
      <div key={row} className="row">
        <div className="row-label">{row}</div>
        <div className="seats">
          {Array.from({ length: seatsPerRow }, (_, index) => {
            const seatId = `${row}${index + 1}`;
            return (
              <Seat
                key={seatId}
                id={seatId}
                selected={selectedSeats.includes(seatId)}
                taken={takenSeats.includes(seatId)}
                onClick={() => handleSeatClick(seatId)}
              />
            );
          })}
        </div>
      </div>
    ));
  };
  
  return (
    <div>
      <Header isLoggedIn={isLoggedIn}/>
      <div className="book-seats">
        {movie && (
          <>
            <div className="movie-info">
              <img src={movie.posterSrc} alt={`Poster for ${movie.title}`} className="movie-poster" />
              <hr className="divider" />
              <h2 className="movie-title">{movie.movieTitle}</h2>
              <p className="show-dates"> {showDates}</p>
              <p className="show-times"> {location.state.showTimes}:00</p>
            </div>
            <header className="booking-header">
              <h1>Select Your Seats</h1>
            </header>
            <div className="cinema-seats">{renderSeats()}</div>
            <div className="seat-key">
              <div className="key-item"><div className="circle available"></div><span>Available</span></div>
              <div className="key-item"><div className="circle selected"></div><span>Selected</span></div>
              <div className="key-item"><div className="circle taken"></div><span>Taken</span></div>
            </div>
            {selectedSeats.length > 0 && <p>Selected: {selectedSeats.join(', ')}</p>}
            <button className="next-button" 
            onClick={navigateToOrderSummary} 
            > Next</button></>
        )}
      </div>
    </div>
  );
}

export default BookSeats;

 


