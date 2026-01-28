import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

export const SplashScreen = () => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Parallel animation sequence
        Animated.parallel([
            // 1. Logo Entrance
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            // 2. Text Entrance (delayed)
            Animated.sequence([
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateY, {
                        toValue: 0,
                        friction: 6,
                        useNativeDriver: true,
                    })
                ])
            ])
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
                    <Image
                        source={require('../assets/images/android-icon-foreground.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.Text style={[styles.brandText, { opacity, transform: [{ translateY }] }]}>
                    CineBook
                </Animated.Text>
            </View>

            <View style={styles.footer}>
                <Animated.Text style={[styles.tagline, { opacity }]}>
                    Your Cinema Journey Starts Here
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050B26',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logo: {
        width: 180,
        height: 180,
        borderRadius: 90, // Make it circular to hide white corners
    },
    brandText: {
        fontSize: 42,
        fontWeight: '900', // Heavy bold
        color: '#ffffff',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
    },
    tagline: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
