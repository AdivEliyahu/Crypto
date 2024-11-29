import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { prime } from 'bigint-crypto-utils';
//TASKS: 
// npm install bigint-crypto-utils
// save secret in session storage (NOT in local storage) because its cleared every end of session
// hide the private key

export default function KeyExchange() {
  
  const [alpha, setAlpha] = useState(0);
  const [prime, setPrime] = useState(0);
  const [validSetUp, setValidSetUp] = useState(false); 
  const [error, setError] = useState('');


  useEffect(() => {
    (async () => {
        const generatedPrime = await prime(2048);
        console.log('Prime is:', generatedPrime);
        setPrime(generatedPrime);
    })();
}, []);

  useEffect(() => {
      if (prime) {
          const generatedAlpha = Math.floor(Math.random() * (prime - 3)) + 2;
          console.log('alpha is: ', generatedAlpha);
          setAlpha(generatedAlpha);
      }
  }, [prime]);

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

  const keyExchange = () => { 
    const privateKeyValue = Math.floor(Math.random() * (prime - 1)) + 1; // move this to *session* storage
    const publicKeyValue = Math.pow(alpha, privateKeyValue) % prime;
    //setPublicKey(publicKeyValue); maybe still need that - dont remove
    
    axios.get('http://localhost:8000/key_exchange_set_up', {
      params : { 
        prime: prime, 
        alpha : alpha,
        publicKey: publicKeyValue,
      }
    })
    .then((response) => {
      console.log(response.data["message"]);
      console.log('Alice private key: ', privateKeyValue);

      const secret = Math.pow(response.data['bobPublicKey'], privateKeyValue) % prime;
      console.log('Secret is: ', secret);
    })
    .catch((error) => {
      console.log("API error:", error);
    })
  };


  const handleKeyExchange = () => {
    if (validPrime() && validAlpha()) {
      setValidSetUp(true); // remember useState async maybe move this to the bottom of the handle
      keyExchange();
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
            <div onClick={handleKeyExchange}>Submit</div>
            {error}
        </div> 
        : 
        <div> </div> }
    </div>
  )
}
