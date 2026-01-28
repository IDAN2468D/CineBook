import { useCallback, useState } from 'react';
import api from '../constants/api';

export const useWatchlist = () => {
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inWatchlist, setInWatchlist] = useState(false);

    const fetchWatchlist = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('users/watchlist');
            setWatchlist(res.data);
        } catch (error) {
            console.error('Fetch watchlist error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkInWatchlist = useCallback(async (tmdbId: string) => {
        try {
            const res = await api.get('users/watchlist');
            const found = res.data.some((m: any) => m.id.toString() === tmdbId);
            setInWatchlist(found);
            return found;
        } catch (error) {
            console.log('Error checking watchlist');
            return false;
        }
    }, []);

    const toggleWatchlist = async (tmdbId: string) => {
        const previousState = inWatchlist;
        try {
            // Optimistic update
            setInWatchlist(!previousState);
            await api.post('users/watchlist', { tmdbId: Number(tmdbId) });
        } catch (error) {
            setInWatchlist(previousState); // Revert on error
            console.error('Error toggling watchlist');
        }
    };

    return {
        watchlist,
        loading,
        inWatchlist,
        fetchWatchlist,
        checkInWatchlist,
        toggleWatchlist
    };
};
