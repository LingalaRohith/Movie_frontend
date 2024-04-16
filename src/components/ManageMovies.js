import React, { useState } from 'react';
import Header from './Header';
import './ManageMovies.css';

function ManageMovies() {
    const initialMovies = [
        { id: 1, name: 'Bob Marley: One Love', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Bob_Marley_One_Love.jpg/220px-Bob_Marley_One_Love.jpg', showtimes: [] },
        { id: 2, name: 'Madame Web', img: 'https://shorturl.at/ruvL2', showtimes: [] },
        { id: 3, name: 'Dune: Part Two', img: 'https://shorturl.at/BGVX2', showtimes: [] },
        { id: 4, name: 'Kung Fu Panda 4', img: 'https://shorturl.at/fyP09', showtimes: [] },
        {
            id: 5,
            name: "GK",
            movieCast: null,
            movieCategory: "Drama",
            movieDirector: null,
            movieProducer: null,
            releaseDate: "2025-02-20",
            synopsis: null,
            reviews: null,
            trailerLink: "https://www.youtube.com/watch?v=DYLG65xz55U",
            movieCertificationCode: null,
            rating: 4,
            movieAvailability: null,
            posterSrc: "https://cdn.gulte.com/wp-content/uploads/2023/12/Guntur-Kaaram-Posters3.png",
            bannerSrc: null,
            language: null,
            showtimes: []
        }
    ];

    const [movies, setMovies] = useState(initialMovies);
    const [newMovieName, setNewMovieName] = useState('');
    const [newMovieImg, setNewMovieImg] = useState('');
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [showAddMovieForm, setShowAddMovieForm] = useState(false); // State to track visibility of add movie form
    const [movieFields, setMovieFields] = useState({
        movieCast: '',
        movieCategory: '',
        movieDirector: '',
        movieProducer: '',
        releaseDate: '',
        synopsis: '',
        reviews: '',
        trailerLink: '',
        movieCertificationCode: '',
        rating: '',
        movieAvailability: '',
        bannerSrc: '',
        language: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMovieFields({ ...movieFields, [name]: value });
    };

    const addMovie = () => {
        if (!newMovieName) return; // Basic validation
        const newMovie = {
            id: movies.length + 1, // Simple id assignment
            name: newMovieName,
            img: newMovieImg,
            ...movieFields,
            showtimes: [],
        };
        setMovies([...movies, newMovie]);
        setNewMovieName('');
        setNewMovieImg('');
        setMovieFields({
            movieCast: '',
            movieCategory: '',
            movieDirector: '',
            movieProducer: '',
            releaseDate: '',
            synopsis: '',
            reviews: '',
            trailerLink: '',
            movieCertificationCode: '',
            rating: '',
            movieAvailability: '',
            bannerSrc: '',
            language: ''
        });
        setShowAddMovieForm(false); // Hide the add movie form after adding a movie
    };

    const deleteMovie = (id) => {
        setMovies(movies.filter((movie) => movie.id !== id));
    };

    const editMovie = (id) => {
        setEditingMovieId(id);
    };

    const saveEditedMovie = (id) => {
        setMovies((prevMovies) =>
            prevMovies.map((movie) =>
                movie.id === id ? { ...movie, name: newMovieName || movie.name, img: newMovieImg || movie.img, ...movieFields } : movie
            )
        );
        setEditingMovieId(null);
        setNewMovieName('');
        setNewMovieImg('');
        setMovieFields({
            movieCast: '',
            movieCategory: '',
            movieDirector: '',
            movieProducer: '',
            releaseDate: '',
            synopsis: '',
            reviews: '',
            trailerLink: '',
            movieCertificationCode: '',
            rating: '',
            movieAvailability: '',
            bannerSrc: '',
            language: ''
        });
    };

    return (
        <div>
            <Header />
            <div className="manage-movies">
                <h5>Manage Movies</h5>
                <div className="add-movie-form">
                    {showAddMovieForm && (
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newMovieName}
                                onChange={(e) => setNewMovieName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={newMovieImg}
                                onChange={(e) => setNewMovieImg(e.target.value)}
                            />
                            {Object.keys(movieFields).map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={`New ${field}`}
                                    value={movieFields[field]}
                                    name={field}
                                    onChange={handleInputChange}
                                />
                            ))}
                            <button onClick={addMovie} className="btn btn-add">
                                Add Movie
                            </button>
                        </>
                    )}
                    <button onClick={() => setShowAddMovieForm(!showAddMovieForm)} className="btn btn-add">
                        {showAddMovieForm ? 'Cancel' : 'Add Movie'}
                    </button>
                </div>
                <div className="movie-list">
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie">
                            <img src={movie.img} alt={movie.name} />
                            <div className="movie-info">
                                <h3>{movie.name}</h3>
                                {editingMovieId === movie.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="New Name"
                                            value={newMovieName}
                                            onChange={(e) => setNewMovieName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="New Image URL"
                                            value={newMovieImg}
                                            onChange={(e) => setNewMovieImg(e.target.value)}
                                        />
                                        {Object.keys(movieFields).map((field) => (
                                            <input
                                                key={field}
                                                type="text"
                                                placeholder={`New ${field}`}
                                                value={movieFields[field]}
                                                name={field}
                                                onChange={handleInputChange}
                                            />
                                        ))}
                                        <button
                                            onClick={() => saveEditedMovie(movie.id)}
                                            className="btn btn-save"
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => deleteMovie(movie.id)}
                                            className="btn btn-delete"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => editMovie(movie.id)}
                                            className="btn btn-edit"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ManageMovies;