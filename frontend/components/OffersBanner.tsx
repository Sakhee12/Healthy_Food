import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { HoliBanner } from "./HoliBanner";

interface OffersBannerProps {
    category: string;
}

export const OffersBanner: React.FC<OffersBannerProps> = ({ category }) => {
    const isRamzan = category.toLowerCase() === 'ramzan';
    const isKids = category.toLowerCase() === 'kids';
    const isImported = category.toLowerCase() === 'imported';
    const isAll = category.toLowerCase() === 'all';

    return (
        <View style={styles.container}>
            <View style={[
                styles.banner,
                isRamzan && styles.ramzanBanner,
                isKids && styles.kidsBanner,
                isImported && styles.importedBanner,
            ]}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {isRamzan ? 'Ramzan' : isKids ? 'BABY ON BOARD' : isImported ? 'IMPORTED STORE' : 'WELCOME'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isRamzan ? 'MUBARAK' : isKids ? 'Top Deals' : isImported ? 'Newly launched favourites' : 'Order healthy &\nenjoy fresh food'}
                    </Text>
                    {!isKids && !isImported && (
                        <Pressable style={styles.button}>
                            <Text style={styles.buttonText}>Offers for You</Text>
                        </Pressable>
                    )}
                </View>
                {category.toLowerCase() === "holi" ? (
                    <HoliBanner />
                ) : isAll ? (
                    <View style={styles.imageContainer}>
                        <LottieView
                            source={require('@/assets/animations/food.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    </View>
                ) : isRamzan ? (
                    <View style={styles.imageContainer}>
                        <LottieView
                            source={require('@/assets/animations/ramzan.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    </View>
                ) : (
                    <View style={styles.imageContainer}>
                        <View style={styles.illustration}>
                            <Text style={{ fontSize: 60 }}>
                                {isRamzan ? "🌙" : isKids ? "🍼" : isImported ? "🍫" : "🥗"}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginVertical: 12,
    },
    banner: {
        backgroundColor: '#FFF8E1',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        minHeight: 140,
    },
    ramzanBanner: {
        backgroundColor: '#E0F2E9',
    },
    kidsBanner: {
        backgroundColor: '#E3F2FD',
    },
    importedBanner: {
        backgroundColor: '#F5F0E1',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '900',
        color: '#444',
        letterSpacing: 1,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#222',
        lineHeight: 28,
        marginBottom: 12,
    },
    button: {
        backgroundColor: Colors.healthy.yellow,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#333',
    },
    imageContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        alignItems: 'center',
        transform: [{ rotate: '5deg' }],
    },
    lottie: {
        width: 120,
        height: 120,
    },
});
