import { useRouter } from 'expo-router';
import { Bookmark, ChevronLeft, Heart, Star } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlist } from '../hooks/useWatchlist';

const { width } = Dimensions.get('window');

// Layout Constants
const COLUMN_COUNT = 2;
const GAP = 16;
const PADDING = 20;
const ITEM_WIDTH = (width - (PADDING * 2) - GAP) / COLUMN_COUNT;

export default function WatchlistScreen() {
    const { watchlist: movies, loading, fetchWatchlist, toggleWatchlist } = useWatchlist();
    const router = useRouter();

    useEffect(() => {
        fetchWatchlist(); // Ensure we have latest data on entry
    }, []);

    const handleRemove = async (id: string) => {
        // Optimistically update or just wait for re-fetch
        await toggleWatchlist(id);
        fetchWatchlist();
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        if (!item) return <View style={{ width: ITEM_WIDTH }} />;

        return (
            <View
                style={{ width: ITEM_WIDTH, marginBottom: 24 }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(`/movie/${item.id}`)}
                >
                    <View className="relative shadow-xl shadow-black/50">
                        <Image
                            source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750' }}
                            style={{
                                width: '100%',
                                height: ITEM_WIDTH * 1.5,
                                borderRadius: 24,
                            }}
                            className="bg-slate-800"
                        />

                        {/* Remove Action */}
                        <TouchableOpacity
                            onPress={() => handleRemove(item.id.toString())}
                            className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full items-center justify-center border border-white/10"
                        >
                            <Heart size={18} color="#ef4444" fill="#ef4444" />
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4 px-1">
                        <Text numberOfLines={1} className="text-white font-bold text-lg tracking-tight">
                            {item.title}
                        </Text>
                        <View className="flex-row items-center mt-1.5 opacity-80">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-amber-400 text-xs font-bold ml-1.5">
                                {item.vote_average?.toFixed(1) || '0.0'}
                            </Text>
                            <Text className="text-slate-600 text-xs mx-2 font-black">•</Text>
                            <Text className="text-slate-400 text-xs font-medium">
                                {item.release_date?.split('-')[0] || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#020617]" edges={['top']}>
            <View className="flex-row items-center justify-between px-6 pt-2 pb-6">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 bg-slate-800/50 rounded-full items-center justify-center border border-slate-700/50 mr-5"
                    >
                        <ChevronLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-black text-white tracking-tight">Watchlist</Text>
                </View>

                {movies.length > 0 && (
                    <View className="h-8 px-3 bg-indigo-500/10 rounded-full items-center justify-center border border-indigo-500/20">
                        <Text className="text-indigo-400 font-bold text-xs">{movies.length} Saved</Text>
                    </View>
                )}
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : movies.length === 0 ? (
                <View className="flex-1 justify-center items-center px-10">
                    <View
                        className="w-24 h-24 bg-slate-800/30 rounded-full items-center justify-center mb-8 border border-slate-800"
                    >
                        <Bookmark size={40} color="#64748b" />
                    </View>
                    <Text className="text-white text-2xl font-bold mb-3 text-center">Your list is empty</Text>
                    <Text className="text-slate-500 text-center text-base leading-7">
                        Movies and TV shows you like will appear here. Go explore and build your collection!
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)')}
                        className="mt-10 bg-indigo-600 px-10 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 active:bg-indigo-700"
                    >
                        <Text className="text-white font-bold text-base">Explore Movies</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={movies}
                    keyExtractor={(item: any) => item.id.toString()}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={{
                        paddingHorizontal: PADDING,
                        paddingBottom: 120, // Space for tab bar
                        paddingTop: 10
                    }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
