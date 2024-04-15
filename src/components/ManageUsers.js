import React, { useEffect, useState } from 'react';
import Header from './Header';
import './ManageUsers.css';
import axios from 'axios';

function ManageUsers({ isLoggedIn }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('http://localhost:8080/getAllcustomers');
                const filteredUsers = response.data
                    .filter(user => user.userRole === "Customer")
                    .map(user => ({
                        ...user,
                        status: user.customerStatusID === "Active" ? 'active' : 'inactive', // Default states
                        actionAvailable: 'Suspend',  // Default action
                        canDelete: true, // Make delete option always available
                        suspended: false // track suspension status
                    }));
                setUsers(filteredUsers);
                localStorage.setItem('users', JSON.stringify(filteredUsers)); // store initial users in localStorage, dont think we need
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const handleAction = (id, action) => {
        const now = new Date();
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.userID === id) {
                if (action === 'Delete') {
                    return null; //  removes the user from the state
                }

                let updates = { ...user };

                if (action === 'Suspend') {
                    updates = {
                        ...user,
                        customerStatusID: 'Inactive',
                        status: 'suspended',
                        actionAvailable: 'Activate',
                        suspended: true,
                        suspensionDate: now.toISOString()
                    };
                } else if (action === 'Activate') {
                    updates = {
                        ...user,
                        customerStatusID: 'Active',
                        status: 'active',
                        actionAvailable: 'Suspend',
                        suspended: false
                    };
                }

                return updates;
            }
            return user;
        }).filter(user => user)); // ensures  deleted users are removed
    };

    return (
        <div>
            <div className="manage-users">
                <h5>Manage Users</h5>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Customer Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userID} style={{
                                backgroundColor: user.status === 'suspended' ? 'yellow' : '',
                                color: user.status === 'active' ? 'green' : user.status === 'suspended' ? 'red' : 'darkorange'
                            }}>
                                <td>{user.userID}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="dropdown">
                                        <button className="dropbtn">{user.status.toUpperCase()}</button>
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
            </div>
        </div>
    );
}

export default ManageUsers;
