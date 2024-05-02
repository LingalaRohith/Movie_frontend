import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function AddUser() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        promotions: false,
        password: '',  
        userRole: 1,
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (['street', 'city', 'state', 'zipCode'].includes(name)) {
            setUserData({
                ...userData,
                address: {
                    ...userData.address,
                    [name]: value
                }
            });
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleCardChange = (index, event) => {
        const newCards = [...cards];
        newCards[index][event.target.name] = event.target.value;
        setCards(newCards);
    };

    const addCard = () => {
        if (cards.length < 3) {
            setCards([...cards, { cardNumber: '', expiryDate: '' }]);
        } else {
            alert('Cannot add more than 3 cards.');
        }
    };

    const removeCard = index => {
        const newCards = cards.filter((_, i) => i !== index);
        setCards(newCards);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    const fullUserData = {
        customer: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password, 
            address: userData.address,
            userRole: 1
        },
        cards: cards
    };
    
        try {
            const response = await axios.post('http://localhost:8080/registerCustomer', fullUserData);
            alert('Adding user successful');
            navigate('/admin/manage-users');
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to add user: ' + (error.response?.data?.message || error.message));
        }
    };
    
    
    
    return (
        <div className="form-container">
            <h2 className="form-title">Add New User</h2>
            <form onSubmit={handleSubmit}>
                {/* Dynamic form groups with styled input fields */}
                <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                <label>Password:</label>
                    <input type="password" name="password" value={userData.password} onChange={handleInputChange} required />
                 </div>
                <h8>Billing Address (Optional):</h8>
                {/* Address and cards sections with additional styling */}
                <div className="form-group">
                    <label>Street:</label>
                    <input type="text" name="street" value={userData.address.street} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input type="text" name="city" value={userData.address.city} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>State:</label>
                    <input type="text" name="state" value={userData.address.state} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>ZIP Code:</label>
                    <input type="text" name="zipCode" value={userData.address.zipCode} onChange={handleInputChange} />
                </div>
                {cards.map((card, index) => (
                    <div key={index} className="card-section">
                        <div className="form-group">
                            <label>Card Number:</label>
                            <input type="text" name="cardNumber" value={card.cardNumber} onChange={(e) => handleCardChange(index, e)} />
                        </div>
                        <div className="form-group">
                            <label>Expiry Date:</label>
                            <input type="text" name="expiryDate" value={card.expiryDate} onChange={(e) => handleCardChange(index, e)} />
                        </div>
                        <button type="button" onClick={() => removeCard(index)} className="remove-card-btn">Remove Card</button>
                    </div>
                ))}
                {cards.length < 3 && <button type="button" onClick={addCard} className="add-card-btn">Add Card</button>}
                <button type="submit" className="save-changes-btn">Submit</button>
            </form>
        </div>
    );
}

export default AddUser;