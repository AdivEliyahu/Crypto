import React, {useState} from "react";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import yesno from "yesno-dialog";


export default function Home() {

    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    
    const handleClick = async (navTo) => { 
      setLoading(true); 
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate small delay if needed
      nav(navTo);
      setLoading(false); 
    }


    const resetDB = async () => {
      const ans = await yesno({labelYes: "Yes, reset",
                                labelNo: "Don't reset",
                                bodyText: "Are you sure you want to reset the database?"});
      if (ans){
        const response = await fetch('http://localhost:8000/rest_db', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data['message']);
      }
        
    };


    return (
      <div className="container">
          {loading ? (
            <div className='loading-bar'>
              <div className='loading-bar-text'>Couple more seconds...</div>
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
                  <div className="clickable-div option" onClick={() => resetDB('rest db')}>
                      reset db
                  </div>
              </div>
            </>
            
          )}
      </div>
  );
}
