import React, { useEffect, useState } from "react"; 
import Navbar from './Navbar';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const About = () => {
    const [graphData, setGraphData] = useState(null);
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

    useEffect(() => {
        // fetch("http://192.168.1.250:8080/CMDA-3.3.9/stocks/candle-spread") // Backend URL
        fetch(`${API_BASE}/stocks/candle-spread`) // Backend URL

            .then(response => response.json())
            .then(data => {
                // Log the data to ensure it's being fetched correctly
                console.log(data); 
                setGraphData(data); 
            })
            .catch(error => console.error("Error fetching graph data:", error));
    }, []);

    if (!graphData) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <h1>About</h1>
            <h2>Monthly Sales Data</h2>
            <Bar data={graphData} />  {/* Check if graphData is passed correctly */}
        </div>
    );
};

export default About;
