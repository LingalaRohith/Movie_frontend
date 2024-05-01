import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Header from './Header';
import './editprofile.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';


function EditProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { isLoggedIn } = useAuth(); 
    

    const initialEmail = sessionStorage.getItem('userEmail') || sessionStorage.getItem('email') || '';

    useEffect(() => {
        if (!isLoggedIn) { 
          console.log("Not logged in, navigating to login.");
          navigate("/login", { replace: true });
        } 
      }, [navigate, isLoggedIn]); 

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
    const localUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    // Always attempt to get the email from sessionStorage
    //const storedEmail = sessionStorage.getItem('userEmail') || localUserData.email || '';

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
            sessionStorage.setItem('userData', JSON.stringify(profileData));
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
