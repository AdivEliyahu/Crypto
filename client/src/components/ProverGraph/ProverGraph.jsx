import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import './ProverGraph.css'


const ProverGraph = (props) => {
    const [randNodes, setRandNodes] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [correct, setCorrect] = useState(true);
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0); 
    const [coutner, setCounter] = useState(0); 
    const [currentNode, setCurrentNode] = useState(null); 

    const nav = useNavigate();

    const PIfunc = props['PIfunc'];
    const edges1 = props['edges1'];


    useEffect(() => {
        axios.get('http://localhost:8000/get_random_nodes')
            .then((response) => {
                setRandNodes(response.data["randNodes"]); 
                setCurrentNode(response.data["randNodes"][0]); 
            })
            .catch((error) => {
                console.log("API error:", error);
            });
    }, []); 





function testNode() {
    
    const node = PIfunc[currentNode]
    const nodeEdges = edges1.filter(edge => edge[0] === node);

    const normalizedNodeEdges = nodeEdges.length === 0
    ? ['0 undefined'] 
    : nodeEdges.map(edge => edge[0] === node ? `${edge[0]} ${edge[1]}` : "NULL")
                .filter(pair => pair !== "NULL"); 
   
    const inputEdges = userInput.split(',').map(edge => edge.trim());


    const normalizedInputEdges = inputEdges.length === 0
    ? ['0 undefined'] 
    : inputEdges.map(edge => {
        const [from, to] = edge.split(' ').map(Number);
        return `${from} ${to}`;
    });

    if (normalizedNodeEdges.length === normalizedInputEdges.length &&
        normalizedNodeEdges.every(edge => normalizedInputEdges.includes(edge))) {
        setUserInput('');
        console.log("Success");
        handleNextNode();
    } else {
        setUserInput('');
        console.log("Reject");
        handleNextNode();
        setCorrect(false);
    }
    setCounter(coutner + 1);
}






    const handleNextNode = () => {
        if (currentNodeIndex < randNodes.length - 1) {
            setCurrentNodeIndex(currentNodeIndex + 1);
            setCurrentNode(randNodes[currentNodeIndex + 1]);
        }
        else if(currentNodeIndex === randNodes.length - 1 && correct){
            nav('/Success');
        }
    };

    return (
        <div className='proverGraphContainer'>
            <>π* Function</>
            <>
            {Object.entries(PIfunc).map(([x, y]) => (
                <p className='mapElement' key={x}>{x} : {y}</p>
            ))}
            </>


            <div className="currentNodePrompt">
                <h3>Current Node: {currentNode}</h3>
                <p>Provide the edges for this node.</p>
            </div>

            <input 
                type='text' 
                id='userInput'
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter edges like 1 2, 1 3..."
            />

            {coutner < randNodes.length && <button className='nextNodeBtn' onClick={testNode}>Next Node</button>}    

            {!correct && coutner >= randNodes.length && <p className="error">Some nodes were incorrect. Please try again later.</p>}
        </div>
    );
}

export default ProverGraph;
