import React, { useEffect, useState } from 'react';
import Header from './Header';
import './ManagePromotions.css';
// import { useEffect } from 'react';
import axios from 'axios';

function ManagePromotions({isLoggedIn}) {
    const [promotions, setPromotions] = useState([
        // some dummy data
        // { id: 1, name: 'Early Bird', description: 'Get 20% off for early bookings', code: 'EARLY20', amount: 0.80 },
        // { id: 2, name: 'Summer Sale', description: 'Enjoy the summer with a 15% discount', code: 'SUMMER15', amount: 0.85 },
        {
        "promoId": '',
        "promoCode": '',
        "promoDescription": '',
        "startDate": '',
        "endDate": '',
        "discountApplied": 0
        }
    ]);

    useEffect (() => {
        async function fetchPromos() {
          try {
            const response = await axios.get('http://localhost:8080/getAllPromos');
            console.log(response);
            setPromotions(response.data);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        }
        fetchPromos();
      }, []);

    const [newPromotion, setNewPromotion] = useState({ "promoId": '',
    "promoCode": '',
    "promoDescription": '',
    "startDate": '',
    "endDate": '',
    "discountApplied": 0 });

    const addPromotion = async() => {
        if (!newPromotion.name || !newPromotion.code || !newPromotion.amount) {
            alert('Please fill in all fields.');
            return;
        }
        setPromotions([...promotions, { ...newPromotion, id: promotions.length + 1 }]);
        setNewPromotion({ name: '', description: '', code: '', amount: '' });
         // Reset form
         try {
            const response = await axios.post('http://localhost:8080/addPromo',{
                newPromotion    //need to populate the data from console
            });
            console.log(response);
            if(response)
                alert("addes successfully");
            else
                alert("something went wrong");
          } catch (error) {
            console.error('Error fetching movies:', error);
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
        <div>
            <Header isLoggedIn={isLoggedIn}/>
            <div className="manage-promotions"> 
            <h5>Manage Promotions</h5>
            <div className="promotion-list">
                {promotions.map((promotion) => (
                    <div key={promotion.promoId} className="promotion-item">
                        <div className="promotion-details">
                            <h3>{promotion.name}</h3>
                            <p>{promotion.promoDescription}</p>
                            <p>Code: {promotion.promoCode}</p>
                            <p>Discount: {promotion.discountApplied * 100}%</p>
                        </div>
                        <button onClick={() => deletePromotion(promotion.promoId)} className="btn-delete">Delete</button>
                    </div>
                ))}
            </div>
            <div className="add-promotion-form">
                <h3>Add New Promotion</h3>
                <input
                    type="text"
                    placeholder="Promotion Name"
                    name="name"
                    value={newPromotion.name}
                    onChange={handleInputChange}
                />
                <textarea
                    placeholder="Description"
                    name="description"
                    value={newPromotion.description}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Code"
                    name="code"
                    value={newPromotion.code}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Amount (as a decimal Eg. .80 = 80%)"
                    name="amount"
                    value={newPromotion.amount}
                    onChange={handleInputChange}
                />
                <button onClick={addPromotion} className="btn-add">Add Promotion</button>
            </div>
            </div>

        </div>
    );
}

export default ManagePromotions;
