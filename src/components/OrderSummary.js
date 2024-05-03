import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSummary.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from './AuthContext';


const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { isLoggedIn } = useAuth(); 
  useEffect(() => {
    if (!isLoggedIn) { 
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    }
  }, [navigate, isLoggedIn]); 


  const { movie, selectedSeats, ticketQuantities, showDates, showTimes, selectedShowTime, selectedDate, showId } = location.state || {
    movie: {}, selectedSeats: [], ticketQuantities: {}, showDates: '', showTimes: ''
  };
  const [localTicketQuantities, setLocalTicketQuantities] = useState(ticketQuantities);
  const [localSelectedSeats, setLocalSelectedSeats] = useState(selectedSeats);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!location.state) {
    return <p>Order information is missing. Please complete the booking process from the home page.</p>;
  }

  const ticketPrices = {
    // adult: parseFloat(sessionStorage.getItem('price_adult')) || 16,
    // child: parseFloat(sessionStorage.getItem('price_child')) || 10,
    // senior: parseFloat(sessionStorage.getItem('price_senior')) || 12
    adult: parseFloat(localStorage.getItem('price_adult')),
    child: parseFloat(localStorage.getItem('price_child')),
    senior: parseFloat(localStorage.getItem('price_senior'))
};
// const bookingFee = parseFloat(sessionStorage.getItem('bookingFee')) || 2;
const bookingFee = parseFloat(localStorage.getItem('bookingFee')) || 2;
const taxRate = 0.07; // 7%%

  const updateTicketQuantity = (type, increment) => {
    setLocalTicketQuantities(prev => {
      const updatedQuantities = {
        ...prev,
        [type]: Math.max(0, prev[type] + (increment ? 1 : -1)),
      };

      adjustSeatsForTicketChange(updatedQuantities);
      return updatedQuantities;
    });
  };

  const deleteTicketType = (type) => {
    setLocalTicketQuantities(prev => {
      const { [type]: _, ...rest } = prev;
      adjustSeatsForTicketChange(rest);
      return rest;
    });
  };


  const adjustSeatsForTicketChange = (newTicketQuantities) => {
    const newTotalTickets = Object.values(newTicketQuantities).reduce((acc, curr) => acc + curr, 0);
    let updatedSelectedSeats = [...localSelectedSeats];
    
    if (newTotalTickets > updatedSelectedSeats.length) {
      navigate('/bookseats', {
        state: {
          movie,
          total,
          existingSelections: updatedSelectedSeats,
          ticketQuantities: newTicketQuantities,
          showDates,
          showTimes,
          additionalSeatsNeeded: newTotalTickets - updatedSelectedSeats.length,
          showId,
          promoCode,
        }
      });
    } else if (newTotalTickets < updatedSelectedSeats.length) {
      updatedSelectedSeats = updatedSelectedSeats.slice(0, newTotalTickets);
      setLocalSelectedSeats(updatedSelectedSeats);
    }
  };

  const calculatePrice = (ticketType) => localTicketQuantities[ticketType] ? localTicketQuantities[ticketType] * ticketPrices[ticketType] : 0;
  const subtotal = Object.keys(localTicketQuantities).reduce((acc, curr) => acc + calculatePrice(curr), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + bookingFee - discount;

  const handlePromo = async () => {
    try {
      console.log('Fetching promos for promocode:', promoCode);
      const response = await axios.post('http://localhost:8080/getPromoByCode', { "promoCode" : promoCode });
      if (response.data !== "") {
        const promo = response.data;
        console.log('Promo discount to apply:', promo.discountApplied);
        setDiscount(promo.discountApplied);
      } else {
        alert("Invalid promo code");
      }
    } catch (error) {
      console.error('Error fetching promo:', error);
    }
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  const navigateToCheckout = () => {
    const totalTickets = Object.values(localTicketQuantities).reduce((sum, quantity) => sum + quantity, 0);
    if (totalTickets === 0) {
      setError('You need to buy at least one ticket to proceed.');
    } else {
      navigate('/checkout', { 
        state: { 
          localSelectedSeats, 
          localTicketQuantities, 
          movie, 
          subtotal, 
          tax,
          discount, 
          total, 
          showDates, 
          showTimes,
          showId,
          ticketQuantities,
          ticketPrices,
          promoCode
        }
      });
    }
  };
  return (
    <>
    <div className="order-special-page"> 
      <div className="order-summary-containers">
      <div class="main-container">
        <h2 className="order-summary-title">Order Summary</h2>
        <div className="order-summary-details">
          <div className="detail-line">Movie: {movie.movieTitle}</div>
          <div className="detail-line">Show Date: {showDates}</div>
          <div className="detail-line">Show Time: {showTimes}:00</div>
          <div className="detail-line">Selected Seats: {localSelectedSeats.join(', ')}</div>
          <div className="tickets-container">
            {Object.entries(localTicketQuantities).map(([type, quantity]) => (
              <div className="ticket-detail" key={type}>
                <span>{`${type.charAt(0).toUpperCase() + type.slice(1)}: ${quantity} x $${ticketPrices[type]}`}</span>
                <span>= ${calculatePrice(type).toFixed(2)}</span>
                <div className="quantity-buttons">
                  <button onClick={() => updateTicketQuantity(type, true)}>+</button>
                  <button onClick={() => updateTicketQuantity(type, false)}>-</button>
                  <button onClick={() => deleteTicketType(type)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="promo-code-section">
          <input 
                  type="text" 
                  placeholder="Promo Code"
                  value={promoCode} // Bind the value of the input field to the promoCode state variable
                  onChange={(e) => setPromoCode(e.target.value)} // Update the promoCode state variable when the input value changes
                />
          <button className="apply-button" onClick={handlePromo}>Apply</button>
          </div>
          <div className="detail-line">Subtotal: ${subtotal.toFixed(2)}</div>
          <div className="detail-line">Tax (7%): ${tax.toFixed(2)}</div>
          <div className="detail-line">Booking Fee: ${bookingFee.toFixed(2)}</div>
          {discount !== 0 && <div className="detail-line">Discount from promo code: -${discount.toFixed(2)}</div>}
          <div className="detail-line total">Total: ${total.toFixed(2)}</div>
          </div> 
          <div className="button-container">
          <button className="order-summary-button back-button" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button className="order-summary-button confirm-continue-button" onClick={navigateToCheckout}>Confirm and Continue</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;


