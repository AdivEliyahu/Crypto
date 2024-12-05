import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import forge from 'node-forge';
import './KeyExchange.css'; 

export default function KeyExchange() {
  const [alpha, setAlpha] = useState(null);
  const [prime, setPrime] = useState(null);
  const [validSetUp, setValidSetUp] = useState(false); 
  const [error, setError] = useState('');

  const [publicRSAkey, setPublicRSAkey] = useState(null);
  const [privateRSAkey, setPrivateRSAkey] = useState(null);
  const [serverRSAkey, setServerRSAkey] = useState(null);

  // change this 
  useEffect(() => {
    // Generate RSA keys only once when the component mounts
    const generateRSAKeys = () => {
      const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
      const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
      const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

      setPublicRSAkey(publicKeyPem);
      setPrivateRSAkey(privateKeyPem);
    };

    generateRSAKeys();
  }, []); 
  


  useEffect(() => {
    const generatePrimeAndAlpha = async () => {
      try { 
        if (!publicRSAkey) return;

        const response = await axios.post('http://localhost:8000/get_public_RSA', {
          client_public_RSA: publicRSAkey.toString(),
        });

        setServerRSAkey(response.data['server_public_RSA']);
        
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const generatedPrime = await bigintCryptoUtils.prime(64); //size of prime by bits
        console.log("Generated Prime:", generatedPrime.toString());
        setPrime(generatedPrime);
        
        if (generatedPrime > 3n) {
          const generatedAlpha = bigintCryptoUtils.randBetween(generatedPrime - 2n, 2n);
          console.log('Alpha is:', generatedAlpha.toString());
          setAlpha(generatedAlpha);
        }
         
      } catch (err) {
        console.error("Error generating prime or alpha:", err);
        setError("Error in key generation setup."); 
      }
    };

    generatePrimeAndAlpha();
  }, [publicRSAkey, privateRSAkey,serverRSAkey]);

  const keyExchange = async () => { 
    if (!prime || !alpha) {
      setError("Prime or alpha not generated yet");
      return;
    }

    try {
    
      sessionStorage.setItem('privateKeyAlice', bigintCryptoUtils.randBetween(prime - 1n, 1n).toString());

      // eslint-disable-next-line no-undef
      const publicKeyValue = bigintCryptoUtils.modPow(alpha, BigInt(sessionStorage.getItem('privateKeyAlice')), prime);

      const test = forge.pki.publicKeyFromPem(serverRSAkey);

      const response = await axios.post('http://localhost:8000/key_exchange_set_up', {
        prime: test.encrypt(prime.toString(), 'RSA-OAEP'),
        alpha: alpha.toString(),
        publicKey: publicKeyValue.toString(),
      });
      
      console.log(response.data["message"]);

      // eslint-disable-next-line no-undef
      const bobPublicKey = BigInt(response.data["bobPublicKey"]);

      // eslint-disable-next-line no-undef
      sessionStorage.setItem('sharedSecret', bigintCryptoUtils.modPow(bobPublicKey ,BigInt(sessionStorage.getItem('privateKeyAlice')), prime).toString());

      setValidSetUp(true);
    } catch (error) {
      console.error("API error:", error);
      setError("Failed to complete key exchange");
    }
  };

  

  return (
    <div className="key-exchange-container">
      {!validSetUp ? (
        <div>
          {error && <div className="error">{error}</div>}
          {prime && alpha ? (
            <button onClick={keyExchange}>Start Key Exchange</button>
          ) : (
            <div className='loading-bar'>
              <div className='loading-bar-text'>Generating secure parameters...</div>
              <Box sx={{ width: '100vh', height: '10px', mt: 3}}>
                <LinearProgress color="inherit"/>
              </Box>
            </div>
 
          )}
        </div>
      ) : (
        <div className='secure-chat'>
          <div className='success-container'>
            <h1 className="success-message">Key Exchange Successful!</h1>
            <p>Your Secret Is {sessionStorage.getItem('sharedSecret')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

