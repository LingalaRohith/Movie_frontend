import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './MovieInformationPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function MovieInformationPage({isLoggedIn}) {
  const navigate = useNavigate();
  const [showShowDates, setShowShowDates] = useState('');
  const [showShowTimes, setShowShowTimes] = useState('');
  const [dates,setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);


  useEffect(() => {
    async function fetchDates() {
      try {
        const response = await axios.post('http://localhost:8080/getShowDate',{"movieId" : movie.id});
        console.log(response);
        setDates(response.data['400']);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }
    fetchDates();
  }, []);

  const fetchTimesByDate = async (date) => {
    try {
      const response = await axios.post('http://localhost:8080/getShowsByDate', {
        "movieId" : movie.id,
        "showDate": date
    });
    console.log(response);
      setTimes(response.data); // Assuming response.data is an array of times
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const reducedDate = new Date(selectedDate);
    reducedDate.setDate(reducedDate.getDate() + 1);
    setSelectedDate(reducedDate);
    // setSelectedDate(selectedDate);
    fetchTimesByDate(reducedDate);
  };

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


  
  const handleNavigation = () => {
    const selectedDate = showShowDates === 'dayOne' ? {Today} : {Tomorrow};
    // movie.dayOne : movie.dayTwo;
    // const selectedTime = showShowTimes.startsWith('dayOneTime') ? movie[showShowTimes] : movie[showShowTimes];
    const selectedTime = showShowTimes === 'dayOneTime' ? "5:30 PM" : "9:15 PM";

    navigate('/bookseats', {
      state: {
        movie,
        ticketQuantities: {
          adults: adults,
          children: children,
          seniors: seniors
        }, 
        showShowDates: "Today",//selectedDate, // Pass the actual selected date here
        showShowTimes: "5:30 PM"
      }
    });
  };

  const location = useLocation();
  const { movie } = location.state || {};


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
              <div className="dates-times-tickets">
              <select value={showShowDates} onChange={handleDateChange}>
              {showShowDates === '' && <option disabled hidden value="">Dates</option>}
              {/* <option value="dayOne">{movie?.dayOne}</option>
              <option value="dayTwo">{movie?.dayTwo}</option> */}
              {dates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
            ))}
            </select>
            </div>
  
            </div>
            <div className="counter-item">
              <p>Child:</p>
              <button onClick={() => decrement('children')}>-</button>
              <span>{children}</span>
              <button onClick={() => increment('children')}>+</button>
              <div className="dates-times-tickets">
            
            {showShowDates !== '' && showShowDates === 'dayOne' && (
              <select value={showShowTimes} onChange={(e) => setShowShowTimes(e.target.value)}>
                {showShowTimes === '' && <option disabled hidden value="">Times</option>}
                {[1, 2, 3].map((index) => {
                  const time = movie[`dayOneTime${index}`];
                  return time && (
                    <option key={index} value={`dayOneTime${index}`}>
                      {time}
                    </option>
                  );
                })}
              </select>
            )}
  
            {showShowDates !== '' && showShowDates === 'dayTwo' && (
              <select value={showShowTimes} onChange={(e) => setShowShowTimes(e.target.value)}>
                {showShowTimes === '' && <option disabled hidden value="">Times</option>}
                {[1, 2, 3].map((index) => {
                  const time = movie[`dayTwoTime${index}`];
                  return time && (
                    <option key={index} value={`dayTwoTime${index}`}>
                      {time}
                    </option>
                  );
                })}
              </select>
            )}
  
          </div>
            </div>
            <div className="counter-item">
              <p>Senior:</p>
              <button onClick={() => decrement('seniors')}>-</button>
              <span>{seniors}</span>
              <button onClick={() => increment('seniors')}>+</button>
              {showShowDates !== '' && showShowTimes !== '' && (
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

