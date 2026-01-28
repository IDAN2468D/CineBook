import { useFocusEffect } from 'expo-router';
import { Calendar, Clock, MapPin, QrCode, Share2, Ticket, Trash2 } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTickets } from '../../hooks/useTickets';

// Fallback to standard views
// Fallback to standard views


export default function TicketsScreen() {
    const { tickets, loading, moviesData, fetchTickets, cancelTicket } = useTickets();
    const { token } = useAuthStore();

    useFocusEffect(
        useCallback(() => {
            if (token) {
                fetchTickets();
            }
        }, [token, fetchTickets])
    );

    const handleDelete = (ticketId: string | string[]) => {
        Alert.alert(
            "Cancel Ticket",
            "Are you sure you want to cancel this ticket? This action cannot be undone.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        const success = await cancelTicket(ticketId); // ticketId acts as ids array
                        if (success) {
                            Alert.alert("Success", "Ticket cancelled successfully");
                        } else {
                            Alert.alert("Error", "Failed to cancel ticket");
                        }
                    }
                }
            ]
        );
    };

    const handleShare = (movie: any, item: any) => {
        const message = `🎟️ Watching ${movie?.title || 'a movie'}!\n📅 ${new Date(item.startTime).toLocaleDateString()} at ${new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n📍 ${item.hallName}\n💺 Seats: ${item.seats.join(', ')}\n\nBook with CineBook app! 🎬`;
        Share.share({
            message: message,
            title: `Ticket: ${movie?.title}`
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#020617]">
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#020617]" edges={['top']}>
            {/* Floating Header */}
            <View className="mx-4 mt-2 mb-6 flex-row justify-between items-end bg-slate-800/80 p-4 rounded-[24px] border border-slate-700/50 shadow-lg shadow-black/20">
                <View>
                    <Text className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">Your Collection</Text>
                    <Text className="text-2xl font-black text-white tracking-tight">My Tickets</Text>
                </View>
                <View className="bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
                    <Text className="text-indigo-300 font-bold text-sm">{tickets.length} Active</Text>
                </View>
            </View>


            {tickets.length === 0 ? (
                <View className="flex-1 justify-center items-center px-10">
                    <View className="bg-slate-800/50 p-6 rounded-full mb-6">
                        <Ticket size={64} color="#475569" />
                    </View>
                    <Text className="text-white text-2xl font-bold mb-3 text-center">No Tickets Found</Text>
                    <Text className="text-slate-400 text-center leading-6">
                        You haven't booked any movies yet.{'\n'}Explore the latest releases and book your seat!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    keyExtractor={(item) => item.showtimeId}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        const movie = moviesData[item.tmdbId];
                        return (
                            <View
                                className="mb-8"
                            >
                                {/* Ticket Main Body */}
                                <View className="bg-[#1e293b] rounded-t-3xl overflow-hidden border-x border-t border-slate-700/50">
                                    {/* Image & Overlay */}
                                    <View className="relative h-48 w-full">
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path || movie?.poster_path}` }}
                                            className="w-full h-full opacity-80"
                                            resizeMode="cover"
                                        />
                                        <View className="absolute inset-0 bg-black/40" />
                                        <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1e293b] to-transparent pt-16">
                                            <Text className="text-white text-2xl font-black shadow-sm" numberOfLines={1}>
                                                {movie?.title}
                                            </Text>
                                            <View className="flex-row items-center mt-2 space-x-4">
                                                <View className="flex-row items-center bg-black/30 px-2 py-1 rounded-lg">
                                                    <Calendar size={14} color="#cbd5e1" />
                                                    <Text className="text-indigo-200 text-xs font-bold ml-1.5">
                                                        {new Date(item.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center bg-black/30 px-2 py-1 rounded-lg">
                                                    <Clock size={14} color="#cbd5e1" />
                                                    <Text className="text-indigo-200 text-xs font-bold ml-1.5">
                                                        {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Info Section */}
                                    <View className="p-5">
                                        <View className="flex-row items-start justify-between">
                                            <View className="flex-1 mr-4">
                                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">CINEMA</Text>
                                                <View className="flex-row items-center mb-4">
                                                    <MapPin size={16} color="#94a3b8" />
                                                    <Text className="text-slate-200 text-sm font-semibold ml-1.5">{item.hallName}</Text>
                                                </View>

                                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">SEATS</Text>
                                                <Text className="text-indigo-400 text-lg font-black tracking-wide">
                                                    {item.seats.join(', ')}
                                                </Text>
                                            </View>

                                            {/* Poster Thumb */}
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w200${movie?.poster_path}` }}
                                                className="w-16 h-24 rounded-lg bg-slate-700"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Perforation */}
                                <View className="h-6 flex-row items-center justify-between -my-[1px] z-10 overflow-hidden">
                                    {/* Left Cutout - using a View that matches bg color */}
                                    <View className="w-6 h-6 rounded-full bg-[#020617] -ml-3 z-20" />
                                    {/* Use a dotted line connecting them */}
                                    <View className="flex-1 h-[2px] border-t-2 border-dashed border-slate-700/60 mx-2" />
                                    {/* Right Cutout */}
                                    <View className="w-6 h-6 rounded-full bg-[#020617] -mr-3 z-20" />

                                    {/* Hack to fill the gap behind cutouts to match card color if we wanted, but here we want cutouts to see background */}
                                    {/* Actually, to simulate the card continuing, we need the background of the perforation strip to be the CARD color, and the circles to be the PAGE BG color. */}
                                    <View className="absolute inset-0 bg-[#1e293b] -z-10 border-x border-slate-700/50" />
                                </View>

                                {/* Ticket Footer / Stub */}
                                <View className="bg-[#1e293b] rounded-b-3xl p-5 border-x border-b border-slate-700/50 flex-row items-center justify-between">
                                    <View className="items-center justify-center bg-white p-2 rounded-xl">
                                        <QrCode size={48} color="#000" />
                                    </View>

                                    <View className="flex-1 px-4 items-center">
                                        <Text className="text-slate-500 text-[10px] uppercase text-center mb-1">Scan at entrance</Text>
                                        <Text className="text-slate-300 text-xs font-bold text-center">Order ID: #{item.showtimeId.substring(0, 8)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleShare(movie, item)}
                                        className="h-10 w-10 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-500/30 mr-3"
                                    >
                                        <Share2 size={18} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.bookingIds || item._id || item.id)}
                                        className="h-10 w-10 bg-red-500/20 border border-red-500/50 rounded-full items-center justify-center"
                                    >
                                        <Trash2 size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}
