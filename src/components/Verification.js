import React from 'react';
import Header from './Header';
import './verification.css';
import { Link } from 'react-router-dom';

function Verification() {
    return (
        <div>  
            <Header /> 
            <div className="verify">
            <h1>Thank you!</h1>
            <p>Please enter the verification code sent to your email.</p>
            <form class="center">
                <input type="text" placeholder="Verification Code" required/>
                <Link to="/registration-confirmation">
                    <button type="submit">Submit</button>
                </Link>
            </form>
            </div>          
        </div>
    );
}

export default Verification;
