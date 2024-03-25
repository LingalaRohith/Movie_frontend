import React, { useState } from 'react';
import Header from './Header';
import './ManageMovies.css';

function ManageMovies() {
    const initialMovies = [
        { id: 1, name: 'Bob Marley: One Love', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Bob_Marley_One_Love.jpg/220px-Bob_Marley_One_Love.jpg', showtimes: [] },
        { id: 2, name: 'Madame Web', img: 'https://shorturl.at/ruvL2', showtimes: [] },
        { id: 3, name: 'Dune: Part Two', img: 'https://shorturl.at/BGVX2', showtimes: [] },
        { id: 4, name: 'Kung Fu Panda 4', img: 'https://shorturl.at/fyP09', showtimes: [] },
    ];

    const [movies, setMovies] = useState(initialMovies);
    const [newMovieName, setNewMovieName] = useState('');
    const [newMovieImg, setNewMovieImg] = useState('');
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [newShowtime, setNewShowtime] = useState('');

    const addMovie = () => {
        if (!newMovieName) return; // Basic validation
        const newMovie = {
            id: movies.length + 1, // Simple id assignment
            name: newMovieName,
            img: newMovieImg,
            showtimes: [],
        };
        setMovies([...movies, newMovie]);
        setNewMovieName('');
        setNewMovieImg('');
    };

    const deleteMovie = (id) => {
        setMovies(movies.filter((movie) => movie.id !== id));
    };

    const editMovie = (id) => {
        setEditingMovieId(id);
    };

    const addShowtime = () => {
        if (newShowtime.trim() !== '') {
            setMovies((prevMovies) =>
                prevMovies.map((movie) =>
                    movie.id === editingMovieId
                        ? { ...movie, showtimes: [...movie.showtimes, newShowtime] }
                        : movie
                )
            );
            setNewShowtime('');
        }
    };

    const saveEditedMovie = (id) => {
        setMovies((prevMovies) =>
            prevMovies.map((movie) =>
                movie.id === id ? { ...movie, name: newMovieName || movie.name, img: newMovieImg || movie.img } : movie
            )
        );
        setEditingMovieId(null);
        setNewMovieName('');
        setNewMovieImg('');
    };

    return (
        <div>
            <Header />
            <div className="manage-movies">
                <h5>Manage Movies</h5>
                <div className="add-movie-form">
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
                    <button onClick={addMovie} className="btn btn-add">
                        Add Movie
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            {movies.map((movie) => (
                                <th key={movie.id}>{movie.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {movies.map((movie) => (
                                <td key={movie.id}>
                                    <img
                                        src={movie.img}
                                        alt={movie.name}
                                        width="100px"
                                        height="200px"
                                    ></img>
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
                                            <input
                                                type="text"
                                                placeholder="New Cast"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Director"
                                            />
                                            <input
                                            type="text"
                                            placeholder="New Category"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Producer"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Synopsis"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Reviews"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Review"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Trailer"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Film Rating"
                                            />
                                            <button
                                                onClick={() => saveEditedMovie(movie.id)}
                                                className="btn btn-delete"
                                            >
                                                Save
                                            </button>
                                            <input type="text"
                                            placeholder="New Showtime"
                                            value={newShowtime}
                                            onChange={(e) => setNewShowtime(e.target.value)}
                                            />
                                            <button onClick={addShowtime} className="btn btn-add"> Add Showtime
                                             </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                onClick={() => deleteMovie(movie.id)}
                                                className="btn btn-delete"
                                            >
                                                Delete Movie
                                            </button>
                                            <button
                                                onClick={() => editMovie(movie.id)}
                                                className="btn btn-delete"
                                            >
                                                Edit Movie
                                            </button>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageMovies;