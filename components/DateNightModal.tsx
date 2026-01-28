import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DatePlan } from '../hooks/useDateNight';

interface DateNightModalProps {
    visible: boolean;
    onClose: () => void;
    plan: DatePlan | null;
    loading: boolean;
    onGenerate: () => void;
    error: string | null;
}

export default function DateNightModal({ visible, onClose, plan, loading, onGenerate, error }: DateNightModalProps) {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-slate-900 rounded-t-[30px] p-6 h-[70%] border-t border-slate-700">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center">
                            <LinearGradient
                                colors={['#ec4899', '#8b5cf6']}
                                className="w-10 h-10 rounded-full justify-center items-center mr-3"
                            >
                                <Ionicons name="heart" size={20} color="white" />
                            </LinearGradient>
                            <Text className="text-white text-xl font-bold">Date Night Planner</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-800 justify-center items-center">
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {plan ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="bg-slate-800/50 p-5 rounded-2xl mb-4 border border-slate-700">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="restaurant" size={18} color="#ec4899" />
                                    <Text className="text-pink-400 font-bold ml-2">Dinner Idea</Text>
                                </View>
                                <Text className="text-slate-300 leading-6">{plan.dinner}</Text>
                            </View>

                            <View className="bg-slate-800/50 p-5 rounded-2xl mb-4 border border-slate-700">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="moon" size={18} color="#8b5cf6" />
                                    <Text className="text-purple-400 font-bold ml-2">After Movie</Text>
                                </View>
                                <Text className="text-slate-300 leading-6">{plan.activity}</Text>
                            </View>

                            <View className="bg-slate-800/50 p-5 rounded-2xl mb-4 border border-slate-700">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="chatbubbles" size={18} color="#3b82f6" />
                                    <Text className="text-blue-400 font-bold ml-2">Conversation Starter</Text>
                                </View>
                                <Text className="text-slate-300 leading-6 italic">"{plan.conversation}"</Text>
                            </View>

                            <TouchableOpacity
                                onPress={onGenerate}
                                className="bg-slate-800 py-4 rounded-2xl border border-slate-700 mt-2"
                            >
                                <Text className="text-white text-center font-bold">Regenerate Plan</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            {loading ? (
                                <>
                                    <ActivityIndicator size="large" color="#ec4899" />
                                    <Text className="text-slate-400 mt-4 text-center">Consulting Cupid... 💘</Text>
                                </>
                            ) : error ? (
                                <Text className="text-red-400 text-center">{error}</Text>
                            ) : (
                                <>
                                    <Ionicons name="rose-outline" size={60} color="#ec4899" />
                                    <Text className="text-white text-lg font-bold mt-4 text-center">Ready for a perfect night?</Text>
                                    <Text className="text-slate-400 text-center mt-2 mb-8 px-4">
                                        Let AI create a custom date itinerary based on this movie's vibe.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={onGenerate}
                                        className="bg-pink-600 w-full py-4 rounded-2xl shadow-lg shadow-pink-600/30"
                                    >
                                        <Text className="text-white text-center font-bold text-lg">Plan My Date</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}
