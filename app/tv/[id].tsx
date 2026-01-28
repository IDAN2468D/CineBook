import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTvShows } from '../../hooks/useTvShows';

export default function TvShowDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchTvShowDetails } = useTvShows();
    const [tvDetails, setTvDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            loadDetails(id);
        }
    }, [id]);

    const loadDetails = async (tvId: string) => {
        setLoading(true);
        const data = await fetchTvShowDetails(Number(tvId));
        setTvDetails(data);
        setLoading(false);
    };

    const openTrailer = (videoKey: string) => {
        Linking.openURL(`https://www.youtube.com/watch?v=${videoKey}`);
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-slate-950"><ActivityIndicator size="large" color="#3b82f6" /></View>;
    if (!tvDetails) return <View className="flex-1 justify-center items-center bg-slate-950"><Text className="text-red-500 text-lg">TV Show not found</Text></View>;

    const trailer = tvDetails.videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1 bg-slate-950" bounces={false}>
                <View>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w1280${tvDetails.backdrop_path}` }}
                        className="w-full h-[350px]"
                    />
                    <TouchableOpacity className="absolute top-[60px] left-5 w-11 h-11 rounded-full bg-black/50 justify-center items-center" onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
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
                        <Text className="text-[28px] font-black text-white flex-1 mr-4">{tvDetails.name}</Text>
                        <View className="flex-row items-center bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
                            <Ionicons name="star" size={16} color="#fbbf24" />
                            <Text className="text-white font-bold ml-1 text-base">{tvDetails.vote_average?.toFixed(1)}</Text>
                        </View>
                    </View>

                    <View className="flex-row mt-4 mb-4">
                        <View className="flex-row items-center mr-6">
                            <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{tvDetails.first_air_date?.split('-')[0]}</Text>
                        </View>
                        <View className="flex-row items-center mr-6">
                            <MaterialCommunityIcons name="television-classic" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{tvDetails.number_of_seasons} Seasons</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="language-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 ml-1.5 text-sm">{tvDetails.original_language?.toUpperCase()}</Text>
                        </View>
                    </View>

                    {tvDetails.genres && (
                        <View className="flex-row flex-wrap mb-6">
                            {tvDetails.genres.slice(0, 3).map((genre: any) => (
                                <View key={genre.id} className="bg-slate-800 px-3 py-1.5 rounded-2xl mr-2 mb-2 border border-slate-700">
                                    <Text className="text-slate-400 text-xs font-semibold">{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text className="text-xl font-bold text-white mt-2 mb-3">Overview</Text>
                    <Text className="text-slate-300 leading-6 text-base opacity-80">{tvDetails.overview}</Text>

                    {tvDetails.cast && tvDetails.cast.length > 0 && (
                        <>
                            <Text className="text-xl font-bold text-white mt-8 mb-4">Cast</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                                {tvDetails.cast.map((actor: any) => (
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
                </View>
            </ScrollView>
        </>
    );
}
