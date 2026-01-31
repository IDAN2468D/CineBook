import { Ionicons } from '@expo/vector-icons';
// import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../constants/api';
import { useAuthStore } from '../hooks/useAuthStore';

let GoogleSignin: any;
let statusCodes: any;
let isErrorWithCode: any = () => false;

try {
    const googleModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleModule.GoogleSignin;
    statusCodes = googleModule.statusCodes;
    isErrorWithCode = googleModule.isErrorWithCode;
} catch (e) {
    console.warn('Google Signin module not found (likely running in Expo Go)');
}

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [savedCredentials, setSavedCredentials] = useState<any>(null);

    // Animation refs

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setIsBiometricSupported(compatible && enrolled);

            const credentials = await SecureStore.getItemAsync('user_credentials');
            if (credentials) {
                setSavedCredentials(JSON.parse(credentials));
            }
        })();

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

        if (GoogleSignin) {
            try {
                // Configure Google Sign-In
                // IMPORTANT: webClientId must match the 'client_type: 3' ID in your google-services.json
                GoogleSignin.configure({
                    webClientId: '239218305388-5l4ng9t53ma32sv7ufvspjikb7t6nqps.apps.googleusercontent.com',
                    scopes: ['email', 'profile'],
                });
            } catch (e) {
                console.warn('Google Signin configure failed', e);
            }
        }
    }, []);

    const handleGoogleLogin = async () => {
        if (!GoogleSignin) {
            Alert.alert('Not Supported', 'Google Login requires a Development Build or Standalone App.');
            return;
        }

        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.type === 'cancelled') {
                setLoading(false);
                return;
            }

            const idToken = userInfo.data?.idToken;

            if (idToken) {
                try {
                    const res = await api.post('auth/google', { token: idToken });
                    await setAuth(res.data.token, res.data.user);
                    router.replace('/(tabs)');
                } catch (apiError: any) {
                    Alert.alert('Backend Error', apiError.response?.data?.message || 'Failed to authenticate with backend');
                }
            } else {
                throw new Error('Could not retrieve ID token');
            }
        } catch (error: any) {
            console.error('Google Login Error:', error);
            const errorCode = error?.code;

            // Handle specific Google Sign-In errors
            if (errorCode === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled, do nothing
            } else if (errorCode === statusCodes.IN_PROGRESS) {
                Alert.alert('Login in progress', 'You are already trying to sign in.');
            } else if (errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Play Services Error', 'Google Play Services are not available or outdated.');
            } else if (errorCode === '12500' || errorCode === 12500) {
                // Common error for missing SHA-1 or package name mismatch
                Alert.alert(
                    'Configuration Error',
                    'Sign-in failed (Error 12500). This usually means the app\'s SHA-1 fingerprint is missing from the Google Cloud Console.\n\nPlease add your debug SHA-1 to the credentials.'
                );
            } else {
                Alert.alert('Login Failed', error.message || `An unexpected error occurred (Code: ${errorCode})`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        if (!savedCredentials) return;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Biometrics',
            fallbackLabel: 'Enter Password',
        });

        if (result.success) {
            setEmail(savedCredentials.email);
            setPassword(savedCredentials.password);
            // Trigger login automatically
            manualLogin(savedCredentials.email, savedCredentials.password);
        }
    };

    const manualLogin = async (e: string, p: string) => {
        setLoading(true);
        try {
            const res = await api.post('auth/login', { email: e, password: p });
            await setAuth(res.data.token, res.data.user);
            await SecureStore.setItemAsync('user_credentials', JSON.stringify({ email: e, password: p }));
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login Error:', error);
            Alert.alert('Login Failed', error.response?.data?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = () => manualLogin(email, password);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#050B26] justify-center"
        >
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
                className="px-8"
            >
                <View className="items-center mb-10">
                    <View className="mb-6 shadow-2xl shadow-blue-500/30">
                        <Image
                            source={require('../assets/images/logo.png')}
                            className="w-24 h-24 rounded-3xl"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="text-4xl font-black text-white tracking-tighter mb-2 text-center">Welcome Back</Text>
                    <Text className="text-slate-400 text-base text-center">Sign in to continue your cinematic journey</Text>
                </View>

                <View className="space-y-4">
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

                    <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50 mb-2">
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

                    <TouchableOpacity className="self-end mb-6" onPress={() => router.push('/forgot-password')}>
                        <Text className="text-blue-500 font-semibold">Forgot Password?</Text>
                    </TouchableOpacity>

                    {isBiometricSupported && savedCredentials && (
                        <TouchableOpacity
                            className="bg-slate-800/50 py-4 rounded-2xl items-center border border-slate-700/50 mb-4 flex-row justify-center"
                            onPress={handleBiometricLogin}
                        >
                            <Ionicons name="finger-print" size={24} color="#3b82f6" />
                            <Text className="text-blue-500 text-lg font-bold ml-2">Quick Access</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        className={`py-4 rounded-2xl items-center shadow-lg shadow-blue-500/20 ${!email || !password ? 'bg-slate-800 opacity-50' : 'bg-blue-600'}`}
                        onPress={handleLogin}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white text-lg font-bold">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center my-8">
                    <View className="flex-1 h-[1px] bg-slate-800" />
                    <Text className="text-slate-500 mx-4 font-medium">Or continue with</Text>
                    <View className="flex-1 h-[1px] bg-slate-800" />
                </View>

                <View className="flex-row justify-between mb-8">
                    <TouchableOpacity className="flex-1 bg-slate-800/50 py-3.5 rounded-xl border border-slate-700 items-center mr-3 flex-row justify-center" onPress={handleGoogleLogin}>
                        <Ionicons name="logo-google" size={20} color="#fff" />
                        <Text className="text-white ml-2 font-semibold">Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-slate-800/50 py-3.5 rounded-xl border border-slate-700 items-center ml-3 flex-row justify-center" onPress={() => Alert.alert('Coming Soon', 'Apple Login coming soon!')}>
                        <Ionicons name="logo-apple" size={20} color="#fff" />
                        <Text className="text-white ml-2 font-semibold">Apple</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center">
                    <Text className="text-slate-400 text-base">New to CineBook? </Text>
                    <Link href="/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-500 text-base font-bold">Create Account</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}
