import { useCallback, useState } from 'react';
import api from '../constants/api';

export const useMovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [showtimes, setShowtimes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMovieDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const [detailsRes, showsRes] = await Promise.all([
                api.get(`movie/${id}`),
                api.get(`showtimes/${id}`)
            ]);
            setMovieDetails(detailsRes.data);
            setShowtimes(showsRes.data);
        } catch (err: any) {
            console.error('Fetch movie details error:', err);
            setError(err.message || 'Failed to fetch movie details');
        } finally {
            setLoading(false);
        }
    }, []);

    return { movieDetails, showtimes, loading, error, fetchMovieDetails };
};
