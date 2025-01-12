import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import democratsIcon from '../../assets/democrats-icon.png'; 
import republicansIcon from '../../assets/republicans-icon.png';
import './SuccessVote.css'

function SuccessVote() {

const location = useLocation()
const nav = useNavigate()

  return (
    <div>
        <IconButton
                onClick={() => nav('/')} 
                style={{
                    position: 'fixed', 
                    top: '20px',
                    left: '20px',
                    color: '#495057', 
                    zIndex: 10, 
            }}
        >
            <HomeIcon fontSize="large" />
        </IconButton>
        <div className='success'>You Vote For The <strong>{location.state?.party}</strong> Party</div>
        {location.state?.party === 'Democrat' ? <img className='party-img' src={democratsIcon} alt="Democrats-Party" /> :  <img className='party-img' src={republicansIcon} alt="Repulicans-Party" />}
    </div>
  )
}

export default SuccessVote


