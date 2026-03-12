import { Colors } from '@/constants/theme';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const HoliBanner: React.FC = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f086cdff', '#f7dcf8ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>HAPPY HOLI</Text>
                    <Text style={styles.subtitle}>
                        In this Holi enjoy color and eat healthy
                    </Text>
                </View>

                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../assets/animations/holi.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginVertical: 12,
    },
    banner: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        minHeight: 160,
        elevation: 8,
        shadowColor: '#dd7c84ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 22,
    },
    animationContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});
