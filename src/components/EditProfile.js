import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import './signup.css';
import axios from 'axios';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: {
            userID: 0,
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
            cardID : '',
            userID: '',
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
    const intmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/getcustomerx', { email: intmail });
                const responseData = response.data['200'];
                setFormData({
                    customer: {
                        userID: responseData.customer?.userID || 0,
                        email: responseData.customer?.email || '',
                        password: responseData.customer?.password || '',
                        firstName: responseData.customer?.firstName || '',
                        lastName: responseData.customer?.lastName || '',
                        phoneNumber: responseData.customer?.phoneNumber || '',
                        promotionsSubscribed: responseData.customer?.promotionsSubscribed || '',
                        street: responseData.customer?.street || '',
                        city: responseData.customer?.city || '',
                        state: responseData.customer?.state || '',
                        zipcode: responseData.customer?.zipcode || '',
                        userRole: responseData.customer?.userRole || '',
                        customerStatusID: responseData.customer?.customerStatusID || '',
                        verificationCode: responseData.customer?.verificationCode || ''
                    },
                    cardDetails: {
                        cardID: responseData.cardDetails['0']?.cardID || 0,
                        userID: responseData.cardDetails['0']?.userID || 0,
                        cardType: responseData.cardDetails['0']?.cardType || '',
                        cardNumber: responseData.cardDetails['0']?.cardNumber || '' ,
                        expiryDate: responseData.cardDetails['0']?.expiryDate || '',
                        securityNumber: responseData.cardDetails['0']?.securityNumber || '',
                        nameOnCard: responseData.cardDetails['0']?.nameOnCard || '',
                        street: responseData.cardDetails['0']?.street || '',
                        city: responseData.cardDetails['0']?.city || '',
                        state: responseData.cardDetails['0']?.state || '',
                        zipcode: responseData.cardDetails['0']?.zipcode || ''
                    }
                });
            } catch (error) {
                alert('Profile updated successfully');
                navigate('/editprofile');
            }
        };

        fetchData();
    }, []);

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
          const response = await axios.post('http://localhost:8080/updateCustomer',formData.customer);
          const cardresponse = await axios.post('http://localhost:8080/updateCard',formData.cardDetails);
          console.log(response.data);
          if (response.data['203']) {
            // Incorrect password
            setPopupMessage('Incorrect password. Please try again!');
        } else if (response.data['204']) {
            // User not found
            setPopupMessage('User not found. Please sign up!');
        } else if (response.data['200']) {
            // Success
            setPopupMessage('Data saved successfully');
            alert('Profile updated successfully');
                navigate('/editprofile');
            // navigate('/verify-account', { state : { customerDate:response.data['200'] }});
        } else if (response.data['208']) {
            // email already taken
            setPopupMessage('Email already taken, please login');
        }else {
            // Other errors
            alert('Profile updated successfully');
            navigate('/editprofile');
        }
        }catch(error){
          console.error('Error:', error);
        }
      }

      const handleReset = () =>{
        navigate('/password-change');
      }

    return (
        <div>
            <div className="signup-container">
                <h3>Edit Profile</h3>
                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* Add asterisks to indicate required fields */}
                    <div className="input-group">
                        <input type="text" id="firstname" name="firstName" placeholder="First name *" value={formData.customer.firstName} required onChange={handleInputChange} />
                        <input type="text" id="lastname" name="lastName" placeholder="Last name *" value={formData.customer.lastName} required onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder="Email *" value={formData.customer.email} disabled onChange={handleInputChange} />
                        <input type="tel" id="phone" name="phoneNumber" placeholder="Phone Number *" value={formData.customer.phoneNumber} required onChange={handleInputChange} />
                    </div>
                    {/* <div className="input-group">
                         <input type="password" id="password" name="password" placeholder="Password" value={formData.customer.password} required onChange={handleInputChange} />
                        {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                         <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} />
                         {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
                    </div> */}
                    <div className="checkbox-group">
                        <input type="checkbox" id="signUpForPromotions" name="promotionsSubscribed" checked={formData.customer.promotionsSubscribed} onChange={handleInputChange} />
                        <label htmlFor="signUpForPromotions">Sign up for promotions</label>
                    </div>
                    <div className="optional-actions">
                    <button type="button" className="optional-button" onClick={() => setShowPaymentFields(!showPaymentFields)}>
                        Edit payment info
                    </button>
                    {showPaymentFields && (
                        <div className="input-group">
                            <input type="text" id="cardName" name="nameOnCard" placeholder="Name As it Appears on Card" value={formData.cardDetails.nameOnCard} onChange={handleInputChange} />
                            <input type="text" id="billingAddress" name="street" placeholder="Address Line 1" value={formData.customer.street} onChange={handleInputChange} />
                            {/* <input type="text" id="billingAddress2" name="addressLine2" placeholder="Address Line 2" /> */}
                            <input type="text" id="city" name="city" placeholder="City" value={formData.customer.city} onChange={handleInputChange}/>
                            <input type="text" id="state" name="state" placeholder="State" value={formData.customer.state} onChange={handleInputChange}/>
                            <input type="text" id="zipCode" name="zipcode" placeholder="Zip Code" value={formData.customer.zipcode} onChange={handleInputChange}/>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="Card Number" value={formData.cardDetails.cardNumber} onChange={handleInputChange} />
                            <input type="text" id="expiryDate" name="expiryDate" placeholder="Expiry Date" value={formData.cardDetails.expiryDate} onChange={handleInputChange}/>
                            <input type="text" id="cvv" name="securityNumber" placeholder="CVV" value={formData.cardDetails.securityNumber} onChange={handleInputChange}/>
                        </div>
                    )}
                    <button type="button" className="optional-button" onClick={() => setShowAddressFields(!showAddressFields)}>
                        Edit address
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
                    <button type="button" className="optional-button" onClick={ handleReset
                    //     <Link to="/password-change">
                    //     <div className='dropdown-item'> Reset Password</div>
                    //   </Link>
                    }>
                        Reset Password
                    </button>
                </div>
                    <input type="submit" value="Save Changes" className="submit-button" />
                </form>
                {/* Add a note at the bottom about mandatory fields */}
                <p className="mandatory-note">* Indicates a required field</p>
                {/* <p className="link">Already have an account? <a href="/login">Log in here!</a></p> */}
                {popupMessage && (
                    <div className="popup">
                        <span className="popup-message">{popupMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfile;
