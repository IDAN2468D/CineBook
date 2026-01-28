import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#050B26' }} edges={['top']}>
            <View className="flex-row items-center px-4 py-4 border-b border-slate-800">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">About CineBook</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="items-center py-10">
                    <View className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-6 shadow-xl shadow-blue-500/20 transform rotate-3">
                        <Ionicons name="ticket" size={48} color="white" />
                    </View>
                    <Text className="text-3xl font-bold text-white mb-2">CineBook</Text>
                    <Text className="text-slate-400">Version 1.0.0 (Build 124)</Text>
                </View>

                <View className="bg-slate-900 rounded-2xl overflow-hidden mb-6">
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-800">
                        <Text className="text-white font-medium">Rate Us on App Store</Text>
                        <Ionicons name="star-outline" size={20} color="#fbbf24" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-800" onPress={() => Linking.openURL('https://cinebook.com')}>
                        <Text className="text-white font-medium">Visit Website</Text>
                        <Ionicons name="globe-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-4">
                        <Text className="text-white font-medium">Follow on Twitter</Text>
                        <Ionicons name="logo-twitter" size={20} color="#38bdf8" />
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Legal</Text>

                <View className="bg-slate-900 rounded-2xl overflow-hidden mb-8">
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-800">
                        <Text className="text-white font-medium">Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-800">
                        <Text className="text-white font-medium">Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-4">
                        <Text className="text-white font-medium">Open Source Licenses</Text>
                        <Ionicons name="chevron-forward" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-600 text-center text-xs pb-10">
                    © 2024 CineBook Inc. All rights reserved.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
