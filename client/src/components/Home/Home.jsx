import React, { useState, useEffect } from 'react';
//import Button from '@mui/material/Button';
import axios from 'axios';
import GraphView from '../Graph/Graph';
import ProverGraph from '../ProverGraph/ProverGraph';
import './Home.css';

const Home = () => { 
    const [nodes1, setNodes1] = useState([]);
    const [edges1, setEdges1] = useState([]);
    const [nodes2, setNodes2] = useState([]);
    const [edges2, setEdges2] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false); 


    useEffect(() => {
        axios.get('http://localhost:8000/get_graphs')
            .then((response) => {
                setNodes1(response.data["nodes1"]);
                setEdges1(response.data["edges1"]);
                setNodes2(response.data["nodes2"]);
                setEdges2(response.data["edges2"]);
                setIsLoaded(true); 
 
            })
            .catch((error) => {
                console.log("API error:", error);
            });
    }, []); 
    
    return (
        <div>
            <div className='isomorphicGraphs'> 
                {isLoaded ? (
                    <>
                    
                        <GraphView {...{ nodes: nodes1, edges: edges1, numGraph: 1 }} />
                        <GraphView {...{ nodes: nodes2, edges: edges2, numGraph: 2 }} />
                    </>
                ) : (
                    <p>Loading graphs...</p> 
                )}
            </div> 
            <div >
                <ProverGraph />
            </div>
        </div>
    );
}

export default Home;
