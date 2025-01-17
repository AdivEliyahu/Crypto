import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import './InvalidUser.css'

function InvalidUser() {

    const nav = useNavigate()
    const location = useLocation()
    const userStatusMessage = location.state?.userStatusMessage


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
    <div className='invalidMessage'>{userStatusMessage}</div>
    </div>

  )
}

export default InvalidUser