import { useMemo, useRef, useState } from 'react';
import api from '../constants/api';

const GENRE_MAP: { [key: string]: number } = {
    'Action': 28,
    'Comedy': 35,
    'Sci-Fi': 878,
    'Horror': 27,
    'Drama': 18,
    'Romance': 10740,
};

export const useMovies = () => {
    const [allMovies, setAllMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeGenre, setActiveGenre] = useState('All');

    // Cache to store results for each tab type
    const cache = useRef<{ [key: string]: any[] }>({});

    const movies = useMemo(() => {
        if (activeGenre === 'All') return allMovies;
        const genreId = GENRE_MAP[activeGenre];
        if (!genreId) return allMovies; // Fallback if genre not found
        return allMovies.filter(movie => movie.genre_ids && Array.isArray(movie.genre_ids) && movie.genre_ids.includes(genreId));
    }, [allMovies, activeGenre]);

    const fetchMovies = async (type: 'now_playing' | 'upcoming' | 'top-rated' | 'popular') => {
        // If cached data exists for this type, use it immediately
        if (cache.current[type]) {
            setAllMovies(cache.current[type]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let endpoint = 'movies';
            if (type === 'upcoming') endpoint = 'movies/upcoming';
            else if (type === 'top-rated') endpoint = 'movies/top-rated';
            else if (type === 'popular') endpoint = 'movies/popular';

            console.log(`[useMovies] Fetching ${type} from API...`); // Debug log
            const res = await api.get(endpoint);

            // Update Cache
            cache.current[type] = res.data;
            setAllMovies(res.data);
        } catch (err: any) {
            console.error('Fetch movies error:', err);
            setError(err.message || 'Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    };

    const searchMovies = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            // Search requests are dynamic, usually not cached unless we want complex caching
            const res = await api.get(`search/${query}`);
            setAllMovies(res.data);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to search movies');
        } finally {
            setLoading(false);
        }
    };

    return { movies, loading, error, activeGenre, setActiveGenre, fetchMovies, searchMovies };
};

