import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Schedule = () => {
  const location = useLocation();
  const [shows, setShows] = useState([]);
  const [formData, setFormData] = useState({
    // showId : '',
    movieId: location.state.id,
    showDate: '',
    showTime: '',
    duration_minutes: 180
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchShows() {
      try {
        const response = await axios.post('http://localhost:8080/getShowsByMovieID', { "movieID": location.state.id });
        setShows(response.data["400"] || []);
      } catch (error) {
        console.error('Error fetching Shows:', error);
      }
    }
    fetchShows();
  }, [location.state.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const processedValue = (name === 'showTime' || name === 'duration_minutes') ? parseInt(value) : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/addShow', formData);
      console.log('Data submitted successfully:', response.data);
      setShows(prevShows => [...prevShows, response.data]); // Add new show to state
      setFormData({
        // showId: '',
        movieId: location.state.id,
        showDate: '',
        showTime: '',
        duration_minutes: 180
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleDelete = async (showId) => {
    try {
      const response = await axios.post("http://localhost:8080/deleteShow",{"showId" : showId});
      response ? alert("Show deleted successfully") : alert("Something went wrong");
      setShows(prevShows => prevShows.filter(show => show.showId !== showId));
    } catch (error) {
      console.error('Error deleting show:', error);
    }
  };

  return (
    <div>
      <h2>Schedule</h2>
      <div style={{ textAlign: 'center' }}>
        <table>
          <thead>
            <tr>
              <th>Show ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show.showId}>
                <td>{show.showId}</td>
                <td>{show.showDate}</td>
                <td>{show.showTime}</td>
                <td>
                  <button onClick={() => handleDelete(show.showId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowForm(!showForm)}>Add</button>
        {showForm && (
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
                   <option value="10">10:00 AM</option>
                   <option value="13">13:00 PM</option>
                   <option value="16">16:00 PM</option>
                   <option value="19">19:00 PM</option>
                   <option value="22">22:00 PM</option>
                   {/* Add more time options as needed */}
                 </select>
            </div>
            {/* <div>
              <label>Duration:</label>
              <input type="text" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
            </div> */}
            <button type="submit">Submit</button>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const Schedule = () => {
//   const location = useLocation();
//   const [shows, setShows] = useState([]);
//   const [formData, setFormData] = useState({
//     movieId: location.state.id,
//     showDate: '',
//     showTime: '',
//     duration_minutes: ''
//   });
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     async function fetchShows() {
//       try {
//         const response = await axios.post('http://localhost:8080/getShowsByMovieID', { "movieID": location.state.id });
//         setShows(response.data["400"] || []);
//       } catch (error) {
//         console.error('Error fetching Shows:', error);
//       }
//     }
//     fetchShows();
//   }, [location.state.id]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     const processedValue = (name === 'showTime' || name === 'duration_minutes') ? parseInt(value) : value;
//     setFormData({ ...formData, [name]: processedValue });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//         console.log(formData);
//       const response = await axios.post('http://localhost:8080/addShow', formData);
//       console.log('Data submitted successfully:', response.data);
//       setShows(prevShows => [...prevShows, response.data]); // Add new show to state
//       setFormData({
//         movieId: location.state.id,
//         showDate: '',
//         showTime: '',
//         duration_minutes: ''
//       });
//     } catch (error) {
//       console.error('Error submitting data:', error);
//     }
//   };

//   const handleDelete = async (showID) => {
//     try {
//       const response = await axios.delete(`http://localhost:8080/deleteShow/${showID}`);
//       console.log('Show deleted successfully:', response.data);
//       setShows(prevShows => prevShows.filter(show => show.showID !== showID));
//     } catch (error) {
//       console.error('Error deleting show:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Schedule</h2>
//       <div style={{ textAlign: 'center' }}>
//         <table>
//           <thead>
//             <tr>
//               <th>Show ID</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {shows.map(show => (
//               <tr key={show.showId}>
//                 <td>{show.showId}</td>
//                 <td>{show.showDate}</td>
//                 <td>{show.showTime}</td>
//                 <td>
//                   <button onClick={() => handleDelete(show.showID)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button onClick={() => setShowForm(!showForm)}>Add</button>
//         {showForm && (
//           <div>
//             <h2>Submit Form</h2>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <label>Date:</label>
//                 <input type="date" name="showDate" value={formData.showDate} onChange={handleChange} required />
//               </div>
//               <div>
//                 <label>Time:</label>
//                 <select name="showTime" value={formData.showTime} onChange={handleChange} required>
//                   <option value="">Select Time</option>
//                   <option value="10">10:00 AM</option>
//                   <option value="13">13:00 PM</option>
//                   <option value="16">16:00 PM</option>
//                   <option value="19">19:00 PM</option>
//                   <option value="22">22:00 PM</option>
//                   {/* Add more time options as needed */}
//                 </select>
//               </div>
//               <div>
//                 <label>Duration:</label>
//                 <input type="text" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
//               </div>
//               <button type="submit">Submit</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Schedule;
