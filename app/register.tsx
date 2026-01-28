import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../constants/api';
import { useAuthStore } from '../hooks/useAuthStore';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password) return Alert.alert('Error', 'Please fill all fields');
        setLoading(true);
        try {
            const res = await api.post('auth/register', { name, email, password });
            await setAuth(res.data.token, res.data.user);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.response) {
                Alert.alert('Registration Failed', error.response.data?.message || 'Server error');
            } else if (error.request) {
                Alert.alert('Registration Failed', 'Cannot connect to server. Check your network or IP.');
            } else {
                Alert.alert('Registration Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#050B26]"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                    className="px-8 py-10"
                >
                    <View className="items-center mb-10">
                        <View className="mb-6 shadow-2xl shadow-blue-500/30">
                            <Image
                                source={require('../assets/images/logo.png')}
                                className="w-20 h-20 rounded-3xl"
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</Text>
                        <Text className="text-slate-400 text-base text-center px-4">Join thousands of movie lovers today</Text>
                    </View>

                    <View className="space-y-4 mb-2">
                        <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                            <Ionicons name="person-outline" color="#94a3b8" size={20} style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-white py-4 text-base font-medium"
                                placeholder="Full Name"
                                placeholderTextColor="#64748b"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                            <Ionicons name="mail-outline" color="#94a3b8" size={20} style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-white py-4 text-base font-medium"
                                placeholder="Email Address"
                                placeholderTextColor="#64748b"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                            <Ionicons name="lock-closed-outline" color="#94a3b8" size={20} style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-white py-4 text-base font-medium"
                                placeholder="Password"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} color="#94a3b8" size={20} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className={`py-4 rounded-2xl items-center shadow-lg shadow-blue-500/20 mt-4 ${!name || !email || !password ? 'bg-slate-800 opacity-50' : 'bg-blue-600'}`}
                            onPress={handleRegister}
                            disabled={loading || !name || !email || !password}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-lg font-bold">Get Started</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-slate-800" />
                        <Text className="text-slate-500 mx-4 font-medium">Or sign up with</Text>
                        <View className="flex-1 h-[1px] bg-slate-800" />
                    </View>

                    <View className="flex-row justify-between mb-8">
                        <TouchableOpacity className="flex-1 bg-slate-800/50 py-3.5 rounded-xl border border-slate-700 items-center mr-3 flex-row justify-center" onPress={() => Alert.alert('Coming Soon', 'Google Login coming soon!')}>
                            <Ionicons name="logo-google" size={20} color="#fff" />
                            <Text className="text-white ml-2 font-semibold">Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-slate-800/50 py-3.5 rounded-xl border border-slate-700 items-center ml-3 flex-row justify-center" onPress={() => Alert.alert('Coming Soon', 'Apple Login coming soon!')}>
                            <Ionicons name="logo-apple" size={20} color="#fff" />
                            <Text className="text-white ml-2 font-semibold">Apple</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mb-6">
                        <Text className="text-slate-400 text-base">Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-500 text-base font-bold">Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
