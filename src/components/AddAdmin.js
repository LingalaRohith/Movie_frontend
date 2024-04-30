import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddAdmin.css';  // Assuming CSS is saved in this file

function AddAdmin() {
    const [adminData, setAdminData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/registerAdmin', adminData);
            alert('Admin registered successfully');
            navigate('/admin/manage-users');
        } catch (error) {
            console.error('Failed to register admin:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAdminData({ ...adminData, [name]: value });
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Add New Admin</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={adminData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={adminData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={adminData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={adminData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Register Admin</button>
            </form>
        </div>
    );
}

export default AddAdmin;

