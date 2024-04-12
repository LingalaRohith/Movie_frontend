import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './MovieInformationPage.css';
import { useNavigate } from 'react-router-dom';

function MovieInformationPage({isLoggedIn}) {
  const navigate = useNavigate();
  const [showDates, setShowDates] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('');


  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const location = useLocation();
  const { movie } = location.state || {};

  const increment = (type) => {
    if (type === 'adults') {
      setAdults(adults + 1);
    } else if (type === 'children') {
      setChildren(children + 1);
    } else if ('seniors') {
        setSeniors(seniors + 1);
    }
  };

  const decrement = (type) => {
    if (type === 'adults') {
        if (adults > 0) {
          setAdults(adults - 1);
        }
      } else if (type === 'children') {
        if (children > 0) {
          setChildren(children - 1);
        }
      } else if (type === 'seniors') {
        if (seniors > 0) {
          setSeniors(seniors - 1);
        }
    }
  };

  const handleDateChange = (e) => {
    const newSelectedDate = e.target.value;
    setSelectedDate(newSelectedDate);
};

const renderTimesButton = () => {
  if (selectedDate) {
      return <button>Select Time</button>;
  }
  return null;
};


useEffect(() => {
  const fetchShowDates = async () => {
      try {
          const response = await axios.post('http://localhost:8080/getShowDate',{"movieId" : movie.id});
          const dates = response.data['400'];
          if (Array.isArray(dates)) {
              setShowDates(dates);
              console.log("dates: " + dates);
              console.log("showdates: " + showDates);
          } else {
              console.error('Expected an array for show dates, received:', dates);
          }
      } catch (error) {
          console.error('Error fetching show dates:', error);
      }
    };
    if (movie?.id) {
        fetchShowDates();
    }
}, [movie?.id]);

useEffect(() => {
  const fetchShowTimes = async () => {
    if (!selectedDate) return; 
    try {
      const response = await axios.post('http://localhost:8080/getShowsByDate', {
        movieId: movie.id,
        showDate: selectedDate
      });
      const times = response.data['400']; 
      if (Array.isArray(times)) {
        setShowTimes(times);
        console.log(showTimes);
      } else {
        console.error('Expected an array for show times, received:', times);
      }
    } catch (error) {
      console.error('Error fetching show times:', error);
    }
  };

  fetchShowTimes();
}, [selectedDate, movie?.id]);


  const handleNavigation = () => {
    navigate('/bookseats', {
      state: {
        movie,
        ticketQuantities: {
          adults,
          children,
          seniors
        },
        showDate: selectedDate, 
        showTime: showTimes 
      }
    });
  };

  const renderShowTimesDropdown = () => {
    if (selectedDate && showTimes.length > 0) {
      return (
        <select value={selectedShowTime} onChange={(e) => setSelectedShowTime(e.target.value)}>
          <option value="" disabled>Select Time</option>
          {showTimes.map((time, index) => (
            <option key={index} value={time}>{time}:00</option>
          ))}
        </select>
      );
    }
    return null;
  };
  
  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn}/>
      <div className="modal-content">
      <h2>{movie?.title}</h2>
        <div className="video-and-synopsis">
          <div className="video">
            <iframe
              width="450"
              height="250"
              src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(movie?.trailerLink).search).get('v')}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="synopsis">
            <p>{movie?.synopsis}</p>

            <div className="counters">
            <div className="counter-item">
              <p>Adult:</p>
              <button onClick={() => decrement('adults')}>-</button>
              <span>{adults}</span>
              <button className="increment" onClick ={() => increment('adults')}>+</button>

              {(adults > 0 || children > 0 || seniors > 0) && (
              <div className="dates-times-tickets">
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                <option value="" disabled>Select Date</option>
                {showDates.map((date, index) => (
                  <option key={index} value={date}>{new Date(date + "T00:00:00").toLocaleDateString()}</option>
                ))}
                 </select>
        </div>
      )}
            </div>
            <div className="counter-item">
              <p>Child:</p>
              <button onClick={() => decrement('children')}>-</button>
              <span>{children}</span>
              <button onClick={() => increment('children')}>+</button>
              <div className="dates-times-tickets">
              {renderShowTimesDropdown()}

          </div>
            </div>
            <div className="counter-item">
              <p>Senior:</p>
              <button onClick={() => decrement('seniors')}>-</button>
              <span>{seniors}</span>
              <button onClick={() => increment('seniors')}>+</button>

              {selectedShowTime && (
                <div className="dates-times-tickets">
                  <button onClick={handleNavigation}>Book Seats</button>
                </div>
              )}

            </div>
          </div>
            
          </div>
        </div>
        <div className="details">
        <div className="movie-details">
            <p>Director: {movie.movieDirector}</p> 
            <p>Cast: {movie?.movieCast}</p> 
            <p>Producer/s: {movie?.movieProducer}</p>
            <p>Genre: {movie?.movieCategory}</p> 
            <p>Rating: ({movie?.rating})</p>
            <p>Rotten Tomatoes Rating: {movie?.reviews}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieInformationPage;