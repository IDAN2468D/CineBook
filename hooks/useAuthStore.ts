import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: any | null;
    initialized: boolean;
    setAuth: (token: string, user: any) => Promise<void>;
    logout: () => Promise<void>;
    init: () => Promise<void>;
    updatePoints: (delta: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
    token: null,
    user: null,
    initialized: false,
    setAuth: async (token: string, user: any) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        set({ token, user, initialized: true });
    },
    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({ token: null, user: null, initialized: true });
    },
    init: async () => {
        const token = await AsyncStorage.getItem('token');
        const userStr = await AsyncStorage.getItem('user');
        if (token && userStr) {
            set({ token, user: JSON.parse(userStr), initialized: true });
        } else {
            set({ initialized: true });
        }
    },
    updatePoints: async (delta: number) => {
        const { user } = get();
        if (user) {
            const currentPoints = user.points || 0;
            const newPoints = currentPoints + delta;
            const updatedUser = { ...user, points: newPoints };

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        }
    }
}));
