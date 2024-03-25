import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import './OrderConfirmation.css'; 

function  OrderConfirmation({isLoggedIn}) {

  const location = useLocation();
  const { movie, localSelectedSeats, showShowDates, showShowTimes, total } = location.state;

  // Generate a random booking confirmation number
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

  return (
    <> 
    <Header isLoggedIn={isLoggedIn}/>
    <div className="order-confirmation-container">
    <div className="order-confirmation-container">
    <div className="checkmark-wrapper">
    <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="checkmark-check" fill="none" d="M12,26 l10,8 l20,-20"/>
    </svg>
  </div>
      <h1 className="confirmation-header">Thank you for your order</h1>
      <p>See you at the theater</p>
      <div className="confirmation-details">
        <div className="confirmation-item">
          <strong>Booking number:</strong> {confirmationNumber}
        </div>
        <img src={movie.img} alt="Movie Poster" className="movie-poster" />
        <div className="confirmation-item">
          <strong>{movie.title}</strong> {showShowDates} at {showShowTimes}
        </div>
        <div className="confirmation-item">
          <strong>Seats:</strong> {localSelectedSeats.join(', ')}
        </div>
        <div className="total-price">
          <strong>Order Total:</strong> ${total.toFixed(2)}
        </div>
      </div>
      <p className="confirmation-footer">A confirmation of your order has been sent to your email.</p>
    </div>
</div>
    </>
  );
}

export default OrderConfirmation;



