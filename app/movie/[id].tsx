import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DateNightModal from '../../components/DateNightModal';
import { useCrowdPrediction } from '../../hooks/useCrowdPrediction';
import { useDateNight } from '../../hooks/useDateNight';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import { useReviewSummary } from '../../hooks/useReviewSummary';
import { useWatchlist } from '../../hooks/useWatchlist';

export default function MovieDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { movieDetails, showtimes, loading, fetchMovieDetails } = useMovieDetails();
    const { inWatchlist, checkInWatchlist, toggleWatchlist: hookToggleWatchlist } = useWatchlist();
    const { prediction, loading: loadingPrediction, checkCrowd } = useCrowdPrediction();
    const { summary, loading: summaryLoading, fetchSummary } = useReviewSummary();
    const { plan, loading: dateLoading, error: dateError, generatePlan } = useDateNight();
    const [dateModalVisible, setDateModalVisible] = useState(false);

    useEffect(() => {
        if (typeof id === 'string') {
            fetchMovieDetails(id);
            checkInWatchlist(id);
            checkCrowd(id);
            fetchSummary(id);
        }
    }, [id]);

    const toggleWatchlist = async () => {
        if (typeof id === 'string') {
            await hookToggleWatchlist(id);
        }
    };

    const openTrailer = (videoKey: string) => {
        Linking.openURL(`https://www.youtube.com/watch?v=${videoKey}`);
    };

    const handleDatePlan = () => {
        setDateModalVisible(true);
        if (!plan && movieDetails) {
            const genres = movieDetails.genres?.map((g: any) => g.name).join(', ') || 'General';
            generatePlan(movieDetails.title, genres);
        }
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-slate-950"><ActivityIndicator size="large" color="#3b82f6" /></View>;
    if (!movieDetails) return <View className="flex-1 justify-center items-center bg-slate-950"><Text className="text-red-500 text-lg">Movie not found</Text></View>;

    const trailer = movieDetails.videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1 bg-slate-950" bounces={false}>
                <View>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}` }}
                        className="w-full h-[350px]"
                    />
                    <TouchableOpacity className="absolute top-[60px] left-5 w-11 h-11 rounded-full bg-black/50 justify-center items-center" onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity className="absolute top-[60px] right-5 w-11 h-11 rounded-full bg-black/50 justify-center items-center" onPress={toggleWatchlist}>
                        <Ionicons
                            name={inWatchlist ? "heart" : "heart-outline"}
                            size={28}
                            color={inWatchlist ? "#ef4444" : "#fff"}
                        />
                    </TouchableOpacity>

                    {trailer && (
                        <TouchableOpacity
                            className="absolute top-1/2 left-1/2 -ml-[35px] -mt-[35px] opacity-90"
                            onPress={() => openTrailer(trailer.key)}
                        >
                            <Ionicons name="play-circle" size={70} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="px-6 -mt-[30px] bg-slate-950 rounded-t-[32px]">
                    <View className="flex-row justify-between items-start mt-6">
                        <Text className="text-[28px] font-black text-white flex-1 mr-4">{movieDetails.title}</Text>
                        <View className="flex-row items-center bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
                            <Ionicons name="star" size={16} color="#fbbf24" />
                            <Text className="text-white font-bold ml-1 text-base">{movieDetails.vote_average?.toFixed(1)}</Text>
                        </View>
                    </View>

                    <View className="flex-row mt-4 mb-4">
                        <View className="flex-row items-center mr-6">
                            <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{movieDetails.release_date?.split('-')[0]}</Text>
                        </View>
                        <View className="flex-row items-center mr-6">
                            <Ionicons name="time-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{movieDetails.runtime} min</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="language-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{movieDetails.original_language?.toUpperCase()}</Text>
                        </View>
                    </View>

                    {/* Date Night Button */}
                    <TouchableOpacity
                        onPress={handleDatePlan}
                        className="bg-pink-600/20 border border-pink-500/50 p-3 rounded-2xl mb-6 flex-row items-center justify-center"
                    >
                        <Ionicons name="heart" size={20} color="#ec4899" style={{ marginRight: 8 }} />
                        <Text className="text-pink-400 font-bold">Plan a Date Night</Text>
                    </TouchableOpacity>

                    {/* AI Crowd Prediction Card */}
                    {loadingPrediction ? (
                        <View className="h-24 justify-center items-center bg-slate-900 rounded-2xl mb-6 border border-slate-800 border-dashed">
                            <ActivityIndicator color="#3b82f6" />
                            <Text className="text-slate-500 text-xs mt-2">Analyzing crowd data...</Text>
                        </View>
                    ) : prediction ? (
                        <View className="bg-slate-900/80 p-4 rounded-2xl mb-6 border border-slate-800">
                            <View className="flex-row items-center mb-2">
                                <MaterialCommunityIcons name="robot-happy" size={20} color="#60a5fa" />
                                <Text className="text-blue-400 font-bold ml-2 text-sm uppercase tracking-wider">AI Crowd Forecast</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-white font-bold text-lg">{prediction.level} Traffic</Text>
                                    <Text className="text-slate-400 text-xs w-[220px] leading-4 mt-1">{prediction.reason}</Text>
                                </View>
                                <View className={`w-14 h-14 rounded-full justify-center items-center ${prediction.crowdPercentage > 70 ? 'bg-red-500/20 border-red-500' : prediction.crowdPercentage > 40 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-green-500/20 border-green-500'} border-2`}>
                                    <Text className={`font-bold text-xs ${prediction.crowdPercentage > 70 ? 'text-red-500' : prediction.crowdPercentage > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {prediction.crowdPercentage}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : null}

                    {/* AI Review Summary Card */}
                    {summaryLoading ? (
                        <View className="h-20 justify-center items-center bg-slate-900 rounded-2xl mb-6 border border-slate-800 border-dashed">
                            <ActivityIndicator size="small" color="#a855f7" />
                            <Text className="text-slate-500 text-xs mt-2">Reading reviews...</Text>
                        </View>
                    ) : summary ? (
                        <View className="bg-slate-900/80 p-4 rounded-2xl mb-6 border border-slate-800 relative overflow-hidden">
                            <LinearGradient
                                colors={['rgba(168, 85, 247, 0.1)', 'transparent']}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            />
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="sparkles" size={18} color="#a855f7" />
                                <Text className="text-purple-400 font-bold ml-2 text-sm uppercase tracking-wider">AI Review Summary</Text>
                            </View>
                            <Text className="text-slate-300 text-sm leading-5 italic">"{summary}"</Text>
                        </View>
                    ) : null}

                    {movieDetails.genres && (
                        <View className="flex-row flex-wrap mb-6">
                            {movieDetails.genres.slice(0, 3).map((genre: any) => (
                                <View key={genre.id} className="bg-slate-800 px-3 py-1.5 rounded-2xl mr-2 mb-2 border border-slate-700">
                                    <Text className="text-slate-400 text-xs font-semibold">{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text className="text-xl font-bold text-white mt-2 mb-3">Overview</Text>
                    <Text className="text-slate-300 leading-6 text-base opacity-80">{movieDetails.overview}</Text>

                    {movieDetails.cast && movieDetails.cast.length > 0 && (
                        <>
                            <Text className="text-xl font-bold text-white mt-8 mb-4">Cast</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                                {movieDetails.cast.map((actor: any) => (
                                    <View key={actor.id} className="w-[100px] mr-3">
                                        <Image
                                            source={{
                                                uri: actor.profile_path
                                                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                    : 'https://via.placeholder.com/200x300?text=No+Image'
                                            }}
                                            className="w-[100px] h-[150px] rounded-xl bg-slate-800"
                                        />
                                        <Text className="text-white text-[13px] font-semibold mt-2" numberOfLines={1}>{actor.name}</Text>
                                        <Text className="text-slate-500 text-[11px] mt-0.5" numberOfLines={1}>{actor.character}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    <Text className="text-xl font-bold text-white mt-2 mb-4">Available Showtimes</Text>
                    <View className="flex-row flex-wrap mt-2 pb-10">
                        {showtimes.length === 0 ? (
                            <Text className="text-slate-500 text-base italic">No showtimes available for this movie yet.</Text>
                        ) : (
                            showtimes.map((show: any) => (
                                <TouchableOpacity
                                    key={show._id}
                                    className="bg-slate-900 border border-slate-800 px-4 py-3.5 rounded-2xl mr-3 mb-3 min-w-[110px] items-center"
                                    onPress={() => router.push(`/booking/${show._id}`)}
                                >
                                    <Text className="text-white font-bold text-lg">
                                        {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <View className="flex-row items-center mt-1.5">
                                        <MaterialCommunityIcons name="google-maps" size={12} color="#64748b" />
                                        <Text className="text-slate-500 text-xs ml-1">{show.hall?.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <DateNightModal
                visible={dateModalVisible}
                onClose={() => setDateModalVisible(false)}
                plan={plan}
                loading={dateLoading}
                onGenerate={() => generatePlan(movieDetails.title, movieDetails.genres?.map((g: any) => g.name).join(', ') || 'General')}
                error={dateError}
            />
        </>
    );
}
