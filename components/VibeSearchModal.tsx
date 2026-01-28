import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { searchByVibe } from '../constants/api';

const { width, height } = Dimensions.get('window');

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    aiReason?: string;
    vote_average: number;
}

interface VibeSearchModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function VibeSearchModal({ visible, onClose }: VibeSearchModalProps) {
    const [prompt, setPrompt] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const data = await searchByVibe(prompt);
            setResults(data);
            if (data.length === 0) {
                setError('No movies found matching that vibe. Try something else!');
            }
        } catch (err) {
            setError('Failed to connect to AI. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderMovie = ({ item }: { item: Movie }) => (
        <View style={styles.movieCard}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.poster}
            />
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{item.title}</Text>

                {/* AI Reason Badge */}
                {item.aiReason && (
                    <LinearGradient
                        colors={['#4f46e5', '#9333ea']}
                        style={styles.aiReasonContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="sparkles" size={12} color="white" style={{ marginRight: 4 }} />
                        <Text style={styles.aiReasonText}>{item.aiReason}</Text>
                    </LinearGradient>
                )}

                <Text style={styles.overview} numberOfLines={3}>{item.overview}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.rating}>{item.vote_average?.toFixed(1)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Blurry Background Effect via absolute layout and opacity */}
                <View style={styles.backdrop}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
                </View>

                <LinearGradient
                    colors={['#1e1b4b', '#0f172a']}
                    style={styles.content}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <LinearGradient
                                colors={['#F59E0B', '#F43F5E']}
                                style={styles.iconContainer}
                            >
                                <Ionicons name="sparkles" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.title}>Vibe Search</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Describe the exact movie vibe you're looking for...
                    </Text>

                    {/* Search Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., '90s action movie with a happy ending'"
                            placeholderTextColor="#64748b"
                            value={prompt}
                            onChangeText={setPrompt}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Results or Empty State */}
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <FlatList
                        data={results}
                        renderItem={renderMovie}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            !loading && !error && results.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="color-wand-outline" size={48} color="#334155" />
                                    <Text style={styles.emptyText}>Tap the magic wand to find movies using AI</Text>
                                </View>
                            ) : null
                        }
                    />
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        height: height * 0.85,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingTop: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 15,
        marginBottom: 24,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 6,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 24,
    },
    input: {
        flex: 1,
        color: 'white',
        paddingHorizontal: 16,
        fontSize: 16,
        height: 50,
    },
    searchButton: {
        width: 50,
        height: 50,
        backgroundColor: '#6366f1',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 40,
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
    },
    movieInfo: {
        flex: 1,
        padding: 12,
    },
    movieTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    aiReasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    aiReasonText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    overview: {
        color: '#94a3b8',
        fontSize: 13,
        marginBottom: 8,
        lineHeight: 18,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
    },
    rating: {
        color: '#fbbf24',
        marginLeft: 4,
        fontWeight: 'bold',
        fontSize: 13,
    },
    errorText: {
        color: '#f87171',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.5,
    },
    emptyText: {
        color: '#94a3b8',
        marginTop: 16,
        fontSize: 16,
    },
});
