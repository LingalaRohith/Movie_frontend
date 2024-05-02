import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Schedule = () => {
  const location = useLocation();
  const [shows,setShows] = useState([]);
  const [formData, setFormData] = useState({
    movieId: location.state.id,
    showDate: '',
    showTime: '', // Changed from time to showTime
    duration_minutes: '' // Corrected name attribute
  });

  useEffect(() => {
    async function fetchShows() {
        try {
            const response = await axios.post('http://localhost:8080/getShowsByMovieID',{"movieID" : location.state.id});
            setShows(response.data["400"] || []);
            // localStorage.setItem('movies', JSON.stringify(response.data));
            console.log(shows);
        } catch (error) {
            console.error('Error fetching Shows:', error);
        }
    }
    fetchShows();
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/addShow', formData);
      console.log('Data submitted successfully:', response.data);
      // Reset form fields after successful submission if needed
      setFormData({
        ...formData,
        showDate: '',
        showTime: '',
        duration_minutes: ''
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Submit Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" name="showDate" value={formData.showDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Time:</label>
          <select name="showTime" value={formData.showTime} onChange={handleChange} required>
            <option value="">Select Time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            {/* Add more time options as needed */}
          </select>
        </div>
        <div>
          <label>Duration:</label>
          <input type="text" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Schedule;
