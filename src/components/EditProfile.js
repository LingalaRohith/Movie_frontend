import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
               const responseData = response.data[200];
               setProfileData({
                   ...profileData,
                   firstName: responseData.customer.firstName,
                   lastName: responseData.customer.lastName,
                   email: responseData.customer.email,
                   phone: responseData.customer.phoneNumber,
                   promotions: responseData.customer.promotionsSubscribed,
                   customerStatusID: responseData.customer.customerStatusID,
                   verificationCode: responseData.customer.verificationCode,
                   cardDetails: responseData.cardDetails || [],
                   address: {
                       homeAddress: responseData.customer.street || '',
                       city: responseData.customer.city || '',
                       state: responseData.customer.state || '',
                       postalCode: responseData.customer.zipcode || '',
                       country: '' // Assuming country is not returned by backend
                   }
               });
           } catch (error) {
               console.error('Error fetching data: ', error);
               alert('Error fetching profile data');
           }
       };
       fetchData();
   }, [initialEmail]);
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


     const [profileData, setProfileData] = useState({
       firstName: '',
       lastName: '',
       email: initialEmail,
       phone: '',
       promotions: false,
       customerStatusID: '',
       verificationCode: '',
       cardDetails: [],
       address: {
           homeAddress: '',
           city: '',
           state: '',
           postalCode: '',
           country: ''
       },
       currentPassword: '',
       password: '',
   });
  
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
       const updatedCardDetails = [...profileData.cardDetails];
       updatedCardDetails[index] = { ...updatedCardDetails[index], [name]: value };
       setProfileData({ ...profileData, cardDetails: updatedCardDetails });
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


   const addCreditCard = () => {
       setProfileData(prevProfileData => {
           // Check if the credit card limit has not been exceeded
           if (prevProfileData.cardDetails.length < 3) {
               const newCard = { number: '', expirationDate: '', cvv: '' };
               const updatedCardDetails = [...prevProfileData.cardDetails, newCard];
               return { ...prevProfileData, cardDetails: updatedCardDetails };
           } else {
               alert('Cannot add more than 3 cards.');
               return prevProfileData; // Return the unchanged state if limit is exceeded
           }
       });
   };
  
      
       const removeCreditCard = (index) => {
           const filteredCardDetails = profileData.cardDetails.filter((_, i) => i !== index);
           setProfileData({ ...profileData, cardDetails: filteredCardDetails });
       };
      
       const handleSubmit = async (e) => {
           e.preventDefault();
           let newErrors = {};
      
           // Basic field validations
           if (!profileData.firstName.trim()) {
               newErrors.firstName = 'First name is required.';
           }
           if (!profileData.lastName.trim()) {
               newErrors.lastName = 'Last name is required.';
           }
           if (!profileData.phone.trim()) {
               newErrors.phone = 'Phone number is required.';
           }
      
           // Validate credit card inputs if they are shown
           if (profileData.cardDetails.length > 0) {
               profileData.cardDetails.forEach((card, index) => {
                   if (!card.number.trim()) {
                       newErrors[`creditCardNumber${index}`] = 'Credit card number is required.';
                   }
                   if (!card.expirationDate.trim()) {
                       newErrors[`creditCardExpiration${index}`] = 'Expiration date is required.';
                   }
                   if (!card.cvv.trim()) {
                       newErrors[`creditCardCvv${index}`] = 'CVV is required.';
                   }
               });
           }
      
           // Validate address inputs if they are shown
           if (profileData.address.homeAddress) {
               if (!profileData.address.homeAddress.trim()) {
                   newErrors.homeAddress = 'Home address is required.';
               }
               if (!profileData.address.city.trim()) {
                   newErrors.city = 'City is required.';
               }
               if (!profileData.address.state.trim()) {
                   newErrors.state = 'State is required.';
               }
               if (!profileData.address.postalCode.trim()) {
                   newErrors.postalCode = 'Postal code is required.';
               }
               if (!profileData.address.country.trim()) {
                   newErrors.country = 'Country is required.';
               }
           }
      
           // Check for errors in validation before proceeding
           if (Object.keys(newErrors).length > 0) {
               setErrors(newErrors);
               return;  // Stop the form submission if there are validation errors
           }
      
           // If password change is detected, update the password first
           if (isChangingPassword) {
               try {
                   const passwordResponse = await axios.post('http://localhost:8080/changePassword', {
                       email: profileData.email,
                       oldPassword: profileData.currentPassword,
                       newPassword: profileData.password
                   });
                   if (passwordResponse.status !== 200) {
                       // Handle unsuccessful password change
                       alert('Failed to update password. Please check your current password.');
                       return;
                   }
               } catch (passwordError) {
                   console.error('Password update error:', passwordError);
                   alert('An error occurred while updating the password.');
                   return;
               }
           }
      
           // Update the rest of the profile
           try {
               const { currentPassword, password, ...userDataToUpdate } = profileData; // Exclude password fields
               const profileResponse = await axios.post('http://localhost:8080/updateCustomer', userDataToUpdate);
               if (profileResponse.status === 200) {
                   alert('Profile updated successfully.');
                   navigate('/profilepage', { state: { userData: profileData } });  // Redirect to profile page with updated data
               } else {
                   alert('Failed to update profile.');
               }
           } catch (profileError) {
               console.error('Profile update error:', profileError);
               alert('An error occurred while updating the profile.');
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



