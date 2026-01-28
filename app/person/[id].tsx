import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { usePeople } from '../../hooks/usePeople';

export default function PersonDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchPersonDetails } = usePeople();
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            loadDetails(id);
        }
    }, [id]);

    const loadDetails = async (personId: string) => {
        setLoading(true);
        const data = await fetchPersonDetails(Number(personId));
        setPerson(data);
        setLoading(false);
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-slate-950"><ActivityIndicator size="large" color="#3b82f6" /></View>;
    if (!person) return <View className="flex-1 justify-center items-center bg-slate-950"><Text className="text-red-500 text-lg">Person not found</Text></View>;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1 bg-slate-950" bounces={false}>
                <View className="relative">
                    <Image
                        source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750' }}
                        className="w-full h-[450px]"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-slate-950 to-transparent" />

                    <TouchableOpacity className="absolute top-[60px] left-5 w-11 h-11 rounded-full bg-black/50 justify-center items-center" onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View className="absolute bottom-8 left-6 right-6">
                        <Text className="text-4xl font-black text-white">{person.name}</Text>
                        <Text className="text-slate-300 text-lg font-medium mt-1">{person.known_for_department}</Text>
                    </View>
                </View>

                <View className="px-6 pb-10">
                    <View className="flex-row items-center mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <View className="flex-1 border-r border-slate-700 items-center">
                            <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">Born In</Text>
                            <Text className="text-white font-bold mt-1 text-center">{person.place_of_birth || 'Unknown'}</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">Born</Text>
                            <Text className="text-white font-bold mt-1">{person.birthday || 'Unknown'}</Text>
                        </View>
                    </View>

                    {person.biography ? (
                        <View className="mb-8">
                            <Text className="text-xl font-bold text-white mb-3">Biography</Text>
                            <Text className="text-slate-400 leading-6">{person.biography}</Text>
                        </View>
                    ) : null}

                    <Text className="text-xl font-bold text-white mb-4">Known For</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {person.credits?.cast?.slice(0, 10).map((work: any) => (
                            <TouchableOpacity
                                key={work.id}
                                className="mr-4 w-[120px]"
                                onPress={() => router.push((work.media_type === 'tv' ? `/tv/${work.id}` : `/movie/${work.id}`) as any)}
                            >
                                <Image
                                    source={{ uri: work.poster_path ? `https://image.tmdb.org/t/p/w200${work.poster_path}` : 'https://via.placeholder.com/200x300' }}
                                    className="w-[120px] h-[180px] rounded-xl bg-slate-800 mb-2"
                                />
                                <Text className="text-white font-bold text-sm" numberOfLines={2}>{work.title || work.name}</Text>
                                <Text className="text-slate-500 text-xs" numberOfLines={1}>{work.character ? `as ${work.character}` : ''}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </>
    );
}
