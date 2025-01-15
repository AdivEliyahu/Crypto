import React from "react";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";




export default function Home() {

    const nav = useNavigate()
    
    const handleClick = (navTo) => { 
        nav(navTo);
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

        <div className="title"> CRYPTOGRAPHY </div>
        <div className="button-container">
            <div className="clickable-div option" onClick={() => handleClick('Isomorfphic Graph')}>
                    Final Part
            </div>
            <div className="clickable-div option" onClick={() => handleClick('Result')}>
                    Results
            </div> 
            <div className="clickable-div option" onClick={() => restDB('rest db')}>
                    rest db
            </div>
        
        </div>

    </div>

  );
}
