import { useState } from 'react';
import api from '../constants/api';

export const useTvShows = () => {
    const [tvShows, setTvShows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTvShows = async (type: 'popular' | 'top-rated' | 'on-the-air') => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = `tv/${type}`;
            const res = await api.get(endpoint);
            setTvShows(res.data);
        } catch (err: any) {
            console.error('Fetch TV shows error:', err);
            setError(err.message || 'Failed to fetch TV shows');
        } finally {
            setLoading(false);
        }
    };

    const fetchTvShowDetails = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`tv/${id}`);
            return res.data;
        } catch (err: any) {
            console.error('Fetch TV details error:', err);
            setError(err.message || 'Failed to fetch TV show details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { tvShows, loading, error, fetchTvShows, fetchTvShowDetails };
};
