import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Hdr2 from './Header2';
import './signup.css';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: {
            email: '',
            password: '',
            userRole: 1,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            promotionsSubscribed: false,
            verificationCode: '',
            customerStatusID: 1,
            street: '',
            city: '',
            state: '',
            zipcode: ''
        },
        cardDetails: {
            cardType: '',
            cardNumber: '',
            expiryDate: '',
            securityNumber: '',
            nameOnCard: '',
            street: '',
            city: '',
            state: '',
            zipcode: ''
        }
    });
    const [showPaymentFields, setShowPaymentFields] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

    // Destructure the formData object into customer and cardDetails
    const { customer, cardDetails } = formData;

    // Check if the input belongs to customer or cardDetails
    if (customer.hasOwnProperty(name)) {
        // Update the customer object
        setFormData({
            ...formData,
            customer: {
                ...customer,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    } else if (cardDetails.hasOwnProperty(name)) {
        // Update the cardDetails object
        setFormData({
            ...formData,
            cardDetails: {
                ...cardDetails,
                [name]: value
            }
        });
    }
    };

    const validateForm = () => {
        const errors = {};
        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        // if (!passwordRegex.test(formData.password)) {
        //     errors.password = 'Password must be at least 8 characters long, contain a number, a special character, and a capital letter.';
        // }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords must match.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // const handleSubmit = (event) => {
    //     event.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     // Here, include your registration logic
    //     // If registration is successful, navigate to the confirmation page
    //     navigate('/registration-confirmation', { state: { email: formData.email } });
    // };
    const [popupMessage, setPopupMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
             if (!validateForm()) {
            return;
        }
        try{
          const response = await axios.post('http://localhost:8080/registerCustomer',formData);
          console.log(response.data);
          if (response.data['203']) {
            // Incorrect password
            setPopupMessage('Incorrect password. Please try again!');
        } else if (response.data['204']) {
            // User not found
            setPopupMessage('User not found. Please sign up!');
        } else if (response.data['200']) {
            // Success
            
            setPopupMessage('Login successful!');
            // navigate('/verify-account', { state : { customerDate:response.data['200'] }});
            navigate('/verify-account', { state : { email : formData.customer.email, pwd : formData.customer.password}});
        } else if (response.data['208']) {
            // email already taken
            setPopupMessage('Email already taken, please login');
        }else {
            // Other errors
            setPopupMessage('An error occurred. Please try again later!');
        }
        }catch(error){
          console.error('Error:', error);
        }
      }

    return (
        <div>
            {/* <Header isLoggedIn={isLoggedIn} setLoggedIn={setIsLoggedIn}/> */}
            <div className="signup-container">
                <h3>Sign Up</h3>
                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* Add asterisks to indicate required fields */}
                    <div className="input-group">
                        <input type="text" id="firstname" name="firstName" placeholder="First name *" value={formData.customer.firstName} required onChange={handleInputChange} />
                        <input type="text" id="lastname" name="lastName" placeholder="Last name *" value={formData.customer.lastName} required onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder="Email *" value={formData.customer.email} required onChange={handleInputChange} />
                        <input type="tel" id="phone" name="phoneNumber" placeholder="Phone Number *" value={formData.customer.phoneNumber} required onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                         <input type="password" id="password" name="password" placeholder="Password" value={formData.customer.password} required onChange={handleInputChange} />
                        {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                         <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} />
                         {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="signUpForPromotions" name="promotionsSubscribed" value={formData.customer.promotionsSubscribed} onChange={handleInputChange} />
                        <label htmlFor="signUpForPromotions">Sign up for promotions</label>
                    </div>
                    <div className="optional-actions">
                    <button type="button" className="optional-button" onClick={() => setShowPaymentFields(!showPaymentFields)}>
                        Add payment info
                    </button>
                    {showPaymentFields && (
                        <div className="input-group">
                            <input type="text" id="cardName" name="nameOnCard" placeholder="Name As it Appears on Card" value={formData.cardDetails.nameOnCard} onChange={handleInputChange} />
                            <input type="text" id="billingAddress" name="street" placeholder="Address Line 1" value={formData.customer.street} onChange={handleInputChange} />
                            <input type="text" id="billingAddress2" name="addressLine2" placeholder="Address Line" />
                            <input type="text" id="city" name="city" placeholder="City" value={formData.customer.city} onChange={handleInputChange}/>
                            <input type="text" id="state" name="state" placeholder="State" value={formData.customer.state} onChange={handleInputChange}/>
                            <input type="text" id="zipCode" name="zipcode" placeholder="Zip Code" value={formData.customer.zipcode} onChange={handleInputChange}/>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="Card Number" value={formData.cardDetails.cardNumber} onChange={handleInputChange} />
                            <input type="text" id="expiryDate" name="expiryDate" placeholder="Expiry Date" value={formData.cardDetails.expiryDate} onChange={handleInputChange}/>
                            <input type="text" id="cvv" name="securityNumber" placeholder="CVV" value={formData.cardDetails.securityNumber} onChange={handleInputChange}/>
                        </div>
                    )}
                    <button type="button" className="optional-button" onClick={() => setShowAddressFields(!showAddressFields)}>
                        Add address
                    </button>
                    {showAddressFields && (
                        <div className="input-group">
                            {/* Replace these with your actual address fields */}
                            <input type="text" id="addressLine1" name="street" placeholder="Address Line 1" value={formData.customer.street} onChange={handleInputChange}/>
                            <input type="text" id="addressLine2" name="addressLine2" placeholder="Address Line 2" />
                            <input type="text" id="city" name="city" placeholder="City" value={formData.customer.city} onChange={handleInputChange}/>
                            <input type="text" id="state" name="state" placeholder="State" value={formData.customer.state} onChange={handleInputChange}/>
                            <input type="text" id="zipCode" name="zipcode" placeholder="Zip Code" value={formData.customer.zipcode} onChange={handleInputChange}/>
                            {/* Add any additional address fields here */}
                        </div>
                    )}
                </div>
                    <input type="submit" value="Create Account" className="submit-button" />
                </form>
                {/* Add a note at the bottom about mandatory fields */}
                <p className="mandatory-note">* Indicates a required field</p>
                <p className="link">Already have an account? <a href="/login">Log in here!</a></p>
                {popupMessage && (
                    <div className="popup">
                        <span className="popup-message">{popupMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
