import React, {useState} from "react";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';



export default function Home() {

    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    
    const handleClick = async (navTo) => { 
      setLoading(true); // Start loading
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate small delay if needed
      nav(navTo);
      setLoading(false); // Stop loading (optional, as it navigates away)
    }


    const restDB = async () => {
        const response = await fetch('http://localhost:8000/rest_db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        const data = await response.json();
        console.log(data['message']);
    };


    return (
      <div className="container">
          {loading ? (
            <div className='loading-bar'>
              <div className='loading-bar-text'>Generating secure parameters...</div>
              <Box sx={{ width: '100vh', height: '10px', mt: 3}}>
                <LinearProgress color="inherit"/>
              </Box>
              </div>
          ) : (
            <>
            <div className="title"> CRYPTOGRAPHY </div>
              <div className="button-container">
                  <div className="clickable-div option" onClick={() => handleClick('Diffie Hellman & AES')}>
                      Final Part
                  </div>
                  <div className="clickable-div option" onClick={() => handleClick('Result')}>
                      Results
                  </div>
                  <div className="clickable-div option" onClick={() => restDB('rest db')}>
                      rest db
                  </div>
              </div>
            </>
            
          )}
      </div>
  );
}
