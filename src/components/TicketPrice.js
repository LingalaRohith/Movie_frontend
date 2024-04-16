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
        setMessage('Pri