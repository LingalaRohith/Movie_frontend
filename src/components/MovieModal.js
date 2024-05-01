import React from 'react';
import { useNavigate } from 'react-router-dom';

// const MovieModal = ({ movie, onClose, onMoreInfo }) => {
//   const navigate = useNavigate();

//   const handleMoreInfo = () => {
//     if (onMoreInfo) {
//         navigate('/movie-info', { state: { movie: movie } });
//     }
//   };

//   if (!movie) return null;

//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <h2>{movie.movieTitle}</h2>
//         <iframe
//           width="560"
//           height="315"
//           src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(movie.trailerLink).search).get('v')}`}
//         //  src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(movie.trailer).search).get('v')}`}
//           title="YouTube video player"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         ></iframe>
//         <div className="buttons">
//           <button onClick={onClose}>Close</button>
//           <button onClick={handleMoreInfo}>More Info</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieModal;

const MovieModal = ({ movie, onClose, isLoggedIn }) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate('/movie-info', { state: { movie: movie } });
  };

  if (!movie) return null; 


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{movie.title}</h2>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(movie.trailerLink).search).get('v')}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
        <div className="bttns">
            <button onClick={onClose}>Close</button>
            {isLoggedIn && <button onClick={handleNavigation}>More Info</button>} 
        </div>
      </div>
    </div>
  );
};

export default MovieModal;