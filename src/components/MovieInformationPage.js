import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './MovieInformationPage.css';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


function MovieInformationPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 
  const [showDates, setShowDates] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [adult, setadult] = useState(0);
  const [child, setchild] = useState(0);
  const [senior, setsenior] = useState(0);
  const location = useLocation();
  const { movie } = location.state || {};

  useEffect(() => {
    if (!isLoggedIn) { 
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    } else if (!movie || !movie.trailerLink) {
      console.log("Missing movie data, navigating home.");
      navigate("/", { replace: true });
    }
  }, [navigate, movie, isLoggedIn]); 

  useEffect(() => {
    if (movie?.id) {
      const fetchShowDates = async () => {
        try {
          const response = await axios.post('http://localhost:8080/getShowDate', {"movieId": movie.id});
          setShowDates(Array.isArray(response.data['400']) ? response.data['400'] : []);
        } catch (error) {
          console.error('Error fetching show dates:', error);
        }
      };
      fetchShowDates();
    }
  }, [movie?.id]);

  useEffect(() => {
    if (selectedDate && movie?.id) {
      const fetchShowTimes = async () => {
        try {
          const response = await axios.post('http://localhost:8080/getShowsByDate', {
            "movieId": movie.id,
            "showDate": selectedDate
          });
          setShowTimes(Array.isArray(response.data['400']) ? response.data['400'] : []);
        } catch (error) {
          console.error('Error fetching show times:', error);
        }
      };
      fetchShowTimes();
    }
  }, [selectedDate, movie?.id]);

  if (!movie) {
    return null;
  }

  let trailerUrl = "";
  try {
    trailerUrl = new URLSearchParams(new URL(movie.trailerLink).search).get('v');
  } catch (error) {
    console.error('Failed to construct URL:', error);
  }

  const increment = (type) => {
    if (type === 'adult') {
      setadult(adult + 1);
    } else if (type === 'child') {
      setchild(child + 1);
    } else if ('senior') {
        setsenior(senior + 1);
    }
  };

  const decrement = (type) => {
    if (type === 'adult') {
        if (adult > 0) {
          setadult(adult - 1);
        }
      } else if (type === 'child') {
        if (child > 0) {
          setchild(child - 1);
        }
      } else if (type === 'senior') {
        if (senior > 0) {
          setsenior(senior - 1);
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

  const handleNavigation = () => {
    console.log(movie);
    navigate('/bookseats', {
      state: {
        movie,
        ticketQuantities: {
          adult,
          child,
          senior
        },
        showDates: selectedDate, 
        showTimes: selectedShowTime 
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
      <div className="modal-content">
        <h2>{movie?.title}</h2>
        <div className="video-and-synopsis">
          <div className="video">
            {trailerUrl ? (
              <iframe
                width="450"
                height="250"
                src={`https://www.youtube.com/embed/${trailerUrl}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>Video unavailable</p>  // Fallback content
            )}
          </div>
          <div className="synopsis">
            <p>{movie?.synopsis}</p>

            <div className="counters">
            <div className="counter-item">
              <p>Adult:</p>
              <button onClick={() => decrement('adult')}>-</button>
              <span>{adult}</span>
              <button className="increment" onClick ={() => increment('adult')}>+</button>

              {(adult > 0 || child > 0 || senior > 0) && (
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
              <button onClick={() => decrement('child')}>-</button>
              <span>{child}</span>
              <button onClick={() => increment('child')}>+</button>
              <div className="dates-times-tickets">
              {renderShowTimesDropdown()}

          </div>
            </div>
            <div className="counter-item">
              <p>Senior:</p>
              <button onClick={() => decrement('senior')}>-</button>
              <span>{senior}</span>
              <button onClick={() => increment('senior')}>+</button>

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
            <p>Director: {movie?.movieDirector || "Director unavailable"}</p>
            <p>Cast: {movie?.movieCast || "Cast details unavailable"}</p>
            <p>Producer/s: {movie?.movieProducer || "Producer details unavailable"}</p>
            <p>Genre: {movie?.movieCategory || "Genre unavailable"}</p>
            <p>Rating: {movie?.rating ? `(${movie.rating})` : "Rating unavailable"}</p>
            <p>Rotten Tomatoes Rating: {movie?.reviews || "Reviews unavailable"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieInformationPage;