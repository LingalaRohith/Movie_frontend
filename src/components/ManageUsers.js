import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            console.log("Not logged in, navigating to login.");
            navigate("/login", { replace: true });
        }
    }, [navigate, isLoggedIn]);

    useEffect(() => {
        fetchUsers();
        fetchAdmins();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/getAllcustomers');
            const filteredUsers = response.data.filter(user => user.userRole === "Customer")
                .map(user => ({
                    ...user,
                    status: user.customerStatusID === "Active" ? 'active' : 'suspended',
                    actionAvailable: user.customerStatusID === "Active" ? 'Suspend' : 'Activate',
                    suspended: user.customerStatusID !== "Active"
                }));
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/getAllAdmins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    const handleAdminRegistration = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/registerAdmin', newAdmin);
            if (response.status === 200) {
                alert('Admin registered successfully');
                setAdmins([...admins, response.data]); // Assume the response includes the new admin's details
                setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
            }
        } catch (error) {
            console.error('Failed to register admin:', error);
        }
    };
    const handleAction = async (id, action) => {
        let endpoint = '';
        let statusUpdate = {};
        if (action === 'Suspend') {
            endpoint = '/suspendCustomer';
            statusUpdate = { customerStatusID: 'InActive', status: 'suspended', actionAvailable: 'Activate', suspended: true };
        } else if (action === 'Activate') {
            endpoint = '/activateCustomer';
            statusUpdate = { customerStatusID: 'Active', status: 'active', actionAvailable: 'Suspend', suspended: false };
        } else if (action === 'Delete') {
            endpoint = '/deleteCustomer';
        }
       
        try {
            await axios.post(`http://localhost:8080${endpoint}`, { userID: id });
            setUsers(prevUsers =>
                prevUsers.map(user => {
                    if (user.userID === id) {
                        return { ...user, ...statusUpdate };
                    }
                    return user;
                })
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const goToUserProfile = (user) => {
        navigate(`/user/${user.userID}`, { state: { user } });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAdmin({ ...newAdmin, [name]: value });
    };

    
    return (
        <div className="manage-users">
            <h5>Manage Users</h5>
            {/* User table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Customer Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {users.map(user => (
                 <tr key={user.userID} style={{
                     backgroundColor: user.suspended ? 'yellow' : '',
                         color: user.status === 'active' ? 'green' : 'red'
                        }}>
                        <td>{user.userID}</td>
                        <td onClick={() => navigate(`/user/${user.userID}`, { state: { user } })} style={{ cursor: 'pointer' }}>
                            {`${user.firstName} ${user.lastName}`}
                            </td>
                             <td>{user.email}</td>
                             <td>{user.status.toUpperCase()}</td>
                             <td>
                             <div className="dropdown">
                                <button className="dropbtn">{user.actionAvailable}</button>
                                <div className="dropdown-content">
                                    {user.suspended ? (
                                        <a href="#!" onClick={() => handleAction(user.userID, 'Activate')}>Activate</a>
                                    ) : (
                                        <a href="#!" onClick={() => handleAction(user.userID, 'Suspend')}>Suspend</a>
                                    )}
                                    <a href="#!" onClick={() => handleAction(user.userID, 'Delete')}>Delete</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Admin registration form */}
            <div className="admin-registration">
                <h5>Add New Admin</h5>
                <form onSubmit={handleAdminRegistration}>
                    <input type="text" name="firstName" placeholder="First Name" value={newAdmin.firstName} onChange={handleInputChange} required />
                    <input type="text" name="lastName" placeholder="Last Name" value={newAdmin.lastName} onChange={handleInputChange} required />
                    <input type="email" name="email" placeholder="Email" value={newAdmin.email} onChange={handleInputChange} required />
                    <input type="password" name="password" placeholder="Password" value={newAdmin.password} onChange={handleInputChange} required />
                    <button type="submit">Register Admin</button>
                </form>
            </div>
            {/* Admins table */}
            <h5>Admin List</h5>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin, index) => (
                        <tr key={index}>
                            <td>{`${admin.firstName} ${admin.lastName}`}</td>
                            <td>{admin.email}</td>
                            <td>Admin</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ManageUsers;
