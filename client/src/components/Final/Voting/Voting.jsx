import React, { useState } from 'react';
import democratsIcon from '../../assets/democrats-icon.png'; 
import republicansIcon from '../../assets/republicans-icon.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Voting.css';

function Voting() {
    const [message, setMessage] = useState('');
    const nav = useNavigate();
    const location = useLocation();
    const userID = location.state?.userID;

    const AES_KEY = sessionStorage.getItem('sharedSecret'); 
    const AES_IV = AES_KEY.slice(0, 16); 

    const encrypt = (text) => {
        const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(AES_KEY), {
            iv: CryptoJS.enc.Utf8.parse(AES_IV),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    };

    const handleVote = (party) => { 
        if (!userID || !party) {
            setMessage('Data missing!');
            return;
        }

        const encryptedUserID = encrypt(userID);
        const encryptedChoice = encrypt(party);

        console.log(`(encrypted: user ID ${userID}) voted for ${party}`); // just to see the data in the console
        console.log(`(encrypted: user ID ${encryptedUserID}) voted for ${encryptedChoice}`); // encrypted data

        axios.post('http://localhost:8000/vote', { 
            voter_id: encryptedUserID,
            choice: encryptedChoice,
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.status === 200) {
                nav('/SuccessVote', { state: { party: party } });
            }
            setMessage(response.data.message);
        })
        .catch((error) => {
            console.log("API error:", error);
        });
    };

    return (
        <div className='container'>
            <div className='party demo' onClick={() => handleVote('Democrat')}>
                <span>Democrats</span>
                <img src={democratsIcon} alt="Democrats-Party" />
            </div>
            <div className='party repub' onClick={() => handleVote('Republican')}>
                <span>Republicans</span>
                <img src={republicansIcon} alt="Republicans-Party" />
            </div>
            <span>{message}</span>
        </div>
    );
}

export default Voting;
