import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
// Lottie is great, but requires an asset. We'll use a local image/logo for simplicity if json is missing, 
// or I can check if I have a clear path to adding a json asset. The user asked for animation.
// I will simulate the animation effect with standard Animated API for now to avoid needing a JSON file I don't have,
// but I will setup the structure for it so it looks premium. 
// Actually, I can use the new logo and animate IT with Reanimated or standard Animated.

const slides = [
    {
        id: '1',
        title: 'Welcome to CineBook',
        description: 'The premium way to book your movie tickets in seconds.',
        image: require('../assets/images/onboarding_1.png'),
    },
    {
        id: '2',
        title: 'Real-Time Booking',
        description: 'See which seats are locked by others instantly. No more double bookings.',
        image: require('../assets/images/onboarding_2.png'),
    },
    {
        id: '3',
        title: 'AI Vibe Check',
        description: 'Not sure what to watch? Let our AI suggest the perfect movie.',
        image: require('../assets/images/onboarding_3.png'),
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // We need to manage state for index to show Next/Get Started button properly
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;



    const handleNext = async () => {
        if (currentIndex < slides.length - 1) {
            // @ts-ignore
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            try {
                await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            } catch (e) {
                console.log('Error saving onboarding status', e);
            }
            router.replace('/login');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => (
                        <View style={[styles.item, { width }]}>
                            <Animated.Image
                                source={item.image}
                                style={[styles.image, { resizeMode: 'contain' }]}
                            />
                            <View style={{ flex: 0.3 }}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <Paginator data={slides} scrollX={scrollX} />

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleNext} style={styles.button}>
                    <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const Paginator = ({ data, scrollX }: any) => {
    const { width } = useWindowDimensions();
    return (
        <View style={{ flexDirection: 'row', height: 64, justifyContent: 'center' }}>
            {data.map((_: any, i: number) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
            })}
        </View>
    );
};

import { useState } from 'react';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050B26',
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
        width: '80%',
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    description: {
        fontWeight: '300',
        color: '#94a3b8',
        textAlign: 'center',
        paddingHorizontal: 30,
        fontSize: 16
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3b82f6',
        marginHorizontal: 8,
    },
    footer: {
        flex: 0.5, // Reduced from 1 to keep elements tighter
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 50
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
