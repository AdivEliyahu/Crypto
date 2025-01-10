import React from 'react'
import democratsIcon from '../../assets/democrats-icon.png'; 
import republicansIcon from '../../assets/republicans-icon.png';
import './Voting.css'

function Voting() {

    const handleVote = (party) => { 
        console.log(`You voted for ${party}`)
    } 



  return (
    <div className='container'>
        <div className='party demo' onClick={() => handleVote('Democrats')}>
            <span>Democrats</span>
            <img src={democratsIcon} alt="Democrats-Party" />
        </div>
        <div className='party repub' onClick={() => handleVote('Republicans')}>
            <span>Republicans</span>
            <img src={republicansIcon} alt="Repulicans-Party" />
        </div>
    </div>
  )
}

export default Voting