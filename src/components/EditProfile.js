// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './signup.css';
// import axios from 'axios';

// const EditProfile = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         customer: {
//             userID: 0,
//             email: '',
//             password: '',
//             userRole: 1,
//             firstName: '',
//             lastName: '',
//             phoneNumber: '',
//             promotionsSubscribed: false,
//             verificationCode: '',
//             customerStatusID: 1,
//             street: '',
//             city: '',
//             state: '',
//             zipcode: ''
//         },
//         cardDetails: {
//             cardID : '',
//             userID: '',
//             cardType: '',
//             cardNumber: '',
//             expiryDate: '',
//             securityNumber: '',
//             nameOnCard: '',
//             street: '',
//             city: '',
//             state: '',
//             zipcode: ''
//         }
//     });
//     const [showPaymentFields, setShowPaymentFields] = useState(false);
//     const [showAddressFields, setShowAddressFields] = useState(false);
//     const [formErrors, setFormErrors] = useState({});
//     const intmail = localStorage.getItem('email');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.post('http://localhost:8080/getcustomerx', { email: intmail });
//                 const responseData = response.data['200'];
//                 setFormData({
//                     customer: {
//                         userID: responseData.customer?.userID || 0,
//                         email: responseData.customer?.email || '',
//                         password: responseData.customer?.password || '',
//                         firstName: responseData.customer?.firstName || '',
//                         lastName: responseData.customer?.lastName || '',
//                         phoneNumber: responseData.customer?.phoneNumber || '',
//                         promotionsSubscribed: responseData.customer?.promotionsSubscribed || '',
//                         street: responseData.customer?.street || '',
//                         city: responseData.customer?.city || '',
//                         state: responseData.customer?.state || '',
//                         zipcode: responseData.customer?.zipcode || '',
//                         userRole: responseData.customer?.userRole || '',
//                         customerStatusID: responseData.customer?.customerStatusID || '',
//                         verificationCode: responseData.customer?.verificationCode || ''
//                     },
//                     cardDetails: {
//                         cardID: responseData.cardDetails['0']?.cardID || 0,
//                         userID: responseData.cardDetails['0']?.userID || 0,
//                         cardType: responseData.cardDetails['0']?.cardType || '',
//                         cardNumber: responseData.cardDetails['0']?.cardNumber || '' ,
//                         expiryDate: responseData.cardDetails['0']?.expiryDate || '',
//                         securityNumber: responseData.cardDetails['0']?.securityNumber || '',
//                         nameOnCard: responseData.cardDetails['0']?.nameOnCard || '',
//                         street: responseData.cardDetails['0']?.street || '',
//                         city: responseData.cardDetails['0']?.city || '',
//                         state: responseData.cardDetails['0']?.state || '',
//                         zipcode: responseData.cardDetails['0']?.zipcode || ''
//                     }
//                 });
//             } catch (error) {
//                 alert('Profile updated successfully');
//                 navigate('/editprofile');
//             }
//         };

//         fetchData();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;

//     // Destructure the formData object into customer and cardDetails
//     const { customer, cardDetails } = formData;

//     // Check if the input belongs to customer or cardDetails
//     if (customer.hasOwnProperty(name)) {
//         // Update the customer object
//         setFormData({
//             ...formData,
//             customer: {
//                 ...customer,
//                 [name]: type === 'checkbox' ? checked : value
//             }
//         });
//     } else if (cardDetails.hasOwnProperty(name)) {
//         // Update the cardDetails object
//         setFormData({
//             ...formData,
//             cardDetails: {
//                 ...cardDetails,
//                 [name]: value
//             }
//         });
//     }
//     };

//     const validateForm = () => {
//         const errors = {};
//         // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

//         // if (!passwordRegex.test(formData.password)) {
//         //     errors.password = 'Password must be at least 8 characters long, contain a number, a special character, and a capital letter.';
//         // }

//         if (formData.password !== formData.confirmPassword) {
//             errors.confirmPassword = 'Passwords must match.';
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     // const handleSubmit = (event) => {
//     //     event.preventDefault();

//     //     if (!validateForm()) {
//     //         return;
//     //     }

//     //     // Here, include your registration logic
//     //     // If registration is successful, navigate to the confirmation page
//     //     navigate('/registration-confirmation', { state: { email: formData.email } });
//     // };
//     const [popupMessage, setPopupMessage] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//              if (!validateForm()) {
//             return;
//         }
//         try{
//           const response = await axios.post('http://localhost:8080/updateCustomer',formData.customer);
//           const cardresponse = await axios.post('http://localhost:8080/updateCard',formData.cardDetails);
//           console.log(response.data);
//           if (response.data['203']) {
//             // Incorrect password
//             setPopupMessage('Incorrect password. Please try again!');
//         } else if (response.data['204']) {
//             // User not found
//             setPopupMessage('User not found. Please sign up!');
//         } else if (response.data['200']) {
//             // Success
//             setPopupMessage('Data saved successfully');
//             alert('Profile updated successfully');
//                 navigate('/editprofile');
//             // navigate('/verify-account', { state : { customerDate:response.data['200'] }});
//         } else if (response.data['208']) {
//             // email already taken
//             setPopupMessage('Email already taken, please login');
//         }else {
//             // Other errors
//             alert('Profile updated successfully');
//             navigate('/editprofile');
//         }
//         }catch(error){
//           console.error('Error:', error);
//         }
//       }

//       const handleReset = () =>{
//         navigate('/password-change');
//       }

//     return (
//         <div>
//             <div className="signup-container">
//                 <h3>Edit Profile</h3>
//                 <form className="signup-form" onSubmit={handleSubmit}>
//                     {/* Add asterisks to indicate required fields */}
//                     <div className="input-group">
//                         <input type="text" id="firstname" name="firstName" placeholder="First name *" value={formData.customer.firstName} required onChange={handleInputChange} />
//                         <input type="text" id="lastname" name="lastName" placeholder="Last name *" value={formData.customer.lastName} required onChange={handleInputChange} />
//                     </div>
//                     <div className="input-group">
//                         <input type="email" id="email" name="email" placeholder="Email *" value={formData.customer.email} disabled onChange={handleInputChange} />
//                         <input type="tel" id="phone" name="phoneNumber" placeholder="Phone Number *" value={formData.customer.phoneNumber} required onChange={handleInputChange} />
//                     </div>
//                     {/* <div className="input-group">
//                          <input type="password" id="password" name="password" placeholder="Password" value={formData.customer.password} required onChange={handleInputChange} />
//                         {formErrors.password && <p className="error-message">{formErrors.password}</p>}
//                          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} />
//                          {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
//                     </div> */}
//                     <div className="checkbox-group">
//                         <input type="checkbox" id="signUpForPromotions" name="promotionsSubscribed" checked={formData.customer.promotionsSubscribed} onChange={handleInputChange} />
//                         <label htmlFor="signUpForPromotions">Sign up for promotions</label>
//                     </div>
//                     <div className="optional-actions">
//                     <button type="button" className="optional-button" onClick={() => setShowPaymentFields(!showPaymentFields)}>
//                         Edit payment info
//                     </button>
//                     {showPaymentFields && (
//                         <div className="input-group">
//                             <input type="text" id="cardName" name="nameOnCard" placeholder="Name As it Appears on Card" value={formData.cardDetails.nameOnCard} onChange={handleInputChange} />
//                             <input type="text" id="billingAddress" name="street" placeholder="Address Line 1" value={formData.customer.street} onChange={handleInputChange} />
//                             {/* <input type="text" id="billingAddress2" name="addressLine2" placeholder="Address Line 2" /> */}
//                             <input type="text" id="city" name="city" placeholder="City" value={formData.customer.city} onChange={handleInputChange}/>
//                             <input type="text" id="state" name="state" placeholder="State" value={formData.customer.state} onChange={handleInputChange}/>
//                             <input type="text" id="zipCode" name="zipcode" placeholder="Zip Code" value={formData.customer.zipcode} onChange={handleInputChange}/>
//                             <input type="text" id="cardNumber" name="cardNumber" placeholder="Card Number" value={formData.cardDetails.cardNumber} onChange={handleInputChange} />
//                             <input type="text" id="expiryDate" name="expiryDate" placeholder="Expiry Date" value={formData.cardDetails.expiryDate} onChange={handleInputChange}/>
//                             <input type="text" id="cvv" name="securityNumber" placeholder="CVV" value={formData.cardDetails.securityNumber} onChange={handleInputChange}/>
//                         </div>
//                     )}
//                     <button type="button" className="optional-button" onClick={() => setShowAddressFields(!showAddressFields)}>
//                         Edit address
//                     </button>
//                     {showAddressFields && (
//                         <div className="input-group">
//                             {/* Replace these with your actual address fields */}
//                             <input type="text" id="addressLine1" name="street" placeholder="Address Line 1" value={formData.customer.street} onChange={handleInputChange}/>
//                             <input type="text" id="addressLine2" name="addressLine2" placeholder="Address Line 2" />
//                             <input type="text" id="city" name="city" placeholder="City" value={formData.customer.city} onChange={handleInputChange}/>
//                             <input type="text" id="state" name="state" placeholder="State" value={formData.customer.state} onChange={handleInputChange}/>
//                             <input type="text" id="zipCode" name="zipcode" placeholder="Zip Code" value={formData.customer.zipcode} onChange={handleInputChange}/>
//                             {/* Add any additional address fields here */}
//                         </div>
//                     )}
//                     <button type="button" className="optional-button" onClick={ handleReset
//                     //     <Link to="/password-change">
//                     //     <div className='dropdown-item'> Reset Password</div>
//                     //   </Link>
//                     }>
//                         Reset Password
//                     </button>
//                 </div>
//                     <input type="submit" value="Save Changes" className="submit-button" />
//                 </form>
//                 {/* Add a note at the bottom about mandatory fields */}
//                 <p className="mandatory-note">* Indicates a required field</p>
//                 {/* <p className="link">Already have an account? <a href="/login">Log in here!</a></p> */}
//                 {popupMessage && (
//                     <div className="popup">
//                         <span className="popup-message">{popupMessage}</span>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EditProfile;


