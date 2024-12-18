import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraphView from '../Graph/Graph';
import ProverGraph from '../ProverGraph/ProverGraph';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import './IsomorphicGraph.css';

const IsomorphicGraph = () => { 
    const [nodes1, setNodes1] = useState([]);
    const [nodes2, setNodes2] = useState([]);
    const [edges2, setEdges2] = useState([]);
    const [PIfunc, setPIfunc] = useState();

    const [isLoaded, setIsLoaded] = useState(false); 
    const nav = useNavigate(); 

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
    }, []); 

    // const handleHome = () => { 
    //     nav('');
    // };
    
    return (
        
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
                            <ProverGraph {...{PIfunc: PIfunc, nodes1: nodes1}}/>
                        </>
                    </>
                ) : (
                    <p>Loading graphs...</p> 
                )}
            </div> 
            <div >
                
            </div>
        </div>
    );
}

export default IsomorphicGraph;
