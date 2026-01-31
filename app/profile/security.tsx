import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../constants/api';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function SecurityScreen() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [faceId, setFaceId] = useState(true);
    const [rememberMe, setRememberMe] = useState(true); // This could be linked to storage
    const [twoFactor, setTwoFactor] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await api.delete('users/account');
                            Alert.alert('Account Deleted', 'We are sorry to see you go.');
                            // Logout
                            // setAuth(null, null); // Ideally
                            router.replace('/login');
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete account');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#050B26' }} edges={['top']}>
            <View className="flex-row items-center px-4 py-4 border-b border-slate-800">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Security</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Login Security</Text>

                <View className="bg-slate-900 rounded-2xl overflow-hidden mb-6">
                    <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-blue-500/20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="scan-outline" size={18} color="#3b82f6" />
                            </View>
                            <Text className="text-white font-medium">Face ID</Text>
                        </View>
                        <Switch
                            value={faceId}
                            onValueChange={setFaceId}
                            trackColor={{ false: '#1e293b', true: '#3b82f6' }}
                            thumbColor="#f8fafc"
                        />
                    </View>
                    <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-purple-500/20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="key-outline" size={18} color="#a855f7" />
                            </View>
                            <Text className="text-white font-medium">Remember Me</Text>
                        </View>
                        <Switch
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            trackColor={{ false: '#1e293b', true: '#a855f7' }}
                            thumbColor="#f8fafc"
                        />
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-orange-500/20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="shield-checkmark-outline" size={18} color="#f97316" />
                            </View>
                            <Text className="text-white font-medium">Two-Factor Auth</Text>
                        </View>
                        <Switch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            trackColor={{ false: '#1e293b', true: '#f97316' }}
                            thumbColor="#f8fafc"
                        />
                    </View>
                </View>

                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Appearance</Text>

                <View className="bg-slate-900 rounded-2xl overflow-hidden mb-6">
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-yellow-500/20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="moon-outline" size={18} color="#eab308" />
                            </View>
                            <Text className="text-white font-medium">Dark Mode</Text>
                        </View>
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleColorScheme}
                            trackColor={{ false: '#1e293b', true: '#eab308' }}
                            thumbColor="#f8fafc"
                        />
                    </View>
                </View>

                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Password Management</Text>

                <TouchableOpacity className="bg-slate-900 rounded-2xl p-4 flex-row items-center justify-between mb-6">
                    <Text className="text-white font-medium ml-2">Change Password</Text>
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </TouchableOpacity>

                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Devices</Text>
                <View className="bg-slate-900 rounded-2xl p-4 flex-row items-center justify-between">
                    <View>
                        <Text className="text-white font-medium">iPhone 14 Pro</Text>
                        <Text className="text-slate-500 text-xs mt-1">Last active: Just now</Text>
                    </View>
                    <Text className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">THIS DEVICE</Text>
                </View>
                <TouchableOpacity
                    className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex-row items-center justify-center mt-8"
                    onPress={handleDeleteAccount}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#ef4444" /> : (
                        <>
                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            <Text className="text-red-500 font-bold ml-2">Delete Account</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
