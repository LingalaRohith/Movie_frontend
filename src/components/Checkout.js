import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './Checkout.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';



function Checkout() {
  const [email, setEmail] = useState('');
  const { isLoggedIn } = useAuth(); 

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const navigate = useNavigate();

  const [cvc, setCVC] = useState('');
  const [expDate, setExpDate] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false); // Starts as false indicating new card details are shown by default
  const location = useLocation();
  const { movie, selectedSeats, localTicketQuantities, showDates, showTimes, localSelectedSeats, total } = location.state || {
    localTicketQuantities: { adults: 0, children: 0, seniors: 0 },
    selectedSeats: [],
    movie: {},
    showDates: '',
    showTimes: '',
    localSelectedSeats: [],
    total: 0  // Default value if total isn't passed
  };
    const [card,setCard] = useState([]);
  // Example ticket prices
  const ticketPrices = { adults: 16, children: 12, seniors: 10 };
  const bookingFee = 2;
  const taxRate = 0.07; // 7%

  const subtotal = localTicketQuantities ? Object.keys(localTicketQuantities).reduce((acc, key) => acc + (localTicketQuantities[key] * ticketPrices[key]), 0) : 0;
  const taxes = subtotal * taxRate;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); 

  useEffect(() => {
    if (!isLoggedIn) { 
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    } else if (!location.state) {
      console.log("Missing movie data, navigating home.");
      navigate("/", { replace: true });
    }
  }, [navigate, movie, isLoggedIn]); 

const handleCardClick = (index, cardDetail) => {
  if (selectedCardIndex === index) { 
    setSelectedCardIndex(null);
    setUseSavedCard(false);
  } else {
    setSelectedCardIndex(index); 
    setUseSavedCard(true); 
    setCardName(cardDetail.nameOnCard);
    setCardNumber(cardDetail.cardNumber);
    setCVC(cardDetail.securityNumber); 
    setExpDate(cardDetail.expiryDate);
  }
};


const handleSubmit = (event) => {
  event.preventDefault(); 
  const cardData = selectedCardIndex !== null ? card[selectedCardIndex] : {
    cardName,
    cardNumber,
    cvc,
    expDate
  };

  const formData = {
    email,
    cardData,
    billingAddress,
    city,
    state,
    zipCode,
    country,
    total
  };
  console.log('Submitting:', formData);
  navigate('/order-confirmation', {
    state: {
      movie,
      localSelectedSeats,
      selectedSeats,
      showDates,
      showTimes,
      total,
      cardData,
      formData
    }
  });
};


  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const email = sessionStorage.getItem('email');  
        if (!email) {
          console.error('No email found in storage.');
          return;
        }
  
        const response = await axios.post('http://localhost:8080/getcustomerx', { email });
        if (response.data[204]) {
          console.log('No customer found for this email.');
          return;
        }
  
        const customerData = response.data[200];
        setCard(customerData.cardDetails);
        console.log('Card details:', customerData.cardDetails);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };
  
    fetchCustomerDetails();
  }, []);
  
  
  
  
  const savedCard = {
      cardNumber: '●●●● ●●●● ●●●● 5058',
      cardHolder: 'furwah t'
  
  };
  // Function to handle clicking the saved card
  const toggleUseSavedCard = () => {
    setUseSavedCard(!useSavedCard);
  };


  return (
    <>
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
        <div className="saved-card-section">
          <h3>Saved Cards</h3>
          {card.length > 0 ? (
            <div className="saved-cards-container">
              {card.map((cardDetail, index) => (
                <div key={index} 
                    className={`saved-card-display ${selectedCardIndex === index ? 'selected' : ''}`} 
                    onClick={() => handleCardClick(index, cardDetail)}>
                  <div className="card-chip"></div>
                  <div className="card-logo">{cardDetail.cardType}</div>
                  <div className="card-number">{`●●●● ●●●● ●●●● ${cardDetail.cardNumber.slice(-4)}`}</div>
                  <div className="card-holder-name">{cardDetail.nameOnCard}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-saved-cards">No saved cards available.</p>
          )}
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
