import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import api from '../constants/api';
import { useAuthStore } from './useAuthStore';

export const useTickets = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [moviesData, setMoviesData] = useState<any>({});
    const { token } = useAuthStore();

    const fetchTickets = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch Movies
            const moviesRes = await api.get('movies');
            const moviesMap = moviesRes.data.reduce((acc: any, movie: any) => {
                acc[movie.id] = movie;
                return acc;
            }, {});
            setMoviesData(moviesMap);

            // 2. Fetch Tickets (Backend now includes bookingIds!)
            const res = await api.get('ticket-history');
            setTickets(res.data);

        } catch (error) {
            console.error('Fetch tickets error:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const cancelTicket = async (ticketIds: string | string[]) => {
        try {
            const idsToDelete = Array.isArray(ticketIds) ? ticketIds : [ticketIds];

            // Delete all associated bookings using the ID (which is the seat._id)
            await Promise.all(idsToDelete.map(id => api.delete(`bookings/${id}`)));

            // Refresh list
            fetchTickets();
            return true;
        } catch (error: any) {
            console.error('Cancel ticket error:', error);
            Alert.alert('Error', 'Failed to delete ticket');
            return false;
        }
    };

    return { tickets, loading, moviesData, fetchTickets, cancelTicket };
};
