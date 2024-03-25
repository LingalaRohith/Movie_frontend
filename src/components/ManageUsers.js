import React, { useState } from 'react';
import Header from './Header';
import './ManageUsers.css';

function ManageUsers({isLoggedIn}) {
    const initialUsers = [
        { id: 1, name: 'John Cena', email: 'johnc12@yahoo.com' },
        { id: 2, name: 'Jane Johnson', email: 'janejohnson@hotmail.com' },
        { id: 3, name: 'Emma Thompson', email: 'emmathompson@gmail.com'}, 
        { id: 4, name: 'Johnny Depp', email: 'johnnypoo450@gmail.com' },
        { id: 5, name: 'Rhea Kartha', email: 'rheamonkey@gmail.com' },
        { id: 6, name: 'Cate Redhead', email: 'categinger@gmail.com'}, 
    ];

    const [users, setUsers] = useState(initialUsers);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    const addUser = () => {
        if (!newUserName || !newUserEmail) return; // Basic validation
        const newUser = {
            id: users.length + 1, // Simple id assignment
            name: newUserName,
            email: newUserEmail,
        };
        setUsers([...users, newUser]);
        setNewUserName('');
        setNewUserEmail('');
    };

    const deleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn}/>
            <div className="manage-users">
                <h5>Manage Users</h5>
                <div className="add-user-form">
                    <input type="text" placeholder="Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    <input type="email" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                    <button onClick={addUser} className="btn btn-add">Add User</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-delete">Delete</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageUsers;
