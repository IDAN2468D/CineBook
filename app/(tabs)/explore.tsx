import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../constants/api';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function ProfileScreen() {
  const { user, logout, setAuth } = useAuthStore();
  const router = useRouter();

  const handleRefreshToken = async () => {
    try {
      if (!user?.email) {
        Alert.alert('Error', 'No user email found');
        return;
      }

      const res = await api.post('auth/regenerate-token', { email: user.email });
      await setAuth(res.data.token, res.data.user);
      Alert.alert('Success', '✅ Token refreshed! All features are now working.');
    } catch (error: any) {
      console.error('Refresh token error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to refresh token');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050B26' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Floating Profile Card */}
        <View className="items-center py-8 bg-slate-900 rounded-[32px] mx-4 mt-2 mb-4 border border-slate-800 shadow-lg shadow-black/30">
          {user?.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              className="w-24 h-24 rounded-full mb-4 bg-slate-800 border-4 border-slate-800 shadow-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-blue-600 justify-center items-center mb-4 shadow-lg shadow-blue-500/30 border-4 border-slate-800">
              <Text className="text-4xl font-bold text-white">{user?.name?.charAt(0) || 'U'}</Text>
            </View>
          )}
          <Text className="text-2xl font-bold text-white">{user?.name || 'User'}</Text>
          <Text className="text-sm text-slate-400 mt-1">{user?.email || 'user@example.com'}</Text>

          <View className="flex-row mt-4 space-x-2">
            <View className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              <Text className="text-amber-500 text-xs font-bold">Gold Member</Text>
            </View>
          </View>
        </View>


        <View className="mt-8 px-6">
          <Text className="text-base font-bold text-slate-500 mb-4 uppercase tracking-widest">Account Settings</Text>

          <ProfileItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => router.push('/profile/edit-profile')}
          />
          <ProfileItem
            icon="heart-outline"
            title="My Watchlist"
            onPress={() => router.push('/watchlist')}
          />
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => router.push('/notifications')}
          />
          <ProfileItem
            icon="shield-checkmark-outline"
            title="Security"
            onPress={() => router.push('/profile/security')}
          />
        </View>

        <View className="mt-8 px-6">
          <Text className="text-base font-bold text-slate-500 mb-4 uppercase tracking-widest">Support</Text>
          <ProfileItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => router.push('/profile/help-center')}
          />
          <ProfileItem
            icon="information-circle-outline"
            title="About CineBook"
            onPress={() => router.push('/profile/about')}
          />
        </View>

        <View className="mt-8 px-6">
          <Text className="text-base font-bold text-slate-500 mb-4 uppercase tracking-widest">Developer Tools</Text>
          <TouchableOpacity className="flex-row items-center bg-slate-900 p-4 rounded-2xl border border-blue-900" onPress={handleRefreshToken}>
            <Ionicons name="refresh-circle" size={22} color="#3b82f6" />
            <Text className="text-blue-500 text-base ml-3 font-semibold">Refresh Token</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-slate-900 p-4 rounded-2xl border border-purple-900 mt-3" onPress={async () => {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.removeItem('hasSeenOnboarding');
            Alert.alert('Success', 'Onboarding has been reset.\nPlease restart the app to see it.');
          }}>
            <Ionicons name="reload-circle" size={22} color="#a855f7" />
            <Text className="text-purple-500 text-base ml-3 font-semibold">Reset Onboarding</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex-row items-center justify-center mt-4 p-5" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 text-lg font-bold ml-2">Sign Out</Text>
        </TouchableOpacity>

        <Text className="text-center text-slate-700 text-xs mt-5 mb-10">Version 1.0.0 (CineBook Premium)</Text>
      </ScrollView>
    </SafeAreaView >
  );
}

const ProfileItem = ({ icon, title, onPress }: any) => (
  <TouchableOpacity className="flex-row items-center justify-between bg-slate-900 p-4 rounded-2xl mb-3" onPress={onPress}>
    <View className="flex-row items-center">
      <Ionicons name={icon} size={22} color="#94a3b8" />
      <Text className="text-slate-200 text-base ml-3">{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#334155" />
  </TouchableOpacity>
);
