// src/hooks/usePoints.js
import { useState, useEffect } from 'react';
// import { pointsService } from '../services/pointsService'; // Import from your api.js
// OR if you created separate file:
import pointsService from '../services/pointsService';

export const usePoints = () => {
    const [pointsData, setPointsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pointsService.getUserPointsSummary();
            setPointsData(data);
        } catch (err) {
            console.error('Error in usePoints hook:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const refetch = () => {
        fetchPoints();
    };

    return {
        pointsData,
        loading,
        error,
        refetch
    };
};