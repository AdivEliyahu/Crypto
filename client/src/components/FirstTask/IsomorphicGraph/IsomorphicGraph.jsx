import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraphView from '../Graph/Graph';
import ProverGraph from '../ProverGraph/ProverGraph';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import './IsomorphicGraph.css';
import CryptoJS from 'crypto-js';


const IsomorphicGraph = (props) => { 
    const [nodes1, setNodes1] = useState([]);
    const [nodes2, setNodes2] = useState([]);
    const [edges2, setEdges2] = useState([]);
    const [PIfunc, setPIfunc] = useState();
    const [Id, setId] = useState(null);
    const [filledId, setFilledId] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [userStatusMessage, setUserStatusMessage] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false); 
    const nav = useNavigate(); 

    useEffect(() => { 
        props.keyExchange();
    },[props]);

    useEffect(() => {
        axios.get('http://localhost:8000/get_graphs')
            .then((response) => {
                setNodes1(response.data["nodes1"]);
                setNodes2(response.data["nodes2"]);
                setEdges2(response.data["edges2"]);
                setPIfunc(response.data["f"]);
                setIsLoaded(true); 
            })
            .catch((error) => {
                console.log("API error:", error);
            });
    }, [filledId]); 

    const encrypt = (text) => {
        
            if (!sessionStorage.getItem('sharedSecret')) {
                return;
            }
            const AES_KEY = sessionStorage.getItem('sharedSecret'); 
            const AES_IV = AES_KEY.slice(0, 16); 
            const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(AES_KEY), {
                iv: CryptoJS.enc.Utf8.parse(AES_IV),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            return encrypted.toString();
        };

    const filledIdEncrypted = encrypt(filledId);

    useEffect(() => {
        if (!filledIdEncrypted) return;
        axios.post('http://localhost:8000/valid_user', {
            voter_id: filledIdEncrypted,
        })
            .then((response) => {
                console.log(response.data);
                setUserStatus(response.data['status']);
                setUserStatusMessage(response.data['message']);
            })
            .catch((error) => {
                console.log("API error:", error);
            });
    }, [filledId,filledIdEncrypted]); 

    //setting up the key exchange


    return (
        <div>
            {filledId ? (

            <div>
                <IconButton
                    onClick={() => nav('/')} 
                    style={{
                        position: 'fixed', 
                        top: '20px',
                        left: '20px',
                        color: '#495057', 
                        zIndex: 10, 
                    }}
                >
                    <HomeIcon fontSize="large" />
                </IconButton>
                

                <h1 className='title'>Isomorphic Graphs</h1>
                <div className='isomorphicGraphs'> 
                    {isLoaded ? (
                        <>
                            <div>          
                                <GraphView className='IsoGraph' {...{ nodes: nodes2, edges: edges2, numGraph: 2 }} />            
                            </div>
                            <>
                                <ProverGraph {...{PIfunc: PIfunc, nodes1: nodes1, userID : Id, userStatus: userStatus, userStatusMessage: userStatusMessage}}/>
                            </>
                        </>
                    ) : (
                        <p>Loading graphs...</p> 
                    )}
                </div> 
                <div >
                    
                </div>
            </div>  
            ) : (
                <div className='idForm'>
                    <IconButton
                    onClick={() => nav('/')} 
                    style={{
                        position: 'fixed', 
                        top: '20px',
                        left: '20px',
                        color: '#495057', 
                        zIndex: 10, 
                    }}
                >
                    <HomeIcon fontSize="large" />
                </IconButton>
                    <h1>Please Enter Your ID</h1>
                    <input type='number' id='filledId' onChange={(e) => setId(e.target.value)}/>
                    <button className='submit-btn' onClick={() => setFilledId(Id)}>Submit</button>
                </div> 
            )}
        </div>
    );
}

export default IsomorphicGraph;
