import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './verifyemail.css';

const VerifyEmail = () => {
    const { userid } = useParams(); // Get userid from URL parameters
    const navigate = useNavigate();

    useEffect(() => {
        // Function to verify the email
        const verifyUserEmail = async () => {
            try {
                // Send GET request to verify the user
                const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/verify/${userid}`);
                console.log(response);
                // Redirect to /login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } catch (error) {
              console.log(error);
            }
        };
        console.log(userid);
        // Call the verifyUserEmail function when the page loads
        verifyUserEmail();
    }, [userid, navigate]);

    return (
        <div className="verify-email">
            <h2>Email Verification</h2>
            <p>You will be redirected to login page shortly...</p>
        </div>
    );
};

export default VerifyEmail;
