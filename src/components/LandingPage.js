import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieModal from './MovieModal';
import './landingpage.css';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [currentlyRunningMovies, setCurrentlyRunningMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/movie/getallmovies');
        setMovies(response.data);
        categorizeMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }
    fetchMovies();
  }, []);


  const categorizeMovies = (movies) => {
    const currentDate = new Date();
    const currentlyRunning = movies.filter(movie => new Date(movie.releaseDate) <= currentDate);
    const upcoming = movies.filter(movie => new Date(movie.releaseDate) > currentDate);
    setCurrentlyRunningMovies(currentlyRunning);
    setUpcomingMovies(upcoming);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTrailerClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleMoreInfo = (movieId) => {
    // Navigate to the movie details page
    // You can implement the navigation logic here
  };


//   const filteredCurrentlyRunningMovies = currentlyRunningMovies.filter(movie =>
//     ((movie.movieTitle.toLowerCase().includes(searchTerm) &&
//     movie.showDates.some(date => new Date(date).toISOString().slice(0, 10) === searchDate)) || (movie.movieTitle.toLowerCase().includes(searchTerm) && searchDate==='')) &&
//     (selectedCategory === 'All' || movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase())
// );


const handleDateChange = (e) => {
  setSearchDate(e.target.value);
  console.log("Date set to:", e.target.value);
};

// const filteredUpcomingMovies = upcomingMovies.filter(movie =>
//   ((movie.movieTitle.toLowerCase().includes(searchTerm) &&
//   movie.showDates.some(date => new Date(date).toISOString().slice(0, 10) === searchDate)) || (movie.movieTitle.toLowerCase().includes(searchTerm) && searchDate==='')) &&
//   (selectedCategory === 'All' || movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase())
// );
const filteredCurrentlyRunningMovies = currentlyRunningMovies.filter(movie =>
  ((movie.movieTitle.toLowerCase().includes(searchTerm) &&
  movie.showDates?.some(date => new Date(date).toISOString().slice(0, 10) === searchDate)) || (movie.movieTitle.toLowerCase().includes(searchTerm) && searchDate==='')) &&
  (selectedCategory === 'All' || (movie.movieCategory && movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase()))
);

const filteredUpcomingMovies = upcomingMovies.filter(movie =>
  ((movie.movieTitle.toLowerCase().includes(searchTerm) &&
  movie.showDates?.some(date => new Date(date).toISOString().slice(0, 10) === searchDate)) || (movie.movieTitle.toLowerCase().includes(searchTerm) && searchDate==='')) &&
  (selectedCategory === 'All' || (movie.movieCategory && movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase()))
);

  return (
    <div className="App">
      <div className='movies-and-search-container'>
        <div className="search-container">
          <select onChange={handleCategoryChange} value={selectedCategory}>
            <option value="All">All Categories</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
          </select>
          <input
            type="text"
            onChange={handleSearch}
            value={searchTerm}
            placeholder="Search by movie title"
          />
          <input
    type="date"
    onChange={handleDateChange}
    value={searchDate}
    placeholder="Search by show date"
/>
        </div>
        <h2>Currently Running</h2>
        <div className="list">
          {filteredCurrentlyRunningMovies.map(movie => (
            <div key={movie.id} className="mov">
              <img
                height="325px"
                width="200px"
                src={movie.posterSrc}
                alt={movie.movieTitle}
                onClick={() => handleTrailerClick(movie)}
              />
              <p className="movie-title">{movie.movieTitle}</p>
            </div>
          ))}
        </div>
        <h2>Upcoming Movies</h2>
        <div className="list">
          {filteredUpcomingMovies.map(movie => (
            <div key={movie.id} className="mov">
              <img
                height="325px"
                width="200px"
                src={movie.posterSrc}
                alt={movie.movieTitle}
                onClick={() => handleTrailerClick(movie)}
              />
              <p className="movie-title">{movie.movieTitle}</p>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} onMoreInfo={handleMoreInfo} isLoggedIn={isLoggedIn}/>
      )}
    </div>
  );
}

export default LandingPage;


