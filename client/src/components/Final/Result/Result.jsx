import { React, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import './Result.css';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';



function Result() {
    const [Democrats, setDemocrats] = useState(0);
    const [Republicans, setRepublicans] = useState(0);
    const [YetVoted, setYetVoted] = useState(0);
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    const data = [
        { label: 'Democrats', value: Democrats, color: '#1F51FF' },
        { label: 'Repulicans', value: Republicans, color: '#FF5733' },
        { label: 'Yet Voted', value: YetVoted, color: '#CCC' },
    ];

    const getLabel = (params) => {
        const percent = params.value / (Democrats + Republicans);
        return `${(percent * 100).toFixed(0)}%`;
    };

    useEffect(() => {
        axios.get('http://localhost:8000/get_voters')
        .then((response) => {
            setDemocrats(response.data.democratsVoters);
            setRepublicans(response.data.republicansVoters);
            setYetVoted(response.data.yetVoted);
            setTimeout(() => {
                setLoading(false);
            }, 700);
            
        });
    }, []);

    return (
        loading ? 
        (<div className='loading-bar'>
            <div className='loading-bar-text'>Counting Votes..</div>
            <Box sx={{ width: '100vh', height: '10px', mt: 3}}>
            <LinearProgress color="inherit"/>
            </Box>
        </div>) :
        
        (
            <>
        <div className="container"> 
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
            <h2 className="chart-title">Election Distribution</h2>
            <div className="chart-container">
            <PieChart
            series={[
                {
                outerRadius: '90%',
                arcLabel: getLabel,
                data,
                },
            ]}
            height={400}

            />
            </div>
            
        </div>
        {YetVoted === 0 &&
        <div className="endResults">
        <h1>Final Results</h1>
        <h1>The Winner is {Democrats > Republicans ? 'Democrats' : 'Republicans'}</h1>
        <div className="results">
            {Democrats > Republicans ? (<div className="result dem">
                <h3>Democrats Won!</h3>
                <h4>with {Democrats} votes</h4>
            </div>) :
            (<div className="result rep">
                <h3>Republicans Won!</h3>
                <h4> with {Republicans} votes</h4>
            </div>)}
        </div>
    </div>}
       
    </>
)
    );
    }

    export default Result;
