import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './Checkout.css';


function Checkout({isLoggedIn}) {
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCVC] = useState('');
  const [expDate, setExpDate] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false); // Starts as false indicating new card details are shown by default
  const location = useLocation();
  const { movie, selectedSeats, localTicketQuantities, showShowDates, showShowTimes, localSelectedSeats} = location.state || { localTicketQuantities: { adults: 0, children: 0, seniors: 0 }, selectedSeats: [], movie: {}, showShowDates: '', showShowTimes: '', localSelectedSeats: [] };
  
  // Example ticket prices
  const ticketPrices = { adults: 16, children: 12, seniors: 10 };
  const bookingFee = 2;
  const taxRate = 0.07; // 7%

  const subtotal = localTicketQuantities ? Object.keys(localTicketQuantities).reduce((acc, key) => acc + (localTicketQuantities[key] * ticketPrices[key]), 0) : 0;
  const taxes = subtotal * taxRate;
  const total = subtotal + bookingFee + taxes;

  const handleSubmit = (event) => {
    event.preventDefault(); 
    // Navigate to OrderConfirmation page
    navigate('/order-confirmation', {
      state: {
        movie: movie,
        localSelectedSeats: localSelectedSeats, 
        selectedSeats: selectedSeats,
        showShowDates: showShowDates,
        showShowTimes: showShowTimes,
        total: total
      }
    });
  };
  
  const savedCard = {
      cardNumber: '●●●● ●●●● ●●●● 5058',
      cardHolder: 'furwah t'
  
  };
  // Function to handle clicking the saved card
  const toggleUseSavedCard = () => {
    setUseSavedCard(!useSavedCard);
  };

  const navigate = useNavigate();



  return (
    <>
      <Header isLoggedIn={isLoggedIn}/>
      <div className="order-summary-container">
        <div className="review-order-section">
          <h1>Review Order</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <h2>Payment</h2>
            <div className={`saved-card-display ${useSavedCard ? 'active' : ''}`} onClick={toggleUseSavedCard}>
            <div className="card-chip"></div>
            <div className="card-logo">{savedCard.cardType}</div>
            <div className="card-number">{savedCard.cardNumber}</div>
            <div className="card-holder-name">
    <span className="card-holder-label"></span> {savedCard.cardHolder}
  </div>
</div>
            {/* Show input fields if saved card is not being used */}
            {!useSavedCard && (
              <>

            <label htmlFor="cardName">Name on Card</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />

            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />

            <label htmlFor="cvc">CVC</label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCVC(e.target.value)}
              required
            />

            <label htmlFor="expDate">Expiration Date</label>
            <input
              type="text"
              id="expDate"
              name="expDate"
              placeholder="MM/YY"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
</>
            )}
            <h2>Billing Information</h2>
            <label htmlFor="billingAddress">Billing Address</label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              placeholder="Billing address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              required
            />

            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />

            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="Zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />

            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
        
   <div className="order-summary-card" >
          <h2>Order Summary</h2>
          <div className="order-summary-item"> 
          <p>{movie.title}</p>
          <div className="order-summary-item">
          <p> {showShowDates}</p>
          <p className="show-times"> {showShowTimes}</p>

          </div>
          <div className="order-summary-item">
          <p>Seats: {(localSelectedSeats || []).join(', ')}</p>
          </div>
          </div>
            <div className="order-summary-item">
            <div className="order-summary-item">
  <div className="ticket-type-row">
    <p className="ticket-type">Adult</p>
    <div className="ticket-info">
      <span className="ticket-quantity">Quantity: {localTicketQuantities.adults}</span>
      <span className="ticket-price">${(localTicketQuantities.adults * ticketPrices.adults).toFixed(2)}</span>
    </div>
  </div>
  <div className="ticket-type-row">
    <p className="ticket-type">Child</p>
    <div className="ticket-info">
      <span className="ticket-quantity">Quantity: {localTicketQuantities.children}</span>
      <span className="ticket-price">${(localTicketQuantities.children * ticketPrices.children).toFixed(2)}</span>
    </div>
  </div>
  <div className="ticket-type-row">
    <p className="ticket-type">Senior</p>
    <div className="ticket-info">
      <span className="ticket-quantity">Quantity: {localTicketQuantities.seniors}</span>
      <span className="ticket-price">${(localTicketQuantities.seniors * ticketPrices.seniors).toFixed(2)}</span>
    </div>
  </div>
  {/* ... */}
</div>
</div>

    <div className="order-summary-item"> 
          <p>Subtotal:</p> <div className="align-right"> ${subtotal.toFixed(2)}</div> 
            <p>Booking Fee: </p> <div className="align-right"> ${bookingFee.toFixed(2)}</div> 
            <p>Taxes:</p> <div className="align-right"> ${taxes.toFixed(2)} </div> 
            </div>
            <p className="total-price">
              Total:  </p> 
              <div className="align-right">  ${total.toFixed(2)} </div> 
          <div className="promo-code-section">
          <input type="text" placeholder="Promo Code" />
          <button className="apply-button">Apply</button>

</div>
        </div>
        </form>
        <div class="button-container">
        <button type="button" className="order-button cancel-order-btn" onClick={() => navigate('/')}>
  Cancel
</button>





<form onSubmit={handleSubmit}>

<button class="order-button submit-order-btn">Submit Order</button>
</form>

</div>


        </div>
      </div>
    </>
  );
}

export default Checkout;
