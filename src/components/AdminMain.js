import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import "./admin.css";

function AdminMain({isLoggedIn, setisLoggedIn}) {
    const navigate = useNavigate(); 

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn}/>
            <div className='admin'>
                <h1>Administrator Home Page</h1>
                <h2>Options: </h2>
                <button onClick={() => handleNavigation('/admin/manage-users')}>Manage Users</button>
                <button onClick={() => handleNavigation('/admin/manage-movies')}>Manage Movies</button>
                <button onClick={() => handleNavigation('/admin/manage-promotions')}>Manage Promotions</button>
            </div>
        </div>
    );
}

export default AdminMain;
