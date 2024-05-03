import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './editprofile.css';

function EditProfile() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const initialEmail = sessionStorage.getItem('email');
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        promotions: false,
        customerStatusID: '',
        verificationCode: '',
        cardDetails: [],
        street: '',
            city: '',
            state: '',
            zipcode: '',
        
    });
    
    const [errors, setErrors] = useState({});

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
                const responseData = response.data[200];
                setProfileData({
                    ...profileData,
                    userID: responseData.customer.userID,
                    firstName: responseData.customer.firstName|| '',
                    lastName: responseData.customer.lastName|| '',
                    password: responseData.customer.password|| '',
                    email: responseData.customer.email|| '',
                    userRole: responseData.customer.userRole|| '',
                    phoneNumber: responseData.customer.phoneNumber|| '',
                    promotions: responseData.customer.promotionsSubscribed|| '',
                    customerStatusID: responseData.customer.customerStatusID|| '',
                    verificationCode: responseData.customer.verificationCode|| '',
                    cardDetails: responseData.cardDetails || []|| '',
                    street: responseData.customer.street || '',
                    city: responseData.customer.city || '',
                    state: responseData.customer.state || '',
                    zipcode: responseData.customer.zipcode || ''
                       
                    
                });
                console.log(JSON.stringify(profileData, null, 2)); 

            } catch (error) {
                console.error('Error fetching data: ', error);
                alert('Error fetching profile data');
            }
        };
        fetchData();
    }, [initialEmail]);

    const handleDeleteCard = cardIndex => {
        const updatedCards = profileData.cardDetails.filter((_, index) => index !== cardIndex);
        setProfileData({ ...profileData, cardDetails: updatedCards });
    };

    const handleSaveChanges = async () => {
        try {
            console.log(JSON.stringify(profileData, null, 2)); 
            const response = await axios.post('http://localhost:8080/updateCustomer', profileData);
            if (response.status === 200) {
                alert('Profile updated successfully!');

            } else {
                alert('No updates were made to your profile.');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Error updating profile.');
        }
    };
    

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form className="edit-profile-form">
                <label>First name: <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} /></label>
                <label>Last name: <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} /></label>
                <label>Email (cannot be changed): <input type="email" value={profileData.email} disabled /></label>
                <label>Phone Number: 
                    <input type="text" value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
                </label>
                <label>Street: 
                    <input type="text" value={profileData.street} onChange={(e) => setProfileData({ ...profileData, street: e.target.value })} />
                </label>
                <label>City: 
                    <input type="text" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />
                </label>
                <label>State: 
                    <input type="text" value={profileData.state} onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} />
                </label>
                <label>Zipcode: 
                    <input type="text" value={profileData.zipcode} onChange={(e) => setProfileData({ ...profileData, zipcode: e.target.value })} />
                </label>

                <label>Register for Promotions: <input type="checkbox" checked={profileData.promotions} onChange={(e) => setProfileData({ ...profileData, promotions: e.target.checked })} /></label>

                {/* Display and manage saved cards */}
                <h3>Saved Cards</h3>
                <div className="saved-cards-container">
                    {profileData.cardDetails.map((card, index) => (
                        <div key={index} className="saved-card-display">
                            <div className="card-logo">{card.cardType}</div>
                            <div className="card-number">●●●● ●●●● ●●●● {card.cardNumber.slice(-4)}</div>
                            <div className="card-holder-name">{card.nameOnCard}</div>
                            <button type="button" onClick={() => handleDeleteCard(index)}>Delete Card</button>
                        </div>
                    ))}
                    {profileData.cardDetails.length < 3 && <button type="button">Add Card</button>}
                </div>

                <button type="button" onClick={handleSaveChanges}>Save Changes</button>

            </form>
        </div>
    );
}

export default EditProfile;




