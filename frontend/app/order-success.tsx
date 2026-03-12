import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function OrderSuccessScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient colors={['#1B5E20', '#2E7D32', '#43A047']} style={StyleSheet.absoluteFill} />
            
            <Animated.View style={[
                styles.content, 
                { 
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                    opacity: opacityAnim
                }
            ]}>
                <View style={styles.successCircle}>
                    <Ionicons name="checkmark-circle" size={100} color="#FFF" />
                </View>
                
                <Text style={styles.yayText}>Yayyy! Order Placed</Text>
                
                <View style={styles.timerCard}>
                    <Text style={styles.timerTitle}>Delivery arriving in</Text>
                    <Text style={styles.timerMinutes}>18 minutes</Text>
                    <View style={styles.trackerContainer}>
                        <View style={styles.trackerLine}>
                            <View style={[styles.trackerFill, { width: '30%' }]} />
                            <View style={styles.trackerNodeActive} />
                            <View style={[styles.trackerNode, { left: '33.3%' }]} />
                            <View style={[styles.trackerNode, { left: '66.6%' }]} />
                            <View style={[styles.trackerNode, { left: '100%' }]} />
                        </View>
                        <View style={styles.trackerLabels}>
                            <Text style={styles.activeLabel}>Placed</Text>
                            <Text style={styles.inactiveLabel}>Packed</Text>
                            <Text style={styles.inactiveLabel}>On its way</Text>
                        </View>
                    </View>
                </View>

                <Pressable 
                    style={styles.homeButton}
                    onPress={() => {
                        // Navigate to root which redirects to /(tabs)/home
                        router.navigate('/');
                    }}
                >
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    successCircle: {
        marginBottom: 20,
    },
    yayText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 40,
    },
    timerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    timerTitle: {
        fontSize: 16,
        color: '#E8F5E9',
        fontWeight: '600',
    },
    timerMinutes: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFF',
        marginTop: 8,
    },
    trackerContainer: {
        width: '100%',
        marginTop: 30,
    },
    trackerLine: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        position: 'relative',
    },
    trackerFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    trackerNodeActive: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFF',
        position: 'absolute',
        top: -4,
        left: '28%',
    },
    trackerNode: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        position: 'absolute',
        top: -2,
    },
    trackerLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    activeLabel: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    inactiveLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    homeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30,
        marginTop: 50,
    },
    homeButtonText: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: '800',
    },
});
