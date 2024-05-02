import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageMovies.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 


function ManageMovies() {
    const [movies, setMovies] = useState([]);
    const { isLoggedIn } = useAuth(); 
    const navigate = useNavigate(); 

    const [movieForm, setMovieForm] = useState({
        id: null,
        name: '',
        img: '',
        cast: '',
        category: '',
        director: '',
        producer: '',
        releaseDate: '',
        synopsis: '',
        reviews: '',
        trailerLink: '',
        certificationCode: '',
        rating: '',
        availability: '',
        bannerSrc: '',
        language: '',
        duration: '',
        schedules: [] 
    });
    const [showAddMovieForm, setShowAddMovieForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) { 
          console.log("Not logged in, navigating to login.");
          navigate("/login", { replace: true });
        }
      }, [navigate, isLoggedIn]);


    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/movie/getallmovies');
                setMovies(response.data || []);
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

    const handleAddSchedule = (time, date) => {
        const newSchedule = { time, date };
        setMovieForm(prev => ({
            ...prev,
            schedules: [...prev.schedules, newSchedule]
        }));
    };

    const handleDeleteSchedule = (index) => {
        setMovieForm(prev => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== index)
        }));
    };

    const addMovie = () => {
        if (!movieForm.name) return;
        setMovies([...movies, { ...movieForm, id: movies.length + 1 }]);
        resetForm();
    };

    const editMovie = (id) => {
        const movie = movies.find(m => m.id === id);
        setMovieForm(movie);
        setShowAddMovieForm(true);
        setEditingSchedule(false);
    };

    const scheduleMovie = (id) => {
        const movie = movies.find(m => m.id === id);
        setMovieForm({
            ...movie
        });
        setShowAddMovieForm(true);
        setEditingSchedule(true);
    };

    const saveEditedMovie = () => {
        setMovies(prevMovies => prevMovies.map(movie => movie.id === movieForm.id ? { ...movieForm } : movie));
        resetForm();
    };

    const deleteMovie = (id) => {
        setMovies(movies.filter(movie => movie.id !== id));
    };

    const resetForm = () => {
        setMovieForm({
            id: null,
            name: '',
            img: '',
            cast: '',
            category: '',
            director: '',
            producer: '',
            releaseDate: '',
            synopsis: '',
            reviews: '',
            trailerLink: '',
            certificationCode: '',
            rating: '',
            availability: '',
            bannerSrc: '',
            language: '',
            duration: '',
            schedules: []
        });
        setShowAddMovieForm(false);
        setEditingSchedule(false);
    };

    return (
        <div className="manage-movies">
            <h5>Manage Movies</h5>
            <button onClick={() => setShowAddMovieForm(!showAddMovieForm)} className="btn btn-add">
                {showAddMovieForm ? 'Cancel' : 'Add Movie'}
            </button>
            {showAddMovieForm && (
                <div className="add-movie-form">
                    {editingSchedule ? (
                        <>
                            {movieForm.schedules.map((schedule, index) => (
                                <div key={index}>
                                    <span>{schedule.date} at {schedule.time}</span>
                                    <button onClick={() => handleDeleteSchedule(index)}>Delete</button>
                                </div>
                            ))}
                            <input
                                type="time"
                                onChange={(e) => handleInputChange({ target: { name: 'time', value: e.target.value }})}
                                placeholder="Select Show Time"
                            />
                            <input
                                type="date"
                                onChange={(e) => handleInputChange({ target: { name: 'date', value: e.target.value }})}
                                placeholder="Select Show Date"
                            />
                            <button onClick={() => handleAddSchedule(movieForm.time, movieForm.date)}>Add Schedule</button>
                        </>
                    ) : (
                        <>
                        <input type="text" name="name" placeholder="Name" value={movieForm.name} onChange={handleInputChange} />
                        <input type="text" name="img" placeholder="Image URL" value={movieForm.img} onChange={handleInputChange} />
                        <input type="text" name="cast" placeholder="Cast" value={movieForm.cast} onChange={handleInputChange} />
                        <input type="text" name="category" placeholder="Category" value={movieForm.category} onChange={handleInputChange} />
                        <input type="text" name="director" placeholder="Director" value={movieForm.director} onChange={handleInputChange} />
                        <input type="text" name="producer" placeholder="Producer" value={movieForm.producer} onChange={handleInputChange} />
                        <input type="date" name="releaseDate" placeholder="Release Date" value={movieForm.releaseDate} onChange={handleInputChange} />
                        <textarea name="synopsis" placeholder="Synopsis" value={movieForm.synopsis} onChange={handleInputChange} />
                        <textarea name="reviews" placeholder="Reviews" value={movieForm.reviews} onChange={handleInputChange} />
                        <input type="text" name="trailerLink" placeholder="Trailer Link" value={movieForm.trailerLink} onChange={handleInputChange} />
                        <input type="text" name="certificationCode" placeholder="Certification Code" value={movieForm.certificationCode} onChange={handleInputChange} />
                        <input type="number" name="rating" placeholder="Rating" value={movieForm.rating} onChange={handleInputChange} />
                        <input type="text" name="availability" placeholder="Availability" value={movieForm.availability} onChange={handleInputChange} />
                        <input type="text" name="bannerSrc" placeholder="Banner Source" value={movieForm.bannerSrc} onChange={handleInputChange} />
                        <input type="text" name="language" placeholder="Language" value={movieForm.language} onChange={handleInputChange} />
                        <input type="text" name="duration" placeholder="Duration" value={movieForm.duration} onChange={handleInputChange} />
                    </>
                    )}
                    <button onClick={movieForm.id ? saveEditedMovie : addMovie} className="btn btn-save">
                        {movieForm.id ? 'Save Changes' : 'Add Movie'}
                    </button>
                </div>
            )}
            <div className="movie-list">
                {movies.map(movie => (
                    <div key={movie.id} className="movie">
                        <img src={movie.img} alt={movie.name} />
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
    );
}

export default ManageMovies;



                            



