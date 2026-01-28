import { useState } from 'react';
import api from '../constants/api';

export const useAiSearch = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchWithAi = async (query: string) => {
        setLoading(true);
        setError(null);
        setResults([]);
        try {
            const res = await api.post('ai-search', { query });
            setResults(res.data);
        } catch (err: any) {
            console.error('AI Search client error:', err);
            setError(err.response?.data?.message || err.message || 'AI Search failed');
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, error, searchWithAi };
};
