import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraphView from '../Graph/Graph';
import ProverGraph from '../ProverGraph/ProverGraph';
import './Home.css';

const Home = () => { 
    const [edges1, setEdges1] = useState([]);
    const [nodes2, setNodes2] = useState([]);
    const [edges2, setEdges2] = useState([]);
    const [PIfunc, setPIfunc] = useState();

    const [isLoaded, setIsLoaded] = useState(false); 


    useEffect(() => {
        axios.get('http://localhost:8000/get_graphs')
            .then((response) => {
                setEdges1(response.data["edges1"]);
                setNodes2(response.data["nodes2"]);
                setEdges2(response.data["edges2"]);
                setPIfunc(response.data["f"]);
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
                        <>          
                            <GraphView {...{ nodes: nodes2, edges: edges2, numGraph: 1 }} />             
                        </>
                        <>
                            <ProverGraph {...{PIfunc: PIfunc, edges1: edges1}}/>
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

export default Home;
