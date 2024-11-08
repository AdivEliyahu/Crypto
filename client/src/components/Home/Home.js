import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';



const test = () => { 
    axios.get('http://localhost:8000/isomorphicGraph', {
          params:{ID: 12345}
      })
      .then((response) => {
        console.log(response);
        if (response.data["message"] === "ok"){
            console.log("working")
        } 
        else{ 
            console.log("fuck me")
        }
      })
      .catch((error) => {
        console.log(error);
      })
}

const Home = () => { 
    return (
        <div> 
            <Button variant="outlined" onClick={test}>Click Here</Button>
        </div>
    )
}

export default Home