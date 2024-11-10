import React from 'react';
import Graph from 'react-vis-network-graph';
import './Graph.css';

export default function GraphView({ nodes = [], edges = [] }) { 
    // Format nodes and edges
    const formattedNodes = nodes.map(id => ({
        id: String(id), 
        label: `Node ${id}`
    }));

    const formattedEdges = edges.map(([from, to]) => ({
        from: String(from),
        to: String(to)
    }));

    const graph = {
        nodes: formattedNodes,
        edges: formattedEdges
    };

    const options = {
        nodes: { 
            borderWidth: 0, 
            size: 35, 
            color:{ 
                background: "#888"
            },
            shape: "circle",
        },
        shadow: true,
        smooth: true,
    };

   

    return ( 
        <div className='graph'>
            <Graph
                graph={graph} 
                options={options}
            />
        </div>
    );
}
