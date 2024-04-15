// import React, { useState } from 'react';
// import Header from './Header.js';
// import './landingpage.css';
// import { useNavigate } from 'react-router-dom';
// import './RegistrationConfirmation.js';

// const MovieModal = ({ movie, onClose, isLoggedIn }) => {
//   const navigate = useNavigate();
  
//   const handleNavigation = () => {
//     navigate('/movie-info', { state: { movie: movie } });
//   };

//   if (!movie) return null; 


//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <h2>{movie.title}</h2>
//         <iframe
//           width="560"
//           height="315"
//           src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(movie.trailer).search).get('v')}`}
//           title="YouTube video player"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen>
//         </iframe>
//         <div class="bttns">
//             <button onClick={onClose}>Close</button>
//             {isLoggedIn && <button onClick={handleNavigation}>More Info</button>}
//         </div>
//       </div>
//     </div>
//   );
// };

// const currentlyRunningMovies = [
//     { title: 'Bob Marley: One Love', review: '42%', dayOne: 'TODAY', dayTwo: 'TOMORROW', dayOneTime1: '6:00PM', dayTwoTime1: '7:00PM', dayTwoTime2: '7:50PM', director: 'Reinaldo Marcus Green', cast: 'Kingsley Ben-Adir, Lashana Lynch, James Norton', producer: 'Robert Teital, Dede Gardner, Jeremy Kleiner, Ziggy Marley, Rita Marley, Cedella Marley', rating: 'PG-13', genre: 'Musical/Drama', synopsis: 'BOB MARLEY: ONE LOVE celebrates the life and music of an icon who inspired generations through his message of love and unity. On the big screen for the first time, discover Bob’s powerful story of overcoming adversity and the journey behind his revolutionary music. Produced in partnership with the Marley family and starring Kingsley Ben-Adir as the legendary musician and Lashana Lynch as his wife Rita.', date: '2024-02-14', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Bob_Marley_One_Love.jpg/220px-Bob_Marley_One_Love.jpg', trailer: 'https://www.youtube.com/watch?v=ajw425Kuvtw'},
//     { title: 'Madame Web', review: '13%', dayOne: 'TODAY', dayTwo: 'TOMORROW', dayOneTime1: '6:50PM', dayOneTime2: '9:25PM', director: 'S.J. Clarkson', cast: 'Dakota Johnson, Sydney Sweeney, Isabela Merced, Celeste O`Connor, Tahar Rahim, Mike Epps, Emma Roberts, Adam Scott', producer: 'Lorenzo di Bonaventura', rating: 'PG-13', genre: 'Action/Sci-Fi', synopsis: 'Cassandra Webb is a New York City paramedic who starts to show signs of clairvoyance. Forced to confront revelations about her past, she must protect three young women from a mysterious adversary who wants them dead.', date: '2024-02-14', img: 'https://shorturl.at/ruvL2', trailer: 'https://www.youtube.com/watch?v=s_76M4c4LTo'},
//     // Add more movie objects here...
//   ];
  
//   const comingSoonMovies = [
//     { title: 'Dune: Part Two', review: '97%', dayOne: 'FRI: MAR 1', dayTwo: 'SAT: MAR 2', dayOneTime1: '11:30AM', dayOneTime2: '2:00PM', dayOneTime3: '7:00PM', director: 'Denis Villeneuve', cast: 'Timothee Chalamet, Zendaya, Rebecca Ferguson, Josh Brolin, Austin Butler, Florence Pugh', producer: 'Mary Parent, Cale Boyter, Denis Villeneuve, Tanya Lapointe, Patric McCormick', rating: 'PG-13', genre: 'Sci-Fi/Adventure', synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.', date: '2024-03-01', img: 'https://shorturl.at/BGVX2', trailer: 'https://www.youtube.com/watch?v=_YUzQa_1RCE'},
//     { title: 'Kung Fu Panda 4', review: 'N/A', dayOne: 'FRI: MAR 8', dayTwo: 'SAT: MAR 9', dayOneTime1: '10:00AM', dayTwoTime1: '1:00PM', dayTwoTime2: '5:30PM', director: 'Mike Mitchell', cast: 'Jack Black, Awkafina, Viola Davis, Dustin Hoffman, James Jong, Bryan Cranston, Ian McShane, Ke Huy Quan', producer: 'Rebecca Huntley', rating: 'PG', genre: 'Comedy/Adventure', synopsis: 'Po must train a new warrior when he is chosen to become the spiritual leader of the Valley of Peace. However, when a powerful shape-shifting sorceress sets her eyes on his Staff of Wisdom, he suddenly realizes he is going to need some help. Teaming up with a quick-witted corsac fox, Po soon discovers that heroes can be found in the most unexpected places', date: '2024-03-08', img: 'https://shorturl.at/fyP09', trailer: 'https://www.youtube.com/watch?v=_inKs4eeHiI'},
//   ];

