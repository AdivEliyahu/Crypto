import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import bigInt from 'big-integer';
import './KeyExchange.css'; 

export default function KeyExchange() {
  const [alpha, setAlpha] = useState(null);
  const [prime, setPrime] = useState(null);
  const [validSetUp, setValidSetUp] = useState(false); 
  const [error, setError] = useState('');
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const generatePrimeAndAlpha = async () => {
      try {
        setLoading(true); // Start loading
        const generatedPrime = await bigintCryptoUtils.prime(64); //maybe 2048 bits
        console.log("Generated Prime:", generatedPrime.toString());
        setPrime(generatedPrime);

        if (generatedPrime > 3n) {
          const generatedAlpha = bigintCryptoUtils.randBetween(generatedPrime - 2n, 2n);
          console.log('Alpha is:', generatedAlpha.toString());
          setAlpha(generatedAlpha);
        }
        
        setLoading(false); 
      } catch (err) {
        console.error("Error generating prime or alpha:", err);
        setError("Error in key generation setup.");
        setLoading(false); 
      }
    };

    generatePrimeAndAlpha();
  }, []);

  const keyExchange = async () => { 
    if (!prime || !alpha) {
      setError("Prime or alpha not generated yet");
      return;
    }

    try {
      const privateKeyValue = bigintCryptoUtils.randBetween(prime - 1n, 1n); //move to session storage?
      setPrivateKey(privateKeyValue);
      sessionStorage.setItem('privateKeyAlice', privateKeyValue.toString());
      console.log('Alice', privateKeyValue);

      const publicKeyValue = bigintCryptoUtils.modPow(alpha, privateKeyValue, prime);
      setPublicKey(publicKeyValue);

      const response = await axios.post('http://localhost:8000/key_exchange_set_up', {
        prime: prime.toString(),
        alpha: alpha.toString(),
        publicKey: publicKeyValue.toString(),
      });

      console.log(response.data["message"]);
      console.log('Bob public key: ', response.data["bobPublicKey"]);
      const bobPublicKey = bigInt(response.data["bobPublicKey"]);

      // secret in session storage
      sessionStorage.setItem('sharedSecret', bobPublicKey.modPow(privateKeyValue, prime).toString());

      setValidSetUp(true);
    } catch (error) {
      console.error("API error:", error);
      setError("Failed to complete key exchange");
    }
  };

  const handleKeyExchange = () => {
    keyExchange();
  };

  return (
    <div className="key-exchange-container">
      {!validSetUp ? (
        <div>
          {error && <div className="error">{error}</div>}
          {prime && alpha ? (
            <button onClick={handleKeyExchange}>Start Key Exchange</button>
          ) : (
            <div>Generating secure parameters...</div>
          )}
          {loading && (
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: '100%' }}></div>
            </div>
          )}
        </div>
      ) : (
        <h1 className="success-message">Key Exchange Successful!</h1>
      )}
    </div>
  );
}