import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Header from './Header';
import './editprofile.css';
import axios from 'axios';
import { useEffect } from 'react';

function EditProfile({ isLoggedIn, setLoggedIn }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    
    const initialEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('email') || '';
    useEffect(() => {
                const fetchData = async () => {
                    try {
                        const response = await axios.post('http://localhost:8080/getcustomerx', { email: initialEmail });
                        const responseData = response.data['200'];
                        console.log(responseData);
                    }
                    catch (error) {
                        alert('Profile updated successfully');
                        navigate('/editprofile');
                    }
                };
        
                fetchData();
            }, []);
    const localUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    // Always attempt to get the email from localStorage
    //const storedEmail = localStorage.getItem('userEmail') || localUserData.email || '';

    const initialProfileData = location.state ? location.state.userData : {
        firstName: localUserData.firstName || '',
        lastName: localUserData.lastName || '',
        email: initialEmail,
        phone: localUserData.phone || '',
        creditCards: localUserData.creditCards || [],
        address: localUserData.address || {
          homeAddress: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        password: '',
        currentPassword: '',
        promotions: localUserData.promotions || false,
      };

    const [profileData, setProfileData] = useState(initialProfileData);

    const [showCreditCardInputs, setShowCreditCardInputs] = useState(profileData.creditCards?.length > 0);
    const [showAddressInputs, setShowAddressInputs] = useState(!!profileData.address?.homeAddress);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'password' && value) {
            setIsChangingPassword(true); // Detect password change
        }
        if (type === 'checkbox') {
          setProfileData({ ...profileData, [name]: checked });
        } else {
          setProfileData({ ...profileData, [name]: value });
        }
      };

    const handleCreditCardChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCreditCards = [...profileData.creditCards];
        updatedCreditCards[index] = { ...updatedCreditCards[index], [name]: value };
        setProfileData(prev => ({ ...prev, creditCards: updatedCreditCards }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const toggleCreditCardInputs = () => setShowCreditCardInputs(!showCreditCardInputs);
    const toggleAddressInputs = () => setShowAddressInputs(!showAddressInputs);
    //const togglePromotions = () => setProfileData(prev => ({ ...prev, promotions: !prev.promotions }));

    const addCreditCard = (e) => {
        e.preventDefault();
        const newCard = { number: '', expirationDate: '', cvv: '' };
        setProfileData(prev => ({
            ...prev,
            creditCards: [...prev.creditCards, newCard]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
    
        // Basic field validations
        if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required.';
    
        // Validate credit card inputs if they are shown
        if (showCreditCardInputs && profileData.creditCards) {
            profileData.creditCards.forEach((card, index) => {
                if (!card.number.trim()) newErrors[`creditCardNumber${index}`] = 'Credit card number is required.';
                if (!card.expirationDate.trim()) newErrors[`creditCardExpiration${index}`] = 'Expiration date is required.';
                if (!card.cvv.trim()) newErrors[`creditCardCvv${index}`] = 'CVV is required.';
            });
        }
    
        // Validate address inputs if they are shown
        if (showAddressInputs && profileData.address) {
            if (!profileData.address.homeAddress.trim()) newErrors.homeAddress = 'Home address is required.';
            if (!profileData.address.city.trim()) newErrors.city = 'City is required.';
            if (!profileData.address.state.trim()) newErrors.state = 'State is required.';
            if (!profileData.address.postalCode.trim()) newErrors.postalCode = 'Postal code is required.';
            if (!profileData.address.country.trim()) newErrors.country = 'Country is required.';
        }
        // Validate new password for complexity and check against current password
        if (isChangingPassword) {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!profileData.password.match(passwordPattern)) {
                newErrors.password = 'Password must be at least 8 characters long, contain a number, a special character, and a capital letter.';
            } else if (profileData.password === profileData.currentPassword) {
                // Check if new password is the same as the current password
                newErrors.password = 'New password must be different from the current password.';
            }
        }

        // Check for current password if changing password
        if (isChangingPassword && !profileData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required to change password.';
        }
    
        setErrors(newErrors); // Update the state with newErrors
    
        // Only navigate if there are no new errors
        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem('userData', JSON.stringify(profileData));
            // Send email notification for profile update
            // Typically make an API call to your backend to send the email
            // Example: sendProfileUpdateEmail(profileData);
            navigate('/profilepage', { state: { userData: profileData } }); 
        }
    };
    
    
    if (!profileData.creditCards) {
        setProfileData({ ...profileData, creditCards: [] });
    }
    return (
        <div>  
            {/* <Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} /> */}
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>
                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <label>
                        First name:
                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} />
                        {errors.firstName && <p className="error">{errors.firstName}</p>}
                    </label>
                    <label>
                        Last name:
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} />
                        {errors.lastName && <p className="error">{errors.lastName}</p>}
                    </label>
                    <label>
                        Email (cannot be changed):
                        <input type="email" name="email" value={profileData.email} disabled />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} />
                        {errors.phone && <p className="error">{errors.phone}</p>}

                    </label>
                    {isChangingPassword && (
                        <label>
                            Current Password:
                            <input type="password" name="currentPassword" value={profileData.currentPassword} onChange={handleChange} />
                            {errors.currentPassword && <p className="error">{errors.currentPassword}</p>}
                        </label>
                    )}
                    <label>
                        New Password:
                        <input type="password" name="password" value={profileData.password} onChange={handleChange} />
                        {errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                    </label>
                    <label>
                        Register for Promotions:
                        <input
                          type="checkbox"
                          name="promotions"
                          checked={profileData.promotions}
                          onChange={handleChange} // Use handleChange for checkboxes as well
                        />
                        </label>
                    <button type="button" onClick={toggleCreditCardInputs}>
                    {showCreditCardInputs ? 'Hide Credit Card Info' : 'Add Credit Card Info'}
                    </button>
                    {showCreditCardInputs && (
                        <>
                     {profileData.creditCards.map((card, index) => (
                    <div key={index}>
                        <label>
                        Credit Card Number:
                        <input type="text" name="number" value={card.number} onChange={(e) => handleCreditCardChange(index, e)} />
                        {errors[`creditCardNumber${index}`] && <p className="error">{errors[`creditCardNumber${index}`]}</p>}
                    </label>
                    <label>
                        Expiration Date:
                    <input type="text" name="expirationDate" value={card.expirationDate} onChange={(e) => handleCreditCardChange(index, e)} />
                    {errors[`creditCardExpiration${index}`] && <p className="error">{errors[`creditCardExpiration${index}`]}</p>}
                </label>
                <label>
                    CVV:
                    <input type="text" name="cvv" value={card.cvv} onChange={(e) => handleCreditCardChange(index, e)} />
                    {errors[`creditCardCvv${index}`] && <p className="error">{errors[`creditCardCvv${index}`]}</p>}
                </label>
                </div>
            ))}
                 {profileData.creditCards.length < 3 && (
                <button onClick={addCreditCard}>
                Add Credit Card
                </button>
                )}
                </>
                    )}

                    <button type="button" onClick={toggleAddressInputs}>
                        {showAddressInputs ? 'Hide Billing Address' : 'Add Billing Address'}
                    </button>
                    {showAddressInputs && (
                        <div>
                            <label>
                                Address:
                                <input type="text" name="homeAddress" value={profileData.address.homeAddress} onChange={handleAddressChange}/>
                                {errors.homeAddress && <p className="error">{errors.homeAddress}</p>}
                            </label>
                            <label>
                                City:
                                <input type="text" name="city" value={profileData.address.city} onChange={handleAddressChange}/>
                                {errors.city && <p className="error">{errors.city}</p>}
                            </label>
                            <label>
                                State/Province:
                                <input type="text" name="state" value={profileData.address.state} onChange={handleAddressChange}/>
                                {errors.state && <p className="error">{errors.city}</p>}
                            </label>
                            <label>
                                Postal Code:
                                <input type="text" name="postalCode" value={profileData.address.postalCode} onChange={handleAddressChange}/>
                                {errors.postalCode && <p className="error">{errors.postalCode}</p>}
                            </label>
                            <label>
                                Country:
                                <input type="text" name="country" value={profileData.address.country} onChange={handleAddressChange}/>
                                {errors.country && <p className="error">{errors.country}</p>}
                            </label>
                        </div>
                    )}

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
