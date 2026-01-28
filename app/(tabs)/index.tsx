import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovies } from '../../hooks/useMovies';
import { useTvShows } from '../../hooks/useTvShows';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

type Category = 'movies' | 'tv';
type MovieTab = 'now_playing' | 'upcoming' | 'top-rated' | 'popular';
type TvTab = 'popular' | 'top-rated' | 'on-the-air';

import VibeSearchModal from '../../components/VibeSearchModal';

export default function HomeScreen() {
  const router = useRouter();

  // State
  const [category, setCategory] = useState<Category>('movies');
  const [movieTab, setMovieTab] = useState<MovieTab>('now_playing');
  const [tvTab, setTvTab] = useState<TvTab>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [vibeModalVisible, setVibeModalVisible] = useState(false);

  // Hooks
  const { movies, loading: moviesLoading, fetchMovies, searchMovies, activeGenre, setActiveGenre } = useMovies();
  const { tvShows, loading: tvLoading, fetchTvShows } = useTvShows();

  // Effects
  useEffect(() => {
    if (category === 'movies') {
      if (!searchQuery) fetchMovies(movieTab);
    } else {
      if (!searchQuery) fetchTvShows(tvTab);
    }
  }, [category, movieTab, tvTab]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        if (category === 'movies') searchMovies(searchQuery);
        // Note: TV search isn't explicitly implemented in useTvShows, defaulting to movie search for now or just disabling
        // If you want TV search, you'd need to add it to useTvShows or handle it here.
        // For this demo, let's stick to movie search or clear search when switching
      }, 500);
      return () => clearTimeout(timer);
    } else {
      if (category === 'movies') fetchMovies(movieTab);
      else fetchTvShows(tvTab);
    }
  }, [searchQuery]);

  const loading = category === 'movies' ? moviesLoading : tvLoading;
  const data = category === 'movies' ? movies : tvShows;

  const renderItem = ({ item }: any) => {
    const isMovie = category === 'movies';
    const title = isMovie ? item.title : item.name;
    const date = isMovie ? item.release_date : item.first_air_date;
    const route = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

    // Prevent navigation error if id is missing or invalid, though uncommon from API
    const handlePress = () => {
      // Cast to any to avoid strict type checking on dynamic routes with 'any' typed id
      if (isMovie) router.push(`/movie/${item.id}` as any);
      else router.push(`/tv/${item.id}` as any);
    };

    return (
      <TouchableOpacity
        className="mb-5 mr-4 rounded-xl overflow-hidden bg-slate-800"
        style={{ width: ITEM_WIDTH }}
        onPress={handlePress}
      >
        <Image
          source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750' }}
          style={{ width: '100%', height: ITEM_WIDTH * 1.5 }}
        />
        <View className="p-2">
          <Text className="text-white font-bold text-sm" numberOfLines={1}>{title}</Text>
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-slate-400 text-xs">⭐ {item.vote_average?.toFixed(1)}</Text>
            <Text className="text-slate-500 text-[10px]">{date?.split('-')[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050B26' }} edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        {/* Floating Header */}
        <View className="flex-row justify-between items-center mb-6 bg-slate-800/80 p-2 rounded-full border border-slate-700/50 shadow-lg shadow-black/20 mx-1 mt-2">

          <View className="flex-row items-center pl-2">
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 overflow-hidden bg-black border border-slate-600">
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Welcome Back</Text>
              <Text className="text-white font-bold text-base">Cinephile</Text>
            </View>
          </View>

          <View className="flex-row mr-1">
            <TouchableOpacity
              onPress={() => router.push('/chat')}
              className="w-10 h-10 bg-purple-600 rounded-full justify-center items-center border border-purple-400 mr-2 shadow-sm"
            >
              <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVibeModalVisible(true)}
              className="w-10 h-10 bg-blue-600 rounded-full justify-center items-center border border-blue-400 mr-2 shadow-sm"
            >
              <Ionicons name="sparkles" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="w-10 h-10 bg-slate-700 rounded-full justify-center items-center border border-slate-600 shadow-sm"
            >
              <Ionicons name="notifications" size={18} color="#94a3b8" />
              <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-slate-700" />
            </TouchableOpacity>
          </View>
        </View>


        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => setCategory('movies')} className="mr-6">
            <Text className={`text-4xl font-black ${category === 'movies' ? 'text-white' : 'text-slate-700'}`}>
              Movies
            </Text>
            {category === 'movies' && <View className="h-1.5 bg-blue-500 w-8 rounded-full mt-1" />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('tv')}>
            <Text className={`text-4xl font-black ${category === 'tv' ? 'text-white' : 'text-slate-700'}`}>
              TV Series
            </Text>
            {category === 'tv' && <View className="h-1.5 bg-blue-500 w-8 rounded-full mt-1" />}
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center bg-slate-800 mx-5 mb-5 px-4 rounded-2xl border border-slate-700">
        <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          className="flex-1 text-white py-3.5 text-base"
          placeholder={`Search ${category === 'movies' ? 'movies' : 'TV shows'}...`}
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories / Tabs */}
      <View className="mb-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          className="flex-row"
        >
          {category === 'movies' ? (
            // Movie Tabs
            <>
              {[
                { label: 'Now Playing', value: 'now_playing' },
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Top Rated', value: 'top-rated' },
                { label: 'Popular', value: 'popular' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  className={`mr-3 px-4 py-2 rounded-full border ${movieTab === tab.value ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}
                  onPress={() => setMovieTab(tab.value as MovieTab)}
                >
                  <Text className={`font-semibold ${movieTab === tab.value ? 'text-white' : 'text-slate-400'}`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            // TV Tabs
            <>
              {[
                { label: 'Popular', value: 'popular' },
                { label: 'Top Rated', value: 'top-rated' },
                { label: 'On The Air', value: 'on-the-air' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  className={`mr-3 px-4 py-2 rounded-full border ${tvTab === tab.value ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}
                  onPress={() => setTvTab(tab.value as TvTab)}
                >
                  <Text className={`font-semibold ${tvTab === tab.value ? 'text-white' : 'text-slate-400'}`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      {loading && !data.length ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id.toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-slate-500">No results found.</Text>
            </View>
          }
        />
      )}

      {/* Vibe Search Modal */}
      <VibeSearchModal
        visible={vibeModalVisible}
        onClose={() => setVibeModalVisible(false)}
      />
    </SafeAreaView>
  );
}
