import React, { useState } from 'react'
import axios from 'axios';
export default function KeyExchange() {
  
  const [alpha, setAlpha] = useState(0);
  const [prime, setPrime] = useState(0);
  const [privateKey, setPrivateKey] = useState(0); // move this maybe to localstorge
  const [publicKey, setPublicKey] = useState(0);

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
    const privateKeyValue = Math.floor(Math.random() * (prime - 1)) + 1;
    setPrivateKey(privateKeyValue);
    const publicKeyValue = Math.pow(alpha, privateKeyValue) % prime;
    setPublicKey(publicKeyValue);
    
    axios.get('http://localhost:8000/key_exchange_set_up', {
      params : { 
        prime: prime, 
        alpha : alpha,
        publicKey: publicKey,
      }
    })
    .then((response) => {
      console.log(response.data["message"]);
      //here generate secret and save it in localstorage as well
    })
    .catch((error) => {
      console.log("API error:", error);
    })
  };


  const handleSubmitSetUp = () => {
    if (validPrime() && validAlpha()) {
      setValidSetUp(true); // remember useState async maybe move this to the bottom of the handle
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
        <div> alpha: {alpha} prime: {prime} private key alice {privateKey} public key alice {publicKey} </div> }
    </div>
  )
}
