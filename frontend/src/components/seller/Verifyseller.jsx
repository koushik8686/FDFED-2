import React, { useEffect,  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Verifyseller.css';

const VerifySellerEmail = () => {
    const { sellerId } = useParams(); // Get sellerId from URL parameters
    const navigate = useNavigate();

    useEffect(() => {
        // Function to verify the seller's email
        const verifySellerEmail = async () => {
            try {
                // Send GET request to verify the seller
                const response = await axios.get(`/seller/verify/${sellerId}`);
                console.log(response);
                // Redirect to /sellerlogin after 3 seconds
                setTimeout(() => {
                    navigate('/seller');
                }, 1500);
            } catch (error) {
                // Handle error if verification fails
            }
        };

        // Call the verifySellerEmail function when the component mounts
        verifySellerEmail();
    }, [sellerId, navigate]);

    return (
        <div className="verify-email">
            <h2>Seller Account Verification</h2>
            <p>You will be redirected to the login page shortly...</p>
        </div>
    );
};

export default VerifySellerEmail;
