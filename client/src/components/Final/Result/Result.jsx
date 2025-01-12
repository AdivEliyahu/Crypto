import { React, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import './Result.css';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';




function Result() {
    const [Democrats, setDemocrats] = useState(0);
    const [Republicans, setRepublicans] = useState(0);
    const [YetVoted, setYetVoted] = useState(0);

    const nav = useNavigate();

    const data = [
        { label: 'Democrats', value: Democrats, color: '#1976d2' },
        { label: 'Repulicans', value: Republicans, color: '#dc004e' },
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
        });
    }, []);

    return (
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
                outerRadius: 250,
                arcLabel: getLabel,
                data,
                },
            ]}
            height={500}

            />
            </div>
        </div>
    );
    }

    export default Result;
