import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Seat from './Seat';
import Header from './Header';
import './BookSeats.css';
import axios from 'axios';
import { useAuth } from './AuthContext';


function BookSeats() {
  const [showId, setShowId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [takenSeats, setTakenSeats] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 
  const { movie, ticketQuantities, showDates, showTimes, existingSelections, selectedShowTime, selectedDate } = location.state || {};
  // Calculate the total tickets needed from the ticketQuantities passed in state
  const totalTicketsRequired = ticketQuantities ? Object.values(ticketQuantities).reduce((acc, value) => acc + value, 0) : 0;

  useEffect(() => {
    if (!isLoggedIn) { 
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    } else if (!movie) {
      console.log("Missing movie data, navigating home.");
      navigate("/", { replace: true });
    }
  }, [navigate, movie, isLoggedIn]); 

  useEffect(() => {
    if (movie?.id) {
    const fetchShowID = async () => {
      try {
        const response = await axios.post('http://localhost:8080/getShow', {
          "showDate": location.state?.showDates,
          "showTime": parseInt(location.state?.showTimes, 10)
        });
        const show = response.data['400'];
        setShowId(show.showId);
      } catch (error) {
        console.error('Error fetching show ID:', error);
      }
    };
    fetchShowID();
  }
  }, []);
  
  useEffect(() => {
    console.log('Updated showId:', showId);
  }, [showId]); 
  
   
  useEffect(() => {
    const fetchSeats = async () => {
      if (showId) { 
        try {
          console.log('Fetching seats for showId:', showId);
          const response = await axios.post('http://localhost:8080/getReservedSeats', {"showID": showId});
          const reservedSeats = response.data['400'];
          setTakenSeats(reservedSeats); 
          console.log('Fetched reserved seats:', reservedSeats);
        } catch (error) {
          console.error('Error fetching seats:', error);
        }
      }
    };
  
    fetchSeats();
  }, [showId]);  
  
    
  const navigateToOrderSummary = () => {
    if (selectedSeats.length < totalTicketsRequired) {
        alert(`Please select ${totalTicketsRequired} seats before continuing.`);
        return;
    }
    console.log(showId);
    navigate('/ordersummary', { 
        state: { 
            movie, 
            selectedSeats, 
            ticketQuantities, 
            showDates,
            showTimes,
            totalTicketsRequired,
            showId,
            ticketQuantities 
        } 
    });
};


const handleSeatClick = (seatId) => {
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
    console.log('render: ' + takenSeats); 
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