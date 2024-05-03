import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageMovies.css';

function ManageMovies() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [movieForm, setMovieForm] = useState({
        id: null,
        movieTitle: null,
        posterSrc: null,
        movieCast: null,
        movieCategory: null,
        movieDirector: null,
        movieProducer: null,
        releaseDate: null,
        synopsis: null,
        reviews: null,
        trailerLink: null,
        movieCertificationCode: null,
        rating: null,
        movieAvailability: null,
        bannerSrc:null,
        language: null
        // showtimes: []
    });
    const [showAddMovieForm, setShowAddMovieForm] = useState(false);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/movie/getallmovies');
                setMovies(response.data || []);
                localStorage.setItem('movies', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        fetchMovies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovieForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const addMovie = async () => {
        if (!movieForm.movieTitle) return;
        const newMovie = {
            ...movieForm,
            id: movies.length + 1
        };
        setMovies([...movies, newMovie]);
        console.log(newMovie);
        try{
        const response = await axios.post("http://localhost:8080/addmovie", newMovie);
        console.log(response);
        response.data['200'] ? alert("Movie added successfully") : alert("Something went wrong");
        }catch{
            console.error("something went wrong");
        }

        resetForm();
    };

    const editMovie = (id) => {
        const movie = movies.find(m => m.id === id);
        setMovieForm({ ...movie,
                        id : id });
        setShowAddMovieForm(true);
    };

    const saveEditedMovie = async() => {
        setMovies(prevMovies => prevMovies.map(movie => movie.id === movieForm.id ? { ...movieForm } : movie));
        console.log(movieForm);
        try{
        const response = await axios.post("http://localhost:8080/updatemovie", movieForm);
        console.log(response);
        response.data['400'] ? alert("Changes saved successfully") : alert("Something went wrong");
        }catch{
            console.error("API error");
        }
        resetForm();
    };

    const deleteMovie = async (id) => {
        try{
            const response = await axios.post("http://localhost:8080/api/v1/movie/deleteM",{
                "id" : id
            })
            response?alert("deleted successfully"):alert("Something went wrong");
        }catch{
            alert("Something went wrong!");
        }
        setMovies(movies.filter(movie => movie.id !== id));
    };
    const scheduleMovie = (id) => {
        navigate('/schedule',{state : {id : id}});
    };

    const resetForm = () => {
        setMovieForm({
            id: null,
            movieTitle: null,
            posterSrc: null,
            movieCast: null,
            movieCategory: null,
            movieDirector: null,
            movieProducer: null,
            releaseDate: null,
            synopsis: null,
            reviews: null,
            trailerLink: null,
            movieCertificationCode: null,
            rating: null,
            movieAvailability: null,
            bannerSrc:null,
            language: null
        // showtimes: []
        });
        setShowAddMovieForm(false);
    };

    return (
        <div>
            <div className="manage-movies">
                <h5>Manage Movies</h5>
                <button onClick={() => setShowAddMovieForm(!showAddMovieForm)} className="btn btn-add">
                    {showAddMovieForm ? 'Cancel' : 'Add Movie'}
                </button>
                {showAddMovieForm && (
                    <div className="add-movie-form">
                        <input type="text" name="movieTitle" placeholder="Name" value={movieForm.movieTitle} onChange={handleInputChange} />
                        <input type="text" name="posterSrc" placeholder="Image URL" value={movieForm.posterSrc} onChange={handleInputChange} />
                        <input type="text" name="movieCast" placeholder="Cast" value={movieForm.movieCast} onChange={handleInputChange} />
                        <input type="text" name="movieCategory" placeholder="Category" value={movieForm.movieCategory} onChange={handleInputChange} />
                        <input type="text" name="movieDirector" placeholder="Director" value={movieForm.movieDirector} onChange={handleInputChange} />
                        <input type="text" name="movieProducer" placeholder="Producer" value={movieForm.movieProducer} onChange={handleInputChange} />
                        <input type="date" name="releaseDate" placeholder="Release Date" value={movieForm.releaseDate} onChange={handleInputChange} />
                        <textarea name="synopsis" placeholder="Synopsis" value={movieForm.synopsis} onChange={handleInputChange} />
                        <textarea name="reviews" placeholder="Reviews" value={movieForm.reviews} onChange={handleInputChange} />
                        <input type="text" name="trailerLink" placeholder="Trailer Link" value={movieForm.trailerLink} onChange={handleInputChange} />
                        <input type="text" name="movieCertificationCode" placeholder="Certification Code" value={movieForm.movieCertificationCode} onChange={handleInputChange} />
                        <input type="number" name="rating" placeholder="Rating" value={movieForm.rating} onChange={handleInputChange} />
                        <input type="text" name="movieAvailability" placeholder="Availability" value={movieForm.movieAvailability} onChange={handleInputChange} />
                        <input type="text" name="bannerSrc" placeholder="Banner Source" value={movieForm.bannerSrc} onChange={handleInputChange} />
                        <input type="text" name="language" placeholder="Language" value={movieForm.language} onChange={handleInputChange} />
                        <button onClick={movieForm.id ? saveEditedMovie : addMovie} className="btn btn-add">
                            {movieForm.id ? 'Save Changes' : 'Add Movie'}
                        </button>
                    </div>
                )}
                <div className="movie-list">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie">
                            <img src={movie.posterSrc} alt={movie.name} />
                            <div className="movie-info">
                                <h3>{movie.name}</h3>
                                <div>
                                    <button onClick={() => deleteMovie(movie.id)} className="btn btn-delete">Delete</button>
                                    <button onClick={() => editMovie(movie.id)} className="btn btn-edit">Edit</button>
                                    <button onClick={() => scheduleMovie(movie.id)} className="btn btn-schedule">Schedule</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ManageMovies;
