import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage, useCineBot } from '../hooks/useCineBot';

export default function ChatScreen() {
    const router = useRouter();
    const { messages, loading, sendMessage } = useCineBot();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Scroll to bottom on new message
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, loading]);

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isUser = item.role === 'user';
        return (
            <View className={`flex-row mb-6 px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <View className="w-10 h-10 rounded-full bg-slate-800 justify-center items-center mr-3 border border-slate-700 shadow-lg shadow-purple-900/50">
                        <Ionicons name="sparkles" size={20} color="#a855f7" />
                    </View>
                )}

                {isUser ? (
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="max-w-[80%] px-5 py-3 rounded-2xl rounded-tr-none shadow-md shadow-blue-500/20"
                    >
                        <Text className="text-white text-base leading-6 font-medium">{item.text}</Text>
                    </LinearGradient>
                ) : (
                    <View className="max-w-[80%] px-5 py-4 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 shadow-sm">
                        <Text className="text-slate-200 text-base leading-6">{item.text}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#050B26]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Gradient */}
            <LinearGradient
                colors={['rgba(5, 11, 38, 0.8)', 'rgba(15, 23, 42, 1)']}
                className="absolute w-full h-full"
            />

            <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
                {/* Floating Header */}
                <View className="mx-4 mt-2 px-5 py-4 flex-row items-center bg-slate-900/60 rounded-3xl border border-slate-800/50 backdrop-blur-md shadow-lg">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-slate-800 justify-center items-center border border-slate-700 mr-4"
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <View className="flex-row items-center">
                            <Text className="text-transparent bg-clip-text font-black text-xl mr-2" style={{ color: '#fff' }}>
                                CineBot
                            </Text>
                            <View className="px-2 py-0.5 bg-purple-500/20 rounded-full border border-purple-500/30">
                                <Text className="text-purple-400 text-[10px] font-bold">AI ASSISTANT</Text>
                            </View>
                        </View>
                        <Text className="text-slate-400 text-xs mt-0.5">Powered by Gemini 1.5</Text>
                    </View>
                </View>

                {/* Chat List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 4 }}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loading ? (
                            <View className="flex-row px-4 mb-4 items-center">
                                <View className="w-10 h-10 rounded-full bg-slate-800 justify-center items-center mr-3 border border-slate-700">
                                    <Ionicons name="sparkles" size={20} color="#a855f7" />
                                </View>
                                <View className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700 w-16 items-center">
                                    <ActivityIndicator color="#a855f7" size="small" />
                                </View>
                            </View>
                        ) : null
                    }
                />

                {/* Floating Input Area */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View className="p-4 pt-2">
                        <View className="flex-row items-center bg-slate-900/90 rounded-[28px] px-2 py-2 border border-slate-700/80 shadow-2xl focus:border-blue-500 mb-2">
                            <TextInput
                                className="flex-1 text-white px-5 py-3 text-base h-12"
                                placeholder="Ask for movie recommendations..."
                                placeholderTextColor="#64748b"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={loading || !inputText.trim()}
                                className={`w-12 h-12 rounded-full justify-center items-center ml-1 ${inputText.trim() ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-700'}`}
                            >
                                <Ionicons name="arrow-up" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
