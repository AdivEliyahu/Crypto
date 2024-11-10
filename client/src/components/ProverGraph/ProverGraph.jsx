import React, { useState } from 'react';
import GraphView from '../Graph/Graph';
import './ProverGraph.css'

const ProverGraph = () => {
    const [edges, setEdges] = useState([]);
    const nodes = [10, 20, 30, 40, 50];

    const handleInputChange = (event) => {
        const input = event.target.value;
        

        const parsedEdges = input
            .split(",") // split by commas
            .map(pair => pair.trim().split(" ")) // split pairs by space 
            .filter(pair => pair.length === 2 && !isNaN(pair[0]) && !isNaN(pair[1])); // filter valid pairs
      
        setEdges(parsedEdges);
    };

    return ( 
        <div className='proverGraphContainer'>
            <GraphView {...{nodes, edges, numGraph: 3}} />
            <input 
                type='text' 
                id='userInput'
                placeholder="Enter edges like '10 20, 20 30, ...'" 
                onChange={handleInputChange} 
            />
            <button>Submit</button> 
        </div>
    );
}
//the user need to enter or just show her the computer do it? 
//if computer than this part is useless 
export default ProverGraph;
