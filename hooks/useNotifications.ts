import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

let Notifications: any;

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    color: string;
    data?: any;
}

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => Promise<void>;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

// Configure Notification Handler
// Configure Notification Handler check
if (Platform.OS !== 'web') {
    try {
        Notifications = require('expo-notifications');
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    } catch (e) {
        // Expo Go warning suppressed
    }
}

export const useNotifications = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: async (item) => {
                const newNotification: NotificationItem = {
                    id: Date.now().toString(),
                    time: 'Just now', // Logic can be improved
                    read: false,
                    ...item,
                };

                // Trigger System Notification
                try {
                    if (Notifications) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: item.title,
                                body: item.message,
                                data: item.data,
                                sound: true,
                            },
                            trigger: null, // Immediate
                        });
                    }
                } catch (error) {
                    console.warn('Failed to schedule notification:', error);
                }

                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },

            removeNotification: (id) => {
                set((state) => {
                    const filtered = state.notifications.filter((n) => n.id !== id);
                    const count = filtered.filter((n) => !n.read).length;
                    return { notifications: filtered, unreadCount: count };
                });
            },

            markAsRead: (id) => {
                set((state) => {
                    const updated = state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    );
                    const count = updated.filter((n) => !n.read).length;
                    return { notifications: updated, unreadCount: count };
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },
        }),
        {
            name: 'cinebook-notifications',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
