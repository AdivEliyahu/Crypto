import React from "react";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";




export default function Home() {

    const nav = useNavigate()
    
    const handleClick = (navTo) => { 
        nav(navTo);
    }





  return (

    <div className="container">

        <div className="title"> CRYPTOGRAPHY </div>
        <div className="button-container">
            <div className="clickable-div option" onClick={() => handleClick('Isomorfphic Graph')}>
                    Final Part
            </div>
            <div className="clickable-div option" onClick={() => handleClick('Result')}>
                    Results
            </div> 
        
        </div>

    </div>

  );
}
