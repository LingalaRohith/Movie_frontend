import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import "./admin.css";
import { useAuth } from './AuthContext';


function AdminMain() {
    const { isLoggedIn, isAdmin } = useAuth(); 
    const navigate = useNavigate(); 
    
    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        if (!isLoggedIn) { 
          console.log("Not logged in, navigating to login.");
          navigate("/login", { replace: true });
        } else if (!isAdmin) {
            navigate("/", { replace: true });
        }
      }, [navigate, isLoggedIn, isAdmin]); 
    

    return (
        <div>
            <div className='admin'>
                <h1>Administrator Home Page</h1>
                <button onClick={() => handleNavigation('/admin/manage-users')}>Manage Users</button>
                <button onClick={() => handleNavigation('/admin/manage-movies')}>Manage Movies</button>
                <button onClick={() => handleNavigation('/admin/manage-promotions')}>Manage Promotions</button>
                <button onClick={() => handleNavigation('/admin/manage-price')}>Manage Prices</button>

            </div>
        </div>
    );
}

export default AdminMain;
