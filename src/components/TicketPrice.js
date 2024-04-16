import React, { useState, useEffect } from 'react';
import './TicketPrice.css';  

const TicketPrice = () => {
    const [prices, setPrices] = useState({
        child: parseFloat(localStorage.getItem('price_child')) || 10.00,
        adult: parseFloat(localStorage.getItem('price_adult')) || 16.00,
        senior: parseFloat(localStorage.getItem('price_senior')) || 12.00
    });
    const [bookingFee, setBookingFee] = useState(parseFloat(localStorage.getItem('bookingFee')) || 2.00);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePriceChange = (e) => {
        if (e.target.value < 0) {
            setError('Prices cannot be negative.');
            return;
        }
        setError('');
        setPrices({ ...prices, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleBookingFeeChange = (e) => {
        if (e.target.value < 0) {
            setError('Booking fee cannot be negative.');
            return;
        }
        setError('');
        setBookingFee(parseFloat(e.target.value));
    };

    const handleSubmit = () => {
        if (Object.values(prices).some(price => price <= 0) || bookingFee < 0) {
            setError('Please enter valid positive values for all fields.');
            return;
        }
        localStorage.setItem('price_child', prices.child);
        localStorage.setItem('price_adult', prices.adult);
        localStorage.setItem('price_senior', prices.senior);
        localStorage.setItem('bookingFee', bookingFee);
        setMessage('Prices updated successfully!');
        setError('');
    };

    return (
        <div className="ticket-price-container">
            <div className="card">
                <h2> Pricing Management</h2>
                {message && <div className="message">{message}</div>}
                {error && <div className="error">{error}</div>}
                <div className="ticket-group">
                    <label>Child Ticket Price:</label>
                    <input type="number" name="child" value={prices.child} onChange={handlePriceChange} min="0" step="0.01" />
                </div>
                <div className="ticket-group">
                    <label>Adult Ticket Price:</label>
                    <input type="number" name="adult" value={prices.adult} onChange={handlePriceChange} min="0" step="0.01" />
                </div>
                <div className="ticket-group">
                    <label>Senior Ticket Price:</label>
                    <input type="number" name="senior" value={prices.senior} onChange={handlePriceChange} min="0" step="0.01" />
                </div>
                <div className="ticket-group">
                    <label>Online Booking Fee:</label>
                    <input type="number" value={bookingFee} onChange={handleBookingFeeChange} min="0" step="0.01" />
                </div>
                <button onClick={handleSubmit} className="save-prices-button">Save Prices</button>
            </div>
        </div>
    );
};

export default TicketPrice;
