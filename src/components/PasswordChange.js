import React, { useState } from 'react';
import Header from './Header';
import './PasswordChange.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordChange() {
    const navigate = useNavigate();
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        } else {
            setIsLoggedIn(false);
            // navigate('/password-confirmation');
        
        try {
            const response = await axios.post('http://localhost:8080/getcustomerx', { email: localStorage.getItem('email') });
            if (response.data['200']){
                const responseData = response.data['200'].customer;
                customer.userID = responseData.userID;
                customer.userID= responseData.userID,
                    customer.email= responseData.email,
                    customer.password= responseData.password,
                    customer.userRole= responseData.userRole,
                    customer.firstName= responseData.firstName,
                    customer.lastName= responseData.lastName,
                    customer.phoneNumber= responseData.phoneNumber,
                    customer.promotionsSubscribed= responseData.promotionsSubscribed,
                    customer.verificationCode= responseData.verificationCode,
                    customer.customerStatusID= responseData.customerStatusID,
                    customer.street= responseData.street,
                    customer.city= responseData.city,
                    customer.state= responseData.state,
                    customer.zipcode= responseData.zipcode

                        // setCustomer(prevCustomer => ({
                        //     ...prevCustomer,
                        //     password: formData.oldPassword
                        // }));

                        if (responseData.password === formData.oldPassword)
                        {
                            customer.password = formData.password;
                            try{
                                const res = await axios.post('http://localhost:8080/updateCustomer',customer);
                                console.log(res.data);
                                alert('Password Changed! Please login');
                                navigate('/login');
                        }catch{
                            console.log("error in updation");
                        }
            }
            else{
                alert('incorrect current password');
                navigate('/password-change');
            }
            
        } 
    }catch (error) {
            console.error('Error fetching data:', error);
        }
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