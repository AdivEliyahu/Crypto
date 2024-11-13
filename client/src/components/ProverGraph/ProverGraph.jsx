import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './ProverGraph.css';
import GraphView from '../Graph/Graph';

const ProverGraph = (props) => {
    const [randNodes, setRandNodes] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [correct, setCorrect] = useState(true);
    const [hadIncorrectAnswer, setHadIncorrectAnswer] = useState(false);
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0); 
    const [counter, setCounter] = useState(0); 
    const [currentNode, setCurrentNode] = useState(null);
    const [userEdegs, setUserEdges] = useState([]);

    const nav = useNavigate();

    const PIfunc = props['PIfunc'];
    const nodes1 = props['nodes1']

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


    useEffect(() => {
        if (!correct) {
            setHadIncorrectAnswer(true);
        }
    }, [correct]);


    function validateEdges() {
        const node = PIfunc[currentNode];
        
        const inputEdges = userInput.split(',').map(edge => edge.trim());

        const normalizedInputEdges = inputEdges.length === 0
            ? ['0 undefined'] 
            : inputEdges.map(edge => {
                const [from, to] = edge.split(' ').map(Number);
                return `${from} ${to}`;
            });


        axios.post('http://localhost:8000/check_edges', {
            node: node,
            normalizedInputEdges: normalizedInputEdges
        })
        .then((response) => {
            const isCorrect = response.data.message;
            setCorrect(isCorrect); 
    
            setCounter(counter + 1);
            setUserInput("");
    
            handleNextNode(isCorrect);
        })
        .catch((error) => {
            console.log("Error checking edges:", error);
        });

    }

    const handleNextNode = (isCorrect) => {
        if (currentNodeIndex < randNodes.length - 1) {
            setCurrentNodeIndex(currentNodeIndex + 1);
            setCurrentNode(randNodes[currentNodeIndex + 1]);
        } 

        else if (currentNodeIndex === randNodes.length - 1 && isCorrect && !hadIncorrectAnswer) {
            nav('/Success');
        }

        
        setUserEdges([
            ...userEdegs, 
            ...userInput.split(',').map(edge => edge.trim().split(' ').map(Number)) 
        ]);
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
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter edges like 1 2, 1 3..."
            />


            {counter < randNodes.length && <button className='nextNodeBtn' onClick={validateEdges}>Next Node</button>}    

            {hadIncorrectAnswer && counter >= randNodes.length && <p className="error">Some nodes were incorrect. Please try again later.</p>}
            
            <GraphView className='userGraph' {...{ nodes: nodes1, edges: userEdegs, numGraph: 1 }} />
            
        </div>
    );
}

export default ProverGraph;
