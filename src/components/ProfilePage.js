import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Header from './Header';
import './profilepage.css';

const initialUserData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '123-456-7890',
  creditCard: {
    number: '**** **** **** 1234',
    expirationDate: '12/24',
    cvv: '123'
  },
  address: {
    homeAddress: '123 Main St',
    city: 'Anytown',
    state: 'Anystate',
    postalCode: '12345',
    country: 'Canada'
  }
};

function ProfilePage({ isLoggedIn }) {
  const [userData, setUserData] = useState(initialUserData);

  const handleDeleteCreditCard = () => {
    const updatedUserData = { ...userData };
    delete updatedUserData.creditCard;
    setUserData(updatedUserData);
  };

  const handleDeleteAddress = () => {
    const updatedUserData = { ...userData };
    delete updatedUserData.address;
    setUserData(updatedUserData);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-info">
          <p><strong>First Name:</strong> {userData.firstName}</p>
          <p><strong>Last Name:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone Number:</strong> {userData.phone}</p>
          {userData.creditCard && (
            <div>
              <h2>Card/s on file:</h2>
              <div className='card'>
                <div>
                    <p><strong>Number:</strong> {userData.creditCard.number}</p>
                    <p><strong>Expiration Date:</strong> {userData.creditCard.expirationDate}</p>
                    <p><strong>CVV:</strong> {userData.creditCard.cvv}</p>
                </div>
                <button onClick={handleDeleteCreditCard}>Delete Credit Card</button>
              </div>
            </div>
          )}
          {userData.address && (
            <div>
              <h2>Address:</h2>
              <div className='style'>
                    <div>
                        <p><strong>Home Address:</strong> {userData.address.homeAddress}</p>
                        <p><strong>City:</strong> {userData.address.city}</p>
                        <p><strong>State/Province:</strong> {userData.address.state}</p>
                        <p><strong>Postal Code:</strong> {userData.address.postalCode}</p>
                        <p><strong>Country:</strong> {userData.address.country}</p>
                    </div>
                  
                  <button onClick={handleDeleteAddress}>Delete Address</button>
              </div>
            </div>
          )}
        </div>
        <Link to="/editprofile">
          <button>Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;

