import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';
import { useAuth } from './AuthContext';
import axios from 'axios';


function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { isLoggedIn } = useAuth(); 
  const {
    movie,
    localSelectedSeats,
    showDates,
    showTimes,
    total, 
    formData,
    cardData,
    showId,
    promoCode,
    localTicketQuantities,
    ticketPrices
  } = location.state || {};
  console.log(ticketPrices);
  console.log(localTicketQuantities);

  const formattedTime = showTimes ? `${parseInt(showTimes)}:00` : 'Unknown time'; 
  const formattedDate = showDates ? new Date(showDates).toLocaleDateString() : 'Unknown date';

  const createTickets = () => {
    let tickets = [];
    let seatIndex = 0;

    Object.keys(localTicketQuantities).forEach(type => {
      for (let i = 0; i < localTicketQuantities[type]; i++) {
        if (seatIndex < localSelectedSeats.length) {
          tickets.push({
            bookingId: 0,
            seatId: localSelectedSeats[seatIndex],
            ticketType: type.charAt(0).toUpperCase() + type.slice(1), 
            ticketPrice: ticketPrices[type]
          });
          seatIndex++;
        }
      }
    });
    return tickets;
  };
  const tickets = createTickets();
  const todayDate = new Date().toISOString().split('T')[0];
  const bookingData = {
    booking: {
      customerId : cardData.userID,
      paymentId : cardData.cardID,
      movieId: movie.id,
      showId: showId, 
      promoCode: promoCode, 
      totalPrice: total,
      bookingDate: todayDate,
      bookingStatus: 1, 
      paymentStatus: 1
    },
    tickets
  }
  const handleConfirmBooking = async () => {
    if (isLoggedIn && bookingData && bookingData.tickets.length > 0) {
      try {
        console.log(JSON.stringify(bookingData, null, 2)); 
        const response = await axios.post('http://localhost:8080/addBooking', bookingData);
        console.log('Booking Confirmation Response:', response.data);
        alert('Booking successful!'); // Optionally, navigate to a success page or display a success message
      } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking. Please try again.');
      }
    }
  };
  
  
  useEffect(() => {
    if (!isLoggedIn) { 
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    }
  }, [navigate, isLoggedIn]); 

  const generateConfirmationNumber = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const confirmationNumber = generateConfirmationNumber();

  if (!location.state) {
    return <p>Order information is missing. Please complete the checkout process.</p>;
  }
  

  return (
    <div className="order-confirmation-container">
      <div className="checkmark-wrapper">
        <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark-check" fill="none" d="M12,26 l10,8 l20,-20"/>
        </svg>
      </div>
      <h1 className="confirmation-header">Thank you for your order</h1>
      <p>See you at the theater!</p>
      <div className="confirmation-details">
        <div className="confirmation-item">
          <strong>Booking number:</strong> {confirmationNumber}
        </div>
        <img src={movie.posterSrc} alt={`${movie.movieTitle} Poster`} className="movie-poster" />
        <div className="confirmation-item">
          <strong>{movie.movieTitle}</strong> on {formattedDate} at {formattedTime}
        </div>
        <div className="confirmation-item">
          <strong>Seats:</strong> {localSelectedSeats.join(', ')}
        </div>
        <div className="total-price">
          <strong>Order Total:</strong> ${total.toFixed(2)}
        </div>
      </div>
      <button onClick={handleConfirmBooking} className="confirm-booking-button">Click to Complete!</button>
      <p className="confirmation-footer">A confirmation of your order has been sent to your email.</p>
    </div>
  );
}

export default OrderConfirmation;
