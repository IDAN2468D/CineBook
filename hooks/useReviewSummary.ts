import { useState } from 'react';
import api from '../constants/api';

export function useReviewSummary() {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async (tmdbId: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`ai/summarize-reviews/${tmdbId}`);
            setSummary(response.data.summary);
        } catch (err: any) {
            console.error('Failed to fetch review summary:', err);
            setError('Could not generate summary at this time.');
        } finally {
            setLoading(false);
        }
    };

    return { summary, loading, error, fetchSummary };
}
