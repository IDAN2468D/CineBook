import { Award, CheckCircle2, ChevronRight, Crown, Gift, QrCode, Sparkles, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../hooks/useAuthStore';

const { width } = Dimensions.get('window');

// Mock Data
const CATEGORIES = ['All', 'Food', 'Tickets', 'Merch'];

const REWARDS = [
    { id: 1, title: 'Large Popcorn', cost: 500, category: 'Food', image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 2, title: 'Soft Drink', cost: 300, category: 'Food', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 3, title: 'IMAX Ticket', cost: 1200, category: 'Tickets', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 4, title: 'Nachos Combo', cost: 800, category: 'Food', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 5, title: 'CineBook Cap', cost: 1500, category: 'Merch', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
];

const CHALLENGES = [
    { id: 1, title: 'Weekend Warrior', desc: 'Watch a movie this weekend', reward: '+100 pts', progress: 0.5, icon: Zap, color: '#f59e0b' },
    { id: 2, title: 'Horror Fan', desc: 'Watch 2 Horror movies', reward: '+250 pts', progress: 0.2, icon: Award, color: '#ef4444' },
    { id: 3, title: 'Reviewer', desc: 'Rate 3 movies', reward: '+50 pts', progress: 1, icon: CheckCircle2, color: '#22c55e' },
];

const HISTORY = [
    { id: 1, type: 'EARNED', title: 'Ticket Purchase - Avatar 3', points: '+120', date: 'Today, 14:30' },
    { id: 2, type: 'SPENT', title: 'Large Popcorn', points: '-500', date: 'Yesterday' },
    { id: 3, type: 'EARNED', title: 'Daily Login Bonus', points: '+10', date: '23 Jan 2026' },
    { id: 4, type: 'EARNED', title: 'Referral Bonus', points: '+200', date: '20 Jan 2026' },
];

export default function PointsScreen() {
    const { user } = useAuthStore();
    const [activeCategory, setActiveCategory] = useState('All');

    // Assuming user object might have points, otherwise fallback
    const points = user?.points || 1250;
    const tier = 'Gold Member';
    const nextTier = 2000;
    const progress = (points / nextTier) * 100;

    const filteredRewards = activeCategory === 'All'
        ? REWARDS
        : REWARDS.filter(r => r.category === activeCategory);

    const { updatePoints } = useAuthStore();

    const handleClaimDaily = async () => {
        await updatePoints(10);
        Alert.alert('Success', 'You claimed +10 points (Streak: 4 days!)');
    };

    const handleRedeem = async (item: any) => {
        if (points >= item.cost) {
            Alert.alert(
                'Confirm Redemption',
                `Redeem ${item.title} for ${item.cost} points?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Redeem',
                        onPress: async () => {
                            await updatePoints(-item.cost);
                            Alert.alert('Redeemed!', `Here is your code: ${Math.random().toString(36).substring(7).toUpperCase()}`);
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Insufficient Points', `You need ${item.cost - points} more points to redeem this.`);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#020617]" edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Floating Header */}
                <View className="mx-4 mt-2 mb-6 flex-row justify-between items-center bg-slate-800/80 p-4 rounded-[24px] border border-slate-700/50 shadow-lg shadow-black/20">
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">Loyalty Program</Text>
                        <Text className="text-2xl font-black text-white tracking-tight">Rewards</Text>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-700/80 rounded-full items-center justify-center border border-slate-600 shadow-sm"
                        onPress={() => Alert.alert('Member ID', 'Scan this code at the counter')}
                    >
                        <QrCode size={18} color="#fff" />
                    </TouchableOpacity>
                </View>


                {/* Main Card */}
                <View
                    className="mx-6 mb-6"
                >
                    <View className="bg-indigo-600 rounded-[32px] p-6 relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                        {/* Decorative background shapes */}
                        <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <View className="absolute bottom-0 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl" />

                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-row items-center bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                                <Crown size={14} color="#fbbf24" fill="#fbbf24" />
                                <Text className="text-amber-300 font-bold text-xs ml-2 uppercase tracking-wide">{tier}</Text>
                            </View>
                            <Sparkles size={24} color="#fff" opacity={0.6} />
                        </View>

                        <View className="mb-2">
                            <Text className="text-indigo-200 text-sm font-medium mb-1">Available Balance</Text>
                            <Text className="text-5xl font-black text-white">{points}</Text>
                        </View>

                        {/* Progress Bar */}
                        <View className="mt-4">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-indigo-200 text-xs">{points}/{nextTier} points</Text>
                                <Text className="text-white text-xs font-bold">Next: Platinum</Text>
                            </View>
                            <View className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <View className="h-full bg-amber-400 rounded-full" style={{ width: `${progress}%` }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Daily Check-in */}
                <View
                    className="mx-6 mb-8 flex-row items-center justify-between bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50"
                >
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-amber-500/10 rounded-full items-center justify-center mr-3">
                            <Gift size={20} color="#fbbf24" />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-sm">Daily Check-in</Text>
                            <Text className="text-slate-400 text-xs">Login streak: 3 days</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="bg-amber-500 px-4 py-2 rounded-xl"
                        onPress={handleClaimDaily}
                    >
                        <Text className="text-slate-900 font-bold text-xs">Claim +10</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Challenges */}
                <View className="mb-8">
                    <Text className="text-white text-lg font-bold px-6 mb-4">Active Challenges</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                    >
                        {CHALLENGES.map((item, index) => (
                            <View
                                key={item.id}
                                className="mr-3 w-64 bg-slate-800 p-4 rounded-3xl border border-slate-700/50"
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                                        <item.icon size={20} color={item.color} />
                                    </View>
                                    <View className="bg-slate-700/50 px-2 py-1 rounded-lg">
                                        <Text className="text-indigo-300 font-bold text-[10px]">{item.reward}</Text>
                                    </View>
                                </View>
                                <Text className="text-white font-bold text-base mb-1">{item.title}</Text>
                                <Text className="text-slate-400 text-xs mb-3">{item.desc}</Text>

                                {/* Mini Progress */}
                                <View className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{ width: `${item.progress * 100}%`, backgroundColor: item.color }}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Redeem Section with Categories */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-end px-6 mb-4">
                        <Text className="text-white text-lg font-bold">Rewards</Text>
                    </View>

                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-4"
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                    >
                        {CATEGORIES.map((cat, i) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                className={`mr-2 px-4 py-2 rounded-full border ${activeCategory === cat ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-700'}`}
                            >
                                <Text className={`text-xs font-bold ${activeCategory === cat ? 'text-white' : 'text-slate-400'}`}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                    >
                        {filteredRewards.map((item, index) => (
                            <View
                                key={item.id}
                                className="mr-4 w-40"
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleRedeem(item)}
                                >
                                    <View className="bg-slate-800 rounded-2xl overflow-hidden mb-3 border border-slate-700/50">

                                        <Image source={{ uri: item.image }} className="w-full h-32 opacity-80" />
                                        <View className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                                            <Text className="text-white text-[10px] font-bold">{item.cost}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-white font-bold text-sm mb-1">{item.title}</Text>
                                    <Text className="text-slate-500 text-xs mb-1">{item.category}</Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-indigo-400 text-xs font-bold">Redeem Now</Text>
                                        <ChevronRight size={12} color="#818cf8" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>



                {/* History Section */}
                <View className="px-6">
                    <Text className="text-white text-lg font-bold mb-4">Recent Activity</Text>
                    {HISTORY.map((item, index) => (
                        <View
                            key={item.id}
                            className="flex-row items-center bg-slate-800/40 p-4 rounded-2xl mb-3 border border-slate-700/30"
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center ${item.type === 'EARNED' ? 'bg-indigo-500/10' : 'bg-rose-500/10'}`}>
                                <Award size={20} color={item.type === 'EARNED' ? '#818cf8' : '#fb7185'} />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-white font-semibold text-sm">{item.title}</Text>
                                <Text className="text-slate-400 text-xs mt-0.5">{item.date}</Text>
                            </View>
                            <Text className={`font-bold ${item.type === 'EARNED' ? 'text-green-400' : 'text-slate-200'}`}>
                                {item.points}
                            </Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView >
    );
}
