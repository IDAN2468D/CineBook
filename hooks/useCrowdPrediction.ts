import { useCallback, useState } from 'react';
import api from '../constants/api';

export const useCrowdPrediction = () => {
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkCrowd = useCallback(async (tmdbId: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`ai/predict-crowd/${tmdbId}`);
            setPrediction(res.data);
        } catch (err: any) {
            console.error('Crowd Prediction Error:', err);
            setError(err.message || 'Failed to predict crowd');
        } finally {
            setLoading(false);
        }
    }, []);

    return { prediction, loading, error, checkCrowd };
};
