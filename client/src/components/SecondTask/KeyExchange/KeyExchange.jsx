import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import forge from 'node-forge';
import './KeyExchange.css'; 
import IsomorficGraph from '../../FirstTask/IsomorphicGraph/IsomorphicGraph';

export default function KeyExchange() {
  const [alpha, setAlpha] = useState(null);
  const [prime, setPrime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [publicRSAkey, setPublicRSAkey] = useState(null);
  const [serverRSAkey, setServerRSAkey] = useState(null);

  useEffect(() => {
    const generateRSAKeys = () => {
      const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
      sessionStorage.setItem('PRIVATE_KEY_PEM', forge.pki.privateKeyToPem(privateKey));
      const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

      setPublicRSAkey(publicKeyPem);
    };

    generateRSAKeys();
    setLoading(false);
  }, []); 
  


  useEffect(() => {
    const generatePrimeAndAlpha = async () => {
      try { 
        if (!publicRSAkey) return;
        const response = await axios.post('http://localhost:8000/get_public_RSA', {
          client_public_RSA: publicRSAkey.toString(),
      }, {
          headers: {
              'Content-Type': 'application/json',
          }
      });

        setServerRSAkey(response.data['server_public_RSA']);

        const generatedPrime = await bigintCryptoUtils.prime(128); //size of prime by bits
        setPrime(generatedPrime);
        
        if (generatedPrime > 3n) {
          const generatedAlpha = bigintCryptoUtils.randBetween(generatedPrime - 2n, 2n);
          setAlpha(generatedAlpha);
        }
         
      } catch (err) {
        console.error("Error generating prime or alpha:", err);
        setError("Error in key generation setup."); 
      }
    };

    generatePrimeAndAlpha();
  }, [publicRSAkey,serverRSAkey]);

  const keyExchange = async () => { 
    if (!prime || !alpha) {
      setError("Prime or alpha not generated yet");
      return;
    }

    try {
      sessionStorage.setItem('privateKeyAlice', bigintCryptoUtils.randBetween(prime - 1n, 1n).toString());

      // eslint-disable-next-line no-undef
      const publicKeyValue = bigintCryptoUtils.modPow(alpha, BigInt(sessionStorage.getItem('privateKeyAlice')), prime);

      const publicKeyServer = forge.pki.publicKeyFromPem(serverRSAkey);

      // Convert the prime to bytes before encrypting
      const encryptedPrime = forge.util.encode64(publicKeyServer.encrypt(prime.toString(), 'RSA-OAEP', {
          md: forge.md.sha256.create(),
          mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
      }));

      const encryptedAlpha = forge.util.encode64(publicKeyServer.encrypt(alpha.toString(), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
      }));

      const encryptedPublicKeyValue = forge.util.encode64(publicKeyServer.encrypt(publicKeyValue.toString(), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
      }));

      const response = await axios.post('http://localhost:8000/key_exchange_set_up', {
          prime: encryptedPrime,
          alpha: encryptedAlpha,
          publicKey: encryptedPublicKeyValue,
      });
      
      console.log(response.data["message"]);

      const encryptedBobKey = forge.util.decode64(response.data["bobPublicKey"]);

      const bobPublicKeyDecrypted = forge.pki.privateKeyFromPem(sessionStorage.getItem('PRIVATE_KEY_PEM'))
                                    .decrypt(encryptedBobKey, 'RSA-OAEP', {
          md: forge.md.sha256.create(),
          mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
      });

      // eslint-disable-next-line no-undef
      const bobPublicKey = BigInt(bobPublicKeyDecrypted);

      // eslint-disable-next-line no-undef
      sessionStorage.setItem('sharedSecret', bigintCryptoUtils.modPow(bobPublicKey ,BigInt(sessionStorage.getItem('privateKeyAlice')), prime).toString().slice(0, 32));

    } catch (error) {
      console.error("API error:", error);
      setError("Failed to complete key exchange");
    }
  };

  

  return (
    <div className="key-exchange-container">
        <div>
          {error && <div className="error">{error}</div>}
          {prime && alpha && !loading ? (
            <IsomorficGraph keyExchange={keyExchange} />
          ) : (
            <div className='loading-bar'>
              <div className='loading-bar-text'>Generating secure parameters...</div>
              <Box sx={{ width: '100vh', height: '10px', mt: 3}}>
                <LinearProgress color="inherit"/>
              </Box>
            </div>
 
          )}
        </div> 
    </div>
  );
}

