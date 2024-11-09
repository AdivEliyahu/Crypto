import React from 'react' 
import Graph from 'react-vis-network-graph'


export default function GraphView(props){ 
    let nodes = [];
    let edges = []; 
    if(props['numGraph'] === 1){ 
        nodes = props["nodes1"];
        edges = props["edges1"];
    }
    else if(props['numGraph'] === 2) { 
        nodes = props["nodes2"];
        edges = props["edges2"];
    }

    console.log(props['numGraph']);


    const formattedNodes = nodes && nodes.map(id => ({
        id: String(id), 
        label: `Node ${id}`
    }));

    const formattedEdges = edges && edges.map(([from, to]) => ({
        from: String(from),
        to: String(to)
    }));

    const graph = {
        nodes: formattedNodes,
        edges: formattedEdges
    }

    const options = {
        height: "30vh",
    }
    
    return ( 
        <div className='graph'>
            <Graph
                graph={graph} 
                options={options}
            />
        </div>
    )
}
