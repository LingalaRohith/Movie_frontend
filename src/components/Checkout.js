import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Checkout() {
  const [email, setEmail] = useState('');
  const { isLoggedIn } = useAuth();
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCVC] = useState('');
  const [expDate, setExpDate] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [cardData, setCardData] = useState({});
  const [card, setCard] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [userID, setUserID] = useState(null); 


  const navigate = useNavigate();
  const location = useLocation();
  const { promoCode, movie, selectedSeats, localTicketQuantities, showDates, showTimes, localSelectedSeats, total, showId, ticketPrices } = location.state || {
    localTicketQuantities: { adult: 0, child: 0, senior: 0 },
    selectedSeats: [],
    movie: {},
    showDates: '',
    showTimes: '',
    localSelectedSeats: [],
    total: 0 
  };

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Not logged in, navigating to login.");
      navigate("/login", { replace: true });
    } else if (!location.state) {
      console.log("Missing movie data, navigating home.");
      navigate("/", { replace: true });
    } else {
      fetchUserID().then(id => setUserID(id)); // Fetch and set userID upon component mount
    }
  }, [navigate, movie, isLoggedIn]);

  const handleCardClick = (index, cardDetail) => {
    setSelectedCardIndex(index);
    setUseSavedCard(true);
    setCardData(cardDetail);
  };

  const fetchUserID = async () => {
    try {
      const email = sessionStorage.getItem('email'); 
      const response = await axios.post('http://localhost:8080/getcustomerx', { email });
      return response.data?.['200']?.customer?.userID;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userID = await fetchUserID();
    if (!userID) {
      console.error('User ID could not be fetched, cancelling submission.');
      return;
    }

    const completeCardData = {
      ...cardData,
      userID: userID,
      cardType: cardType,
      cardNumber: cardNumber,
      expiryDate: expDate,
      securityNumber: cvc,
      nameOnCard: cardName,
      street: billingAddress,
      city: city,
      state: state,
      zipcode: zipCode,
    };

    setCardData(completeCardData);  // Update cardData state

    const formData = {
      email: email,
      cardData: completeCardData,
      billingAddress: billingAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
      total: total
    };

    proceedToConfirmation(formData);
  };

  const proceedToConfirmation = (formData) => {
    if (!userID) {
      console.error('User ID is not available, unable to proceed.');
      return;
    }

  console.log('Proceeding to Confirmation', formData, userID);
    navigate('/order-confirmation', {
      state: {
        movie,
        localSelectedSeats,
        selectedSeats,
        showDates,
        showTimes,
        total,
        cardData: formData.cardData,
        formData,
        showId,
        promoCode,
        userID,
        localTicketQuantities,
        ticketPrices
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

  return (
    <>
      <div className="order-summary-container">
        <div className="review-order-section">
          <h1>Review Order</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

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
            <label htmlFor="cardType">Type of Card</label>
            <input type="text" id="cardType" name="cardType" placeholder="Type of card" value={cardType} onChange={(e) => setCardType(e.target.value)} required/>
            <label htmlFor="cardName">Name on Card</label>
            <input type="text" id="cardName" name="cardName" placeholder="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} required/>
            <label htmlFor="cardNumber">Card Number</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="Card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
            <label htmlFor="cvc">CVC</label>
            <input type="text" id="cvc" name="cvc" placeholder="CVC" value={cvc} onChange={(e) => setCVC(e.target.value)} required/>
            <label htmlFor="expDate">Expiration Date</label>
            <input type="text" id="expDate" name="expDate" placeholder="MM/YY" value={expDate} onChange={(e) => setExpDate(e.target.value)} required/>
            </>
            )}
            <h2>Billing Information</h2>
            <label htmlFor="billingAddress">Billing Address</label>
            <input type="text" id="billingAddress" name="billingAddress" placeholder="Billing address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required />
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required/>
            <label htmlFor="state">State</label>
            <input type="text" id="state" name="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
            <label htmlFor="zipCode">Zip Code</label>
            <input type="text" id="zipCode" name="zipCode" placeholder="Zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            <label htmlFor="country">Country</label>
            <input type="text" id="country"name="country"placeholder="Country"value={country} onChange={(e) => setCountry(e.target.value)} required/>
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
