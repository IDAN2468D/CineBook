import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAiSearch } from '../hooks/useAiSearch';

const { width } = Dimensions.get('window');

export default function SmartSearchScreen() {
    const [query, setQuery] = useState('');
    const { results, loading, error, searchWithAi } = useAiSearch();
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        searchWithAi(query);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#050B26]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 py-4 flex-row items-center border-b border-slate-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Ask the AI</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-700">
                    <Text className="text-slate-400 mb-2 font-medium">Describe your vibe...</Text>
                    <View className="flex-row items-start">
                        <MaterialCommunityIcons name="robot-outline" size={24} color="#3b82f6" style={{ marginTop: 8, marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-white text-base leading-6 min-h-[80px]"
                            placeholder="e.g. A funny movie for a first date, or something with a mind-bending plot twist..."
                            placeholderTextColor="#64748b"
                            multiline
                            numberOfLines={3}
                            value={query}
                            onChangeText={setQuery}
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>
                    <TouchableOpacity
                        className={`mt-4 py-3 rounded-xl flex-row justify-center items-center ${loading || !query.trim() ? 'bg-slate-700' : 'bg-blue-600'}`}
                        onPress={handleSearch}
                        disabled={loading || !query.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
                                <Text className="text-white font-bold">Smart Search</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View className="items-center py-10">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-slate-400 mt-4 text-center">AI is analyzing movie plots...{'\n'}This might take a moment.</Text>
                    </View>
                )}

                {error && (
                    <View className="items-center py-10 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
                        <Text className="text-red-400 mt-2 text-center">{error}</Text>
                    </View>
                )}

                {results.length > 0 && (
                    <View>
                        <Text className="text-white text-lg font-bold mb-4">Recommended for you</Text>
                        {results.map((item: any) => (
                            <TouchableOpacity
                                key={item.id}
                                className="bg-slate-800 rounded-2xl mb-5 overflow-hidden border border-slate-700"
                                onPress={() => router.push(`/movie/${item.id}`)}
                            >
                                <View className="flex-row">
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                                        className="w-[100px] h-[150px]"
                                    />
                                    <View className="flex-1 p-4 justify-between">
                                        <View>
                                            <Text className="text-white text-lg font-bold mb-1" numberOfLines={2}>{item.title}</Text>
                                            <View className="flex-row items-center mb-2">
                                                <Ionicons name="star" size={14} color="#fbbf24" />
                                                <Text className="text-slate-400 text-xs ml-1">{item.vote_average?.toFixed(1)}</Text>
                                            </View>
                                        </View>

                                        <View className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                                            <View className="flex-row items-center mb-1">
                                                <MaterialCommunityIcons name="star-face" size={14} color="#60a5fa" />
                                                <Text className="text-blue-400 text-xs font-bold ml-1">AI Insight</Text>
                                            </View>
                                            <Text className="text-slate-300 text-xs leading-4">{item.aiReason}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
