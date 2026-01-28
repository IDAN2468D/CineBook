import { useState } from 'react';
import api from '../constants/api';

export const usePeople = () => {
    const [people, setPeople] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPopularPeople = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('people/popular');
            setPeople(res.data);
        } catch (err: any) {
            console.error('Fetch people error:', err);
            setError(err.message || 'Failed to fetch popular people');
        } finally {
            setLoading(false);
        }
    };

    const fetchPersonDetails = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`person/${id}`);
            return res.data;
        } catch (err: any) {
            console.error('Fetch person details error:', err);
            setError(err.message || 'Failed to fetch person details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { people, loading, error, fetchPopularPeople, fetchPersonDetails };
};
