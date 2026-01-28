import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import io, { Socket } from 'socket.io-client';
import api, { getBaseUrl } from '../constants/api';
import { useAuthStore } from './useAuthStore';

export const useBooking = (showtimeId?: string) => {
    const [showtime, setShowtime] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lockedSeats, setLockedSeats] = useState<string[]>([]);

    // Socket ref
    const socket = useRef<Socket | null>(null);
    const { user } = useAuthStore();
    const router = useRouter();

    // 1. Fetch Showtime Data
    const fetchShowtime = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`showtime/${id}`);
            setShowtime(res.data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch showtime');
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Initialize Socket when showtimeId is present
    useEffect(() => {
        if (!showtimeId) return;

        // Strip '/api/' from the base URL to get the root URL for socket.io
        const socketUrl = getBaseUrl().replace('/api/', '');

        console.log('[Socket] Connecting to:', socketUrl);
        socket.current = io(socketUrl, {
            transports: ['websocket'],
            forceNew: true
        });

        // Event Listeners
        socket.current.on('connect', () => {
            console.log('[Socket] Connected!', socket.current?.id);
            socket.current?.emit('join_showtime', showtimeId);
        });

        socket.current.on('initial_locks', (locks: string[]) => {
            console.log('[Socket] Initial locks:', locks);
            setLockedSeats(locks);
        });

        socket.current.on('seat_locked', ({ seatLabel }: { seatLabel: string }) => {
            console.log('[Socket] Seat locked by other:', seatLabel);
            setLockedSeats(prev => [...prev, seatLabel]);
        });

        socket.current.on('seat_released', ({ seatLabel }: { seatLabel: string }) => {
            console.log('[Socket] Seat released:', seatLabel);
            setLockedSeats(prev => prev.filter(s => s !== seatLabel));
        });

        socket.current.on('lock_failed', ({ message }: { message: string }) => {
            Alert.alert('Unavailable', message);
        });

        // Cleanup
        return () => {
            console.log('[Socket] Disconnecting...');
            socket.current?.emit('leave_showtime', showtimeId);
            socket.current?.disconnect();
        };
    }, [showtimeId]);


    // 3. Real-time Seat Actions
    const attemptLockSeat = (seatLabel: string) => {
        if (!socket.current || !user || !showtimeId) return;
        socket.current.emit('request_lock', {
            showtimeId,
            seatLabel,
            userId: user.id
        });
    };

    const attemptUnlockSeat = (seatLabel: string) => {
        if (!socket.current || !showtimeId) return;
        socket.current.emit('release_lock', {
            showtimeId,
            seatLabel
        });
    };

    const bookSeats = async (id: string, selectedSeats: string[]) => {
        if (selectedSeats.length === 0) {
            Alert.alert('Error', 'Select at least one seat');
            return;
        }

        setBooking(true);
        try {
            for (const seatLabel of selectedSeats) {
                await api.post('bookings', { showtimeId: id, seatLabel });
            }
            Alert.alert('Success', 'Booking confirmed!', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
            ]);
            return true;
        } catch (err: any) {
            Alert.alert('Booking Error', err.response?.data?.message || 'Failed to book');
            return false;
        } finally {
            setBooking(false);
        }
    };

    return {
        showtime,
        loading,
        booking,
        error,
        lockedSeats, // Expose locked seats
        fetchShowtime,
        bookSeats,
        attemptLockSeat,
        attemptUnlockSeat
    };
};
