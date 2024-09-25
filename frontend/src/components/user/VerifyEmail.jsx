import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './verifyemail.css';

const VerifyEmail = () => {
    const { userid } = useParams(); // Get userid from URL parameters
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        // Function to verify the email
        const verifyUserEmail = async () => {
            try {
                // Send GET request to verify the user
                const response = await axios.get(`http://localhost:4000/verify/${userid}`);
                setStatusMessage(response.data.message);
                
                // Redirect to /login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } catch (error) {
                // Handle error if verification fails
                setStatusMessage('Email verification failed. Please try again.');
            }
        };

        // Call the verifyUserEmail function when the component mounts
        verifyUserEmail();
    }, [userid, navigate]);

    return (
        <div className="verify-email">
            <h2>Email Verification</h2>
            <p>{statusMessage}</p>
            <p>You will be redirected to login page shortly...</p>
        </div>
    );
};

export default VerifyEmail;
