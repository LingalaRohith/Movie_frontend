import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManagePromotions.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 



function ManagePromotions() {
    const { isLoggedIn } = useAuth(); 
    const navigate = useNavigate(); 


    const [promotions, setPromotions] = useState([
        
        {
        "promoId": '',
        "promoCode": '',
        "promoDescription": '',
        "startDate": '',
        "endDate": '',
        "discountApplied": 0
        }
    ]);
    useEffect(() => {
        if (!isLoggedIn) { 
          console.log("Not logged in, navigating to login.");
          navigate("/login", { replace: true });
        }
      }, [navigate, isLoggedIn]); 

    useEffect(() => {
        async function fetchPromos() {
            try {
                const response = await axios.get('http://localhost:8080/getAllPromos');
                setPromotions(response.data || []);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        }

        fetchPromos();
    }, []);

    const [newPromotion, setNewPromotion] = useState({
        "promoId": '',
        "promoCode": '',
        "promoDescription": '',
        "startDate": '',
        "endDate": '',
        "discountApplied": 0
    });

    const addPromotion = async () => {
        if (!newPromotion.promoCode || !newPromotion.promoDescription || !newPromotion.startDate || !newPromotion.endDate || newPromotion.discountApplied <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const optimisticUpdate = [...promotions, newPromotion];
        setPromotions(optimisticUpdate); // Optimistically update UI

        try {
            const response = await axios.post('http://localhost:8080/addPromo', newPromotion);
            const addedPromotion = response.data[200];
            if (!addedPromotion) {
                // Revert optimistic update if add failed
                setPromotions(promotions);
                alert('Promotion already exists.');
                return;
            }
            // Confirm optimistic update
            setPromotions(optimisticUpdate);
            setNewPromotion({ promoCode: '', promoDescription: '', startDate: '', endDate: '', discountApplied: 0 });
            alert('Promotion added successfully!');
        } catch (error) {
            console.error('Error adding promotion:', error);
            setPromotions(promotions); // Revert optimistic update
            alert('Failed to add promotion.');
        }
    };

    const deletePromotion = async (id) => {
        setPromotions(promotions.filter(promotion => promotion.promoId !== id));
        try {
            const response = await axios.post('http://localhost:8080/deletePromo',{
                "promoId": id
            });
            console.log(response);
            if(response)
                alert("deleted successfully");
            else
                alert("something went wrong");
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
    };

    const handleInputChange = (e) => {
        setNewPromotion({ ...newPromotion, [e.target.name]: e.target.value });
    };



    return (
        <div className="manage-promotions">
            <h5>Manage Promotions</h5>
            <div className="promotion-list">
                {promotions.map((promotion) => (
                    <div key={promotion.promoId} className="promotion-item">
                        <div className="promotion-details">
                            <h3>{promotion.promoCode}</h3>
                            <p>{promotion.promoDescription}</p>
                            <p>Code: {promotion.promoCode}</p>
                            <p>Discount: {promotion.discountApplied}%</p>
                            <p>Valid from {promotion.startDate} to {promotion.endDate}</p>
                        </div>
                        <button onClick={() => deletePromotion(promotion.promoId)} className="btn-delete">Delete</button>
                    </div>
                ))}
            </div>
            <div className="add-promotion-form">
                <h3>Add New Promotion</h3>
                <input
                    type="text"
                    placeholder="Promotion Code"
                    name="promoCode"
                    value={newPromotion.promoCode}
                    onChange={handleInputChange}
                />
                <textarea
                    placeholder="Description"
                    name="promoDescription"
                    value={newPromotion.promoDescription}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="startDate"
                    value={newPromotion.startDate}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={newPromotion.endDate}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    placeholder="Discount Applied (%)"
                    name="discountApplied"
                    value={newPromotion.discountApplied}
                    onChange={handleInputChange}
                />
                <button onClick={addPromotion} className="btn-add">Add Promotion</button>
            </div>
        </div>
    );
}

export default ManagePromotions;
