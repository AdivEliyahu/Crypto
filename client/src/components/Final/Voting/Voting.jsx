import React, { useState } from 'react';
import democratsIcon from '../../assets/democrats-icon.png'; 
import republicansIcon from '../../assets/republicans-icon.png';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Voting.css'

function Voting() {

    const [message, setMessage] = useState('')

    const location = useLocation()
    const userID = location.state?.userID

    const handleVote = (party) => { 
        console.log(`${userID} You voted for ${party}`)
        axios.post('http://localhost:8000/vote', { 
            voter_id: userID,
            choice: party
        }
        )
            .then((response) => {
                console.log(response.data)
                setMessage(response.data.message)
            })
            .catch((error) => {
                console.log("API error:", error);
            });
    } 



  return (
    <div className='container'>
        <div className='party demo' onClick={() => handleVote('Democrat')}>
            <span>Democrats</span>
            <img src={democratsIcon} alt="Democrats-Party" />
        </div>
        <div className='party repub' onClick={() => handleVote('Republican')}>
            <span>Republicans</span>
            <img src={republicansIcon} alt="Repulicans-Party" />
        </div>
        <span>{message}</span>
    </div>
  )
}

export default Voting