import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistroy() {
  const [bookings, setBookings] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const [custId, setCustId] = useState(userData ? userData.customer.customerID : 0); 

  useEffect(() => {
    if (userData) {
      setCustId(userData.customer.userID);
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/getCustomerBookings', {
            customerID : custId
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [custId]);

  return (
    <div>
      <h2>Customer Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Booking Date</th>
            <th>Movie</th>
            <th>Show Date</th>
            <th>Show Time</th>
            <th>Total</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.booking.bookingId}>
              <td>{booking.booking.bookingId}</td>
              <td>{booking.booking.bookingDate}</td>
              <td>{booking.movie.movieTitle}</td>
              <td>{booking.show.showDate}</td>
              <td>{booking.show.showTime}</td>
              <td>{booking.booking.totalPrice}</td>
              {/* Add more table cells for additional data */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistroy;
