import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

let WebView: any;
try {
    WebView = require('react-native-webview').WebView;
} catch (e) {
    console.warn('react-native-webview module missing');
}

import * as Location from 'expo-location';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

// רשימת הסניפים של CineBook
// רשימת הסניפים של CineBook
const CINEMA_BRANCHES = [
    {
        id: '1',
        name: 'CineBook Tel Aviv',
        lat: 32.0754,
        lng: 34.7757,
        address: 'Dizengoff Center, Tel Aviv',
        image: require('../../assets/cinemas/action_screen.jpg')
    },
    {
        id: '2',
        name: 'CineBook Rishon LeZion',
        lat: 31.9828,
        lng: 34.7715,
        address: 'Yes Planet, Rishon LeZion',
        image: require('../../assets/cinemas/yp_exterior.jpg')
    },
    {
        id: '3',
        name: 'CineBook Jerusalem',
        lat: 31.7830,
        lng: 35.2036,
        address: 'Cinema City, Jerusalem',
        image: require('../../assets/cinemas/cc_exterior.jpg')
    },
    {
        id: '4',
        name: 'CineBook Haifa',
        lat: 32.7877,
        lng: 35.0006,
        address: 'Grand Canyon, Haifa',
        image: require('../../assets/cinemas/lobby.jpg')
    },
    {
        id: '5',
        name: 'CineBook Glilot',
        lat: 32.1464,
        lng: 34.8043,
        address: 'Cinema City, Ramat HaSharon',
        image: require('../../assets/cinemas/screen_popcorn.jpg')
    },
    {
        id: '6',
        name: 'CineBook Zichron',
        lat: 32.5711,
        lng: 34.9567,
        address: 'Yes Planet, Zichron Yaakov',
        image: require('../../assets/cinemas/yp_exterior.jpg')
    },
    {
        id: '7',
        name: 'CineBook Beer Sheva',
        lat: 31.2268,
        lng: 34.7970,
        address: 'Yes Planet, Beer Sheva',
        image: require('../../assets/cinemas/yp_exterior.jpg')
    },
    {
        id: '8',
        name: 'CineBook Netanya',
        lat: 32.2922,
        lng: 34.8631,
        address: 'Cinema City, Netanya',
        image: require('../../assets/cinemas/cc_exterior.jpg')
    }
];

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; background-color: #050B26; }
        #map { width: 100%; height: 100vh; }
        .custom-popup .leaflet-popup-content-wrapper {
            background: #1e293b;
            color: #fff;
            border-radius: 8px;
            border: 1px solid #334155;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .custom-popup .leaflet-popup-tip {
            background: #1e293b;
        }
        .leaflet-bar a {
            background-color: #1e293b;
            color: #fff;
            border-bottom: 1px solid #334155;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // אתחול המפה
        const map = L.map('map', { zoomControl: false }).setView([32.0754, 34.7757], 10);
        
        // שכבת מפה כהה (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OSM &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // אייקון מותאם אישית (עיגול סגול זוהר)
        const ticketIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#6366f1;width:24px;height:24px;border-radius:12px;border:2px solid white;box-shadow:0 0 10px #6366f1;'></div>",
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // אייקון פעיל (גדול יותר וכתום)
        const activeIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#f59e0b;width:32px;height:32px;border-radius:16px;border:3px solid white;box-shadow:0 0 15px #f59e0b;'></div>",
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        // הוספת סניפים
        const branches = ${JSON.stringify(CINEMA_BRANCHES)};
        const markers = {};

        branches.forEach((b, index) => {
            const marker = L.marker([b.lat, b.lng], { icon: ticketIcon })
             .addTo(map)
             .bindPopup('<b>' + b.name + '</b><br>' + b.address, { className: 'custom-popup' });
            
            // הוספת ID למרקר כדי שנוכל להתייחס אליו אח"כ
            markers[index] = marker;

            marker.on('click', function() {
                // שליחת הודעה לאפליקציה שהמרקר נלחץ
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerClick', index: index }));
            });
        });

        // פונקציה להדגשת מרקר פעיל
        window.highlightMarker = function(index) {
            Object.values(markers).forEach(m => m.setIcon(ticketIcon)); // איפוס כולם
            if (markers[index]) {
                markers[index].setIcon(activeIcon);
                markers[index].openPopup();
                map.flyTo(markers[index].getLatLng(), 14, { duration: 1.5 });
            }
        };
    </script>
</body>
</html>
`;

export default function MapScreen() {
    const webViewRef = useRef<any>(null);
    const flatListRef = useRef<FlatList>(null);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    // התעדכנות במיקום המשתמש בטעינה
    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    setUserLocation(location.coords);
                }
            } catch (e) {
                console.log('Location permission error', e);
            }
        })();
    }, []);

    // סנכרון המפה כאשר הקרוסלה זזה
    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.highlightMarker(${activeIndex}); true;`);
        }
    }, [activeIndex]);

    const handleLocateMe = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'We need location access to find cinemas near you.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setUserLocation(location.coords);

            // הזרקת JavaScript למפה
            const jsCode = `
                map.flyTo([${latitude}, ${longitude}], 14);
                if (window.userMarker) {
                    window.userMarker.setLatLng([${latitude}, ${longitude}]);
                } else {
                    window.userMarker = L.marker([${latitude}, ${longitude}]).addTo(map).bindPopup("You are here").openPopup();
                }
            `;
            webViewRef.current?.injectJavaScript(jsCode);

        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Could not get your current location.');
        } finally {
            setLoading(false);
        }
    };

    const calculateDistance = (lat: number, lng: number) => {
        if (!userLocation) return null;

        // Haversine formula
        const R = 6371; // km
        const dLat = (lat - userLocation.latitude) * Math.PI / 180;
        const dLon = (lng - userLocation.longitude) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const openNavigation = (lat: number, lng: number, label: string) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    // טיפול בהודעות מה-WebView (לחיצה על מרקר)
    const onMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'markerClick') {
                setActiveIndex(data.index);
                flatListRef.current?.scrollToIndex({ index: data.index, animated: true });
            }
        } catch (e) {
            // Ignore
        }
    };

    const renderCinemaCard = ({ item, index }: { item: typeof CINEMA_BRANCHES[0], index: number }) => {
        const distance = calculateDistance(item.lat, item.lng);
        const isActive = index === activeIndex;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setActiveIndex(index);
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
                style={[
                    styles.card,
                    isActive && styles.activeCard
                ]}
            >
                {/* Full Background Image */}
                <Image source={item.image} style={styles.cardInfoImage} resizeMode="cover" />

                {/* Gradient Overlay for Text Readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(5, 11, 38, 0.9)', '#050B26']}
                    style={styles.gradientOverlay}
                    locations={[0, 0.6, 1]}
                />

                {/* Content sitting on top of the gradient */}
                <View style={styles.cardContent}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={[styles.cardTitle, isActive && { color: '#fbbf24' }]}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Ionicons name="location-sharp" size={14} color="#94a3b8" />
                            <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
                        </View>
                        {distance && (
                            <View style={styles.distanceContainer}>
                                <Text style={styles.distanceText}>{distance} km away</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.navigateButton}
                        onPress={() => openNavigation(item.lat, item.lng, item.name)}
                    >
                        <Ionicons name="navigate" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Active Indicator Strip */}
                {isActive && (
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, backgroundColor: '#fbbf24' }} />
                )}
            </TouchableOpacity>
        );
    };

    if (!WebView) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="map-marker-off" size={64} color="#64748b" />
                <Text style={{ color: 'white', marginTop: 16, fontSize: 18 }}>Map Module Missing</Text>
                <Text style={{ color: '#94a3b8', marginTop: 8 }}>Native build required.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: MAP_HTML }}
                style={styles.map}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={onMessage}
                onError={() => Alert.alert('Error', 'Failed to load map')}
            />

            {/* כותרת עליונה */}
            <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Find Cinema</Text>
                    <Text style={styles.headerSubtitle}>{CINEMA_BRANCHES.length} locations nearby</Text>
                </View>
            </SafeAreaView>

            {/* כפתור מיקום (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleLocateMe}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <MaterialCommunityIcons name="crosshairs-gps" size={28} color="#fff" />
                )}
            </TouchableOpacity>

            {/* קרוסלת סניפים */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={CINEMA_BRANCHES}
                    renderItem={renderCinemaCard}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingHorizontal: SPACING }}
                    onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
                        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < CINEMA_BRANCHES.length) {
                            setActiveIndex(newIndex);
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050B26' },
    map: { flex: 1, backgroundColor: '#050B26' },
    headerContainer: { position: 'absolute', top: 0, width: '100%', paddingHorizontal: 16 },
    headerContent: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // Slate 800/90
        padding: 16,
        borderRadius: 24,
        marginTop: 12, // Slight top margin
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },

    headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    headerSubtitle: { color: '#94a3b8', fontSize: 13 },

    fab: {
        position: 'absolute',
        bottom: 300, // Recalculated to be above carousel
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        zIndex: 20,
    },

    carouselContainer: {
        position: 'absolute',
        bottom: 100, // Raised above tab bar
        left: 0,
        right: 0,
        height: 180, // Height of the card + shadows
    },
    card: {
        width: CARD_WIDTH,
        marginHorizontal: SPACING / 2,
        backgroundColor: '#0f172a',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
        height: 160,
        position: 'relative',
    },
    activeCard: {
        borderColor: '#fbbf24', // Gold border when active
        transform: [{ scale: 1.02 }], // Subtle scale up
    },
    cardInfoImage: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 10
    },
    cardTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    cardAddress: {
        color: '#cbd5e1',
        fontSize: 13,
        marginLeft: 4,
        fontWeight: '500',
    },
    distanceContainer: {
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    distanceText: {
        color: '#fbbf24',
        fontSize: 11,
        fontWeight: '700',
    },
    navigateButton: {
        width: 44,
        height: 44,
        backgroundColor: '#3b82f6',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    }
});