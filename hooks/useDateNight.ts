import { useState } from 'react';
import api from '../constants/api';

export interface DatePlan {
    dinner: string;
    activity: string;
    conversation: string;
}

export function useDateNight() {
    const [plan, setPlan] = useState<DatePlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePlan = async (movieTitle: string, genre: string, vibe: string = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('ai/date-night', { movieTitle, genre, vibe });
            setPlan(response.data);
        } catch (err: any) {
            console.error('Date Night Error:', err);
            setError('Could not generate a date plan.');
        } finally {
            setLoading(false);
        }
    };

    const clearPlan = () => setPlan(null);

    return { plan, loading, error, generatePlan, clearPlan };
}
