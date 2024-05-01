import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

   // Initialize state with a user object. If user details are passed, use them; otherwise, set default values.
   const [user, setUser] = useState(() => {
    // Default address structure
    const defaultAddress = {
        street: '',
        city: '',
        state: '',
        zipCode: ''
    };
    
    if (location.state?.user) {
        // If address is not provided, default it
        return {
            ...location.state.user,
            address: location.state.user.address || defaultAddress,
        };
    }

    // Default user structure if no user data is passed
    return {
        id: id,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: defaultAddress
    };
});
    const [cards, setCards] = useState([]); 
    const [errors, setErrors] = useState({}); 

  /*  const [cards, setCards] = useState([
        { cardNumber: '4111111111111111', expiryDate: '12/22' },
        // Add more card objects as needed
    ]);
*/
    const handleUserChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleCardChange = (index, event) => {
        const { name, value } = event.target;
        setCards(cards.map((card, i) => 
            i === index ? { ...card, [name]: value } : card
        ));
    };

    const addNewCard = () => {
        if (cards.length < 3) {
            setCards([...cards, { cardNumber: '', expiryDate: '' }]);
        } else {
            alert('Maximum of 3 cards allowed.');
        }
    };

    const removeCard = (index) => {
        setCards(cards.filter((_, i) => i !== index));
    };


    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!user.firstName) {
            isValid = false;
            tempErrors["firstName"] = "First name is required.";
        }

        if (!user.lastName) {
            isValid = false;
            tempErrors["lastName"] = "Last name is required.";
        }

        if (!user.phoneNumber) {
            isValid = false;
            tempErrors["phoneNumber"] = "Phone number is required.";
        }

        // Add any other field validations here

        setErrors(tempErrors);
        return isValid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setUser({
            ...user,
            address: {
                ...user.address,
                [name]: value
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            console.log('User Data:', user);
            console.log('Cards Data:', cards);
            alert('Profile updated successfully!');
            navigate('/admin/manage-users');
        }
    };
    return (
        <div className="user-profile">
            <h1>Edit User Profile</h1>
            <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "error-input" : ""}
                    />
                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                </div>
   
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "error-input" : ""}
                    />
                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>

                <div className="form-group">
                    <label>Email (cannot be changed):</label>
                    <input type="email" name="email" value={user.email} readOnly />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                        className={errors.phoneNumber ? "error-input" : ""}
                    />
                    {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                </div>

                <h8>Billing Address (Optional)</h8>
                <div className="form-group">
                    <label>Street:</label>
                    <input
                        type="text"
                        name="street"
                        value={user.address.street}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={user.address.city}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="form-group">
                    <label>State:</label>
                    <input
                        type="text"
                        name="state"
                        value={user.address.state}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="form-group">
                    <label>ZIP Code:</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={user.address.zipCode}
                        onChange={handleAddressChange}
                    />
                </div>

                {cards.map((card, index) => (
                    <div key={index} className="card-details">
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
                {cards.length < 3 && (
                    <button type="button" onClick={addNewCard} className="add-card-btn">Add New Card</button>
                )}
                
                <button type="submit" className="save-changes-btn">Save Changes</button>
            </form>
        </div>
    );
}

export default UserProfile;