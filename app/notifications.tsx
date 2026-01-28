import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BellOff, CheckCheck, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem, useNotifications } from '../hooks/useNotifications';

// Define icon mapping if needed, or fallback to generic
const getIcon = (iconName: string, color: string) => {
    // You can map specific lucide icons here if you update the hook to emit 'ticket', 'video' etc.
    // For now returning Bell as generic
    return <Bell size={20} color={color} />;
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, removeNotification, markAllAsRead, clearAll } = useNotifications();

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Notification",
            "Remove this notification?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => removeNotification(id) }
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "Clear All",
            "Are you sure you want to delete all notifications?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearAll }
            ]
        );
    };

    const renderItem = ({ item, index }: { item: NotificationItem; index: number }) => (
        <View
            className="mb-4 mx-5"
        >
            <View className={`p-4 rounded-3xl border flex-row items-center overflow-hidden
                ${item.read ? 'bg-[#0f172a] border-slate-800' : 'bg-[#1e293b] border-indigo-500/30'}`} // Conditional styling
            >
                {/* Glowing dot for unread */}
                {!item.read && (
                    <View className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500" />
                )}

                {/* Leading Icon Box */}
                <View
                    className={`h-12 w-12 rounded-2xl items-center justify-center mr-4 shadow-lg`}
                    style={{ backgroundColor: `${item.color}15` }}
                >
                    {getIcon(item.icon || 'bell', item.color)}
                </View>

                {/* Content */}
                <View className="flex-1 pr-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className={`text-sm font-bold uppercase tracking-wider ${item.read ? 'text-slate-500' : 'text-indigo-400'}`}>
                            {item.title}
                        </Text>
                        <Text className="text-[10px] text-slate-500 font-medium">{item.time}</Text>
                    </View>
                    <Text className={`text-base font-medium leading-5 ${item.read ? 'text-slate-500' : 'text-slate-200'}`} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>

                {/* Action (Delete) */}
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    className="h-8 w-8 items-center justify-center bg-slate-800/50 rounded-full"
                >
                    <Trash2 size={14} color="#64748b" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#020617]" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between mb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-slate-800/80 rounded-full items-center justify-center border border-slate-700 active:bg-slate-700"
                >
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <Text className="text-xl font-black text-white tracking-tight">Activity</Text>

                {notifications.length > 0 ? (
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity
                            onPress={markAllAsRead}
                            className="w-10 h-10 items-center justify-center bg-slate-800/50 rounded-full"
                        >
                            <CheckCheck size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleClearAll}
                            className="w-10 h-10 items-center justify-center bg-red-500/10 rounded-full"
                        >
                            <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                ) : <View className="w-20" />}
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-32 opacity-50">
                        <View className="w-20 h-20 bg-slate-800 rounded-full items-center justify-center mb-4">
                            <BellOff size={32} color="#64748b" />
                        </View>
                        <Text className="text-slate-400 font-bold text-lg mb-1">All Caught Up</Text>
                        <Text className="text-slate-600 text-sm">No new notifications for now.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
