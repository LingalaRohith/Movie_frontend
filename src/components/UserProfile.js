import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

   // Initialize state with a user object. If user details are passed, use them; otherwise, set default values.
   const [user, setUser] = useState(() => {
    // Default address structure
    const defaultAddress = {
        street: '',
        city: '',
        state: '',
        zipCode: ''
    };
    
    if (location.state?.user) {
        // If address is not provided, default it
        return {
            ...location.state.user,
            address: location.state.user.address || defaultAddress,
        };
    }

    // Default user structure if no user data is passed
    return {
        id: id,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: defaultAddress
    };
});
    const [cards, setCards] = useState([]); 
    const [errors, setErrors] = useState({}); 

  /*  const [cards, setCards] = useState([
        { cardNumber: '4111111111111111', expiryDate: '12/22' },
        // Add more card objects as needed
    ]);
*/
    const handleUserChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleCardChange = (index, event) => {
        const { name, value } = event.target;
        setCards(cards.map((card, i) => 
            i === index ? { ...card, [name]: value } : card
        ));
    };

    const addNewCard = () => {
        if (cards.length < 3) {
            setCards([...cards, { cardNumber: '', expiryDate: '' }]);
        } else {
            alert('Maximum of 3 cards allowed.');
        }
    };

    const removeCard = (index) => {
        setCards(cards.filter((_, i) => i !== index));
    };


    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!user.firstName) {
            isValid = false;
