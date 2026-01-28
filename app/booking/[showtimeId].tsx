import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SnackModal from '../../components/SnackModal';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useBooking } from '../../hooks/useBooking';
import { useCrowdPrediction } from '../../hooks/useCrowdPrediction';
import { useNotifications } from '../../hooks/useNotifications';

export default function BookingScreen() {
    const { showtimeId } = useLocalSearchParams();
    const router = useRouter(); // Added router
    const {
        showtime,
        loading,
        booking,
        lockedSeats, // Get real-time locked seats
        fetchShowtime,
        bookSeats,
        attemptLockSeat,
        attemptUnlockSeat
    } = useBooking(showtimeId as string); // Pass ID directly to hook

    const { addNotification } = useNotifications();
    const { prediction, checkCrowd } = useCrowdPrediction();
    const { updatePoints, user } = useAuthStore(); // Added user to get current points

    const [snackModalVisible, setSnackModalVisible] = useState(false);
    const [selectedSnacks, setSelectedSnacks] = useState<any[]>([]);

    useEffect(() => {
        if (showtimeId) {
            fetchShowtime(showtimeId as string);
        }
    }, [showtimeId]);

    useEffect(() => {
        if (showtime?.tmdbId) {
            checkCrowd(showtime.tmdbId);
        }
    }, [showtime]);

    // We don't need local selectedSeats state anymore as strictly as before, 
    // but useful to know what THIS user selected vs others. 
    // Actually, useBooking separates it? No, useBooking manages socket. 
    // Let's keep local state for "my selection" to calculate price, 
    // but the locking logic happens via socket.
    const [mySelectedSeats, setMySelectedSeats] = useState<string[]>([]);

    const toggleSeat = (label: string) => {
        if (mySelectedSeats.includes(label)) {
            // Unlock
            attemptUnlockSeat(label);
            setMySelectedSeats(prev => prev.filter(s => s !== label));
        } else {
            // Lock
            attemptLockSeat(label);
            // We assume success for UI responsiveness, or listen to 'lock_success' 
            // For now, let's optimistic update. 
            // Ideally wait for socket confirmation, but this is faster.
            setMySelectedSeats(prev => [...prev, label]);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Hey! I'm watching ${showtime?.movie?.title} at ${showtime?.hall?.name}. Join me! cinebook://booking/${showtimeId}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onBookPress = () => {
        setSnackModalVisible(true);
    };

    // Handle unselecting if server says lock failed (though we handle that via alert in hook)

    const handleFinalBooking = async (snacks: any[]) => {
        setSelectedSnacks(snacks);
        if (typeof showtimeId === 'string') {
            try {
                // Calculate Snack Price
                const snackPrice = snacks.reduce((acc, s) => acc + s.price, 0);

                // Book Seats
                await bookSeats(showtimeId, mySelectedSeats);

                // Trigger Notification
                await addNotification({
                    title: 'Booking Confirmed! 🎟️',
                    message: `You have successfully booked ${mySelectedSeats.length} seats ${snacks.length > 0 ? `and ${snacks.length} snacks` : ''}. Enjoy the show!`,
                    icon: 'ticket-outline',
                    color: '#3b82f6'
                });

                // Award points (10 pts per dollar)
                const totalSpent = totalPrice + snackPrice;
                const pointsEarned = Math.floor(totalSpent * 10);
                if (pointsEarned > 0) {
                    await updatePoints(pointsEarned);
                }

                router.back();
            } catch (e) {
                // Error handled in hook usually
            }
        }
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-slate-900"><ActivityIndicator size="large" color="#3b82f6" /></View>;
    if (!showtime) return <View className="flex-1 justify-center items-center bg-slate-900"><Text className="text-red-500">Showtime not found</Text></View>;

    const totalPrice = mySelectedSeats.reduce((acc, label) => {
        const seat = showtime.seats.find((s: any) => s.label === label);
        return acc + (seat?.price || 0);
    }, 0);

    // Group seats by row for rendering
    const rows: any = {};
    showtime.seats.forEach((seat: any) => {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
    });

    const potentialPoints = Math.floor(totalPrice * 10);

    return (
        <View className="flex-1 bg-[#050B26]">
            {/* Header with Points & Invite */}
            <SafeAreaView edges={['top']} className="px-5 py-2 flex-row justify-between items-center bg-slate-900/50">
                <View>
                    <Text className="text-slate-400 text-xs font-bold uppercase">CineClub</Text>
                    <Text className="text-amber-400 font-black text-sm">{user?.points || 0} PTS</Text>
                </View>
                <TouchableOpacity onPress={handleShare} className="flex-row items-center bg-blue-600/20 px-3 py-1.5 rounded-full border border-blue-500/50">
                    <Ionicons name="share-social" size={16} color="#60a5fa" />
                    <Text className="text-blue-400 font-bold text-xs ml-1">Invite Friends</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100, alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                {/* Crowd/Heatmap Banner */}
                {prediction && (
                    <View className="w-full mb-6 bg-slate-900 border border-slate-800 p-3 rounded-xl flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="fire" size={20} color={prediction.crowdPercentage > 70 ? '#ef4444' : '#fbbf24'} />
                            <View className="ml-3">
                                <Text className="text-white font-bold text-sm">Seat Heatmap: {prediction.level}</Text>
                                <Text className="text-slate-500 text-[10px] w-48" numberOfLines={1}>{prediction.reason}</Text>
                            </View>
                        </View>
                        <View className="bg-slate-800 px-2 py-1 rounded-lg">
                            <Text className="text-white font-bold text-xs">{prediction.crowdPercentage}% Full</Text>
                        </View>
                    </View>
                )}

                {/* Screen Indicator */}
                <View className="w-full h-12 justify-center items-center mb-10 overflow-hidden">
                    <View className="w-[80%] h-[60px] border-t-4 border-blue-500/50 rounded-[50%] shadow-lg shadow-blue-500" style={{ transform: [{ scaleX: 1.5 }, { translateY: 25 }] }} />
                    <Text className="text-blue-500/50 text-[10px] tracking-[4px] mt-2 font-bold absolute top-1">SCREEN</Text>
                </View>

                {/* Seats Grid */}
                <View className="mt-2">
                    {Object.keys(rows).map((rowIdx) => (
                        <View key={rowIdx} className="flex-row justify-center mb-3">
                            {rows[rowIdx].map((seat: any) => {
                                const isMySelection = mySelectedSeats.includes(seat.label);
                                const isBooked = seat.status === 'booked';
                                const isLockedByOthers = lockedSeats.includes(seat.label) && !isMySelection;
                                const isVIP = seat.type === 2;

                                let seatColor = "bg-slate-800 border border-slate-700";
                                if (isVIP) seatColor = "bg-amber-600/20 border border-amber-600";
                                if (isBooked) seatColor = "bg-slate-800/50 border border-slate-800 opacity-30";
                                if (isLockedByOthers) seatColor = "bg-slate-700 border border-yellow-500/50 opacity-80"; // Visual indication for locked
                                if (isMySelection) seatColor = "bg-blue-600 border border-blue-500 shadow-md shadow-blue-500/50";

                                return (
                                    <TouchableOpacity
                                        key={seat.label}
                                        className={`w-9 h-9 rounded-xl mx-1 justify-center items-center ${seatColor}`}
                                        disabled={isBooked || isLockedByOthers}
                                        onPress={() => toggleSeat(seat.label)}
                                    >
                                        <Text className={`text-[10px] font-bold ${isMySelection || isVIP ? 'text-white' : 'text-slate-500'}`}>
                                            {seat.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Legend */}
                <View className="flex-row flex-wrap justify-center mt-12 px-4 py-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <LegendItem color="#334155" label="Available" />
                    <LegendItem color="#3b82f6" label="Selected" />
                    <LegendItem color="#ef4444" label="Booked" />
                    <LegendItem color="#ca8a04" label="VIP" />
                </View>
            </ScrollView>

            {/* Bottom Sheet for Total Price & Booking */}
            <SafeAreaView edges={['bottom']} className="bg-slate-900 border-t border-slate-800 shadow-2xl">
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <View className="flex-col">
                        <View className="flex-row items-end">
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mr-2">Total</Text>
                            {potentialPoints > 0 && <Text className="text-amber-400 text-[10px] font-bold mb-1">+{potentialPoints} PTS</Text>}
                        </View>
                        <Text className="text-white text-3xl font-black tracking-tight">${totalPrice}</Text>
                    </View>
                    <TouchableOpacity
                        className={`px-8 py-4 rounded-2xl ${booking || mySelectedSeats.length === 0 ? 'bg-slate-800' : 'bg-blue-600 shadow-lg shadow-blue-600/30'}`}
                        onPress={onBookPress}
                        disabled={booking || mySelectedSeats.length === 0}
                    >
                        {booking ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className={`text-lg font-bold ${booking || mySelectedSeats.length === 0 ? 'text-slate-500' : 'text-white'}`}>Book Now</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <SnackModal
                visible={snackModalVisible}
                onClose={() => setSnackModalVisible(false)}
                onConfirm={handleFinalBooking}
            />
        </View>
    );
}

const LegendItem = ({ color, label }: any) => (
    <View className="flex-row items-center mx-3 my-1">
        <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
        <Text className="text-slate-400 text-xs font-medium">{label}</Text>
    </View>
);