// function LandingPage({isLoggedIn, setLoggedIn}) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchBy, setSearchBy] = useState('');
//   const [filteredCurrentlyRunningMovies, setFilteredCurrentlyRunningMovies] = useState(currentlyRunningMovies);
//   const [filteredComingSoonMovies, setFilteredComingSoonMovies] = useState(comingSoonMovies);
//   const [selectedMovie, setSelectedMovie] = useState(null); 
//   const [selectedMovieIndex, setSelectedMovieIndex] = useState(null); 
//   const [selectedMovieListType, setSelectedMovieListType] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All'); // Initialize with 'All'


//   const handleSearch = () => {
//     if (!searchBy || !searchQuery) {
//         alert('Please select a search category and enter a query.');
//         return;
//       }
  
//       const filteredCurrently = currentlyRunningMovies.filter((movie) => {
//         const value = movie[searchBy].toString().toLowerCase();
//         return value.includes(searchQuery.toLowerCase());
//       });
  
//       const filteredSoon = comingSoonMovies.filter((movie) => {
//         const value = movie[searchBy].toString().toLowerCase();
//         return value.includes(searchQuery.toLowerCase());
//       });
  
//       setFilteredCurrentlyRunningMovies(filteredCurrently);
//       setFilteredComingSoonMovies(filteredSoon);
//   };

//   const openModalWithMovie = (movie, index, listType) => {
//     setSelectedMovie(movie);
//     setSelectedMovieIndex(index);
//     setSelectedMovieListType(listType);
//   };

//   const closeModal = () => {
//     setSelectedMovie(null);
//     setSelectedMovieIndex(null);
//     setSelectedMovieListType('');
//   };

//   const renderMoviesList = (movies, listType) => {
//     return movies.map((movie, index) => (
//       <>
//         <div key={index} className="mov" onClick={() => openModalWithMovie(movie, index, listType)}>
//           <img src={movie.img} alt={movie.title} style={{cursor: 'pointer'}} height={325} width={200}/>
//           <p className="movie-title">{movie.title}</p>
//         </div>
//         {selectedMovie && selectedMovieIndex === index && selectedMovieListType === listType && (
//           <MovieModal movie={selectedMovie} onClose={closeModal} isLoggedIn={isLoggedIn}/>
//         )}
//       </>
//     ));
//   };


//   return (
//     <div className="App">
//       <Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}/>
//       <div className="movies-and-search-container">
//       <div className="search-container">
//           <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
//             {searchBy === '' && <option disabled hidden value="">Search By...</option>}
//             <option value="title">Title</option>
//             <option value="genre">Genre</option>
//             <option value="date">Date</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Find a movie to watch!"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button type="button" onClick={handleSearch}>Search</button>
//         </div>
//         <div className="sections">
//           <h2>CURRENTLY RUNNING</h2>
//           <div className='list'>
//             {renderMoviesList(filteredCurrentlyRunningMovies, 'currentlyRunning')}
//           </div>
//           <h2 className="coming-soon-heading">COMING SOON</h2>
//           <div className='list'>
//             {renderMoviesList(filteredComingSoonMovies, 'comingSoon')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;


import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import axios from 'axios';
import MovieModal from './MovieModal';
import './landingpage.css'
import './MovieInformationPage';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './Store';



function LandingPage({isLoggedIn}) {
  const [movies, setMovies] = useState([]);
  const [currentlyRunningMovies, setCurrentlyRunningMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState('');
  // const {user} = useContext(Context);


  const location = useLocation();
   const mail = location.state?.email; 
   const pwd = location.state?.password;
   const name = location.state?.name;

  

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

  const filteredCurrentlyRunningMovies = currentlyRunningMovies.filter(movie =>
    movie.movieTitle.toLowerCase().includes(searchTerm) &&
    (selectedCategory === 'All' || movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase())
  );

  const filteredUpcomingMovies = upcomingMovies.filter(movie =>
    movie.movieTitle.toLowerCase().includes(searchTerm) &&
    (selectedCategory === 'All' || movie.movieCategory.toLowerCase() === selectedCategory.toLowerCase())
  );

  const login = localStorage.getItem('isLogin');

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