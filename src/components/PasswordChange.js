import React, { useState, useEffect } from 'react';
import './PasswordChange.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';



function PasswordChange() {
    const navigate = useNavigate();
    const { isLoggedIn, login, logout } = useAuth(); 
    const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
    useEffect(() => {
        if (!email) {
            alert('No email found. Please ensure you have accessed this page through the correct procedure.');
            navigate('/'); 
        } else {
            console.log(email);
        }
    }, [email, navigate]);
    const [customer,setCustomer] = useState(
        {
            userID: '',
            email: '',
            password: '',
            userRole: 1,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            promotionsSubscribed: '',
            verificationCode: '',
            customerStatusID: 1,
            street: '',
            city: '',
            state: '',
            zipcode: ''
        }
    );
    const [formData, setFormData] = useState({
        oldPassword:'',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const validateForm = () => {
        const errors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!passwordRegex.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters long, contain a number, a special character, and a capital letter.';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords must match.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) {
            return;
        } 
        
        try {
            const response = await axios.post('http://localhost:8080/getcustomerx', { email: email });
            if (response.data && response.data['200']) {
                const responseData = response.data['200'].customer;
                const updatedCustomer = { 
                    ...customer,
                    userID: responseData.userID,
                    email: responseData.email,
                    password: formData.password, 
                    userRole: responseData.userRole,
                    firstName: responseData.firstName,
                    lastName: responseData.lastName,
                    phoneNumber: responseData.phoneNumber,
                    promotionsSubscribed: responseData.promotionsSubscribed,
                    verificationCode: responseData.verificationCode,
                    customerStatusID: responseData.customerStatusID,
                    street: responseData.street,
                    city: responseData.city,
                    state: responseData.state,
                    zipcode: responseData.zipcode
                };
    
                if (responseData.password === formData.oldPassword) {
                    try {
                        const res = await axios.post('http://localhost:8080/updateCustomer', updatedCustomer);
                        console.log(res.data);
                        alert('Password Changed! Please login again.');
                        logout();
                        navigate('/login');
                    } catch (updateError) {
                        console.error("Error in updating password", updateError);
                    }
                } else {
                    alert('Incorrect current password');
                    navigate('/password-change');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    return (
        <div>
            <div className="password-change-container">
                <h2>Reset Password</h2>
                <form className="password-change-form" onSubmit={handleSubmit}>
                <div className="input-group">
                        <input type="password" id="oldPassword" name="oldPassword" placeholder="Current Password" required onChange={handleInputChange} />
                        {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                         <input type="password" id="password" name="password" placeholder="New Password" required onChange={handleInputChange} />
                        {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                         <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} />
                         {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
                    </div>
                    <button type="submit">Confirm Password</button>
                </form>
            </div>
        </div>
    );
}

export default PasswordChange;