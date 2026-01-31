import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../constants/api';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password

    const handleRequestOtp = async () => {
        if (!email) return Alert.alert('Error', 'Please enter your email');
        setLoading(true);
        try {
            const res = await api.post('auth/forgot-password', { email });
            if (res.data.debugOtp) {
                Alert.alert('Dev Mode', `Your OTP is: ${res.data.debugOtp}`);
            } else {
                Alert.alert('Success', 'OTP sent to your email');
            }
            setStep(2);
        } catch (error: any) {
            console.error('Forgot Password Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword) return Alert.alert('Error', 'Please fill all fields');
        setLoading(true);
        try {
            await api.post('auth/reset-password', { email, otp, newPassword });
            Alert.alert('Success', 'Password reset successfully', [
                { text: 'Login', onPress: () => router.replace('/login') }
            ]);
        } catch (error: any) {
            console.error('Reset Password Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#050B26] justify-center px-8"
        >
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 left-8 z-10 bg-slate-800/50 p-2 rounded-full"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View className="mb-10">
                <Text className="text-3xl font-bold text-white mb-2">
                    {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                </Text>
                <Text className="text-slate-400 text-base">
                    {step === 1
                        ? "Enter your email and we'll send you an OTP code."
                        : "Enter the code sent to your email and your new password."}
                </Text>
            </View>

            <View className="space-y-4">
                {step === 1 && (
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
                )}

                {step === 2 && (
                    <>
                        <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                            <Ionicons name="key-outline" color="#94a3b8" size={20} style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-white py-4 text-base font-medium"
                                placeholder="Enter 6-digit OTP"
                                placeholderTextColor="#64748b"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>
                        <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                            <Ionicons name="lock-closed-outline" color="#94a3b8" size={20} style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-white py-4 text-base font-medium"
                                placeholder="New Password"
                                placeholderTextColor="#64748b"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                        </View>
                    </>
                )}

                <TouchableOpacity
                    className={`py-4 rounded-2xl items-center shadow-lg shadow-blue-500/20 bg-blue-600 mt-4`}
                    onPress={step === 1 ? handleRequestOtp : handleResetPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-lg font-bold">
                            {step === 1 ? 'Send OTP' : 'Reset Password'}
                        </Text>
                    )}
                </TouchableOpacity>

                {step === 2 && (
                    <TouchableOpacity onPress={() => setStep(1)} className="mt-4 items-center">
                        <Text className="text-slate-400">Wrong email? <Text className="text-blue-500 font-bold">Go Back</Text></Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
