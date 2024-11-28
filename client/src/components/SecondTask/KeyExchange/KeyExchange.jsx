import React, { useState } from 'react'
import axios from 'axios';
export default function KeyExchange() {
  
  const [alpha, setAlpha] = useState(0);
  const [prime, setPrime] = useState(0);

  const [validSetUp, setValidSetUp] = useState(false); 
  const [error, setError] = useState('');

  const validPrime = () => { 
    for (let i = 2; i <= prime/2; i++) {
      if (prime % i === 0) {
          return false;
      }
    }
    return true;
  };

  const validAlpha = () => { 
    if(alpha > prime - 2 || alpha < 2)
      return false; 
    return true;
  };

  const publishSetUp = () => { 
    axios.get('http://localhost:8000/key_exchange_set_up', {
      params : { 
        prime: prime, 
        alpha : alpha,
      }
    })
    .then((response) => {
      console.log(response.data["message"]);
    })
    .catch((error) => {
      console.log("API error:", error);
    })
  };

  const handleSubmitSetUp = () => {
    if (validPrime() && validAlpha()) {
      setValidSetUp(true);
      publishSetUp();
    }
    else 
      setError('no good');
  };
  
  
    return (
    <div>
       { !validSetUp ?
        <div className=''>
            <input type='number' onChange={(event) => setPrime(event.target.value)} placeholder='Choose a large prime p'/>
            <input type='number' onChange={(event) => setAlpha(event.target.value)} placeholder='Choose an integer between 2 and p-2 (alpha)'/>
            <div onClick={handleSubmitSetUp}>Submit</div>
            {error}
        </div> 
        : 
        <div> {alpha} and {prime} good</div> }
    </div>
  )
}
