import React  from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import GraphView from '../Graph/Graph';


const Home = () => { 
    const nav = useNavigate();

    const test = () => { 
        axios.get('http://localhost:8000/create_graphs', 
       
    )
        .then((response) => {
            console.log(response);
            if (response.data["message"] === "ok"){
                console.log("working")
                nav('/IsoGraph')
            } 
        })
        .catch((error) => {
            console.log(error);
        })
    }
    const nodes1 = [1,2,3,4,5];
    const edges1 = [ [1, 2], [1, 3], [5, 4], [4, 1], [5, 2], [3, 2] ]

    const nodes2 = ['A','B','C','D','E'];
    const edges2 = [ ['A', 'B'], ['A', 'C'], ['E', 'D'], ['D', 'A'], ['E', 'B'], ['C', 'B'] ]

    return (
        <div className='isomorphicGraphs'> 
            <Button variant="outlined" onClick={test}>Isomorphic Graph</Button>
            <GraphView {...{nodes1,edges1,numGraph:1}}/>
            <GraphView {...{nodes2,edges2,numGraph:2}}/>
        </div>
    )
}

export default Home


