import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    Animated,
    Image,
    ImageBackground,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RewardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock user points
    const points = 0;
    const nextLevelPoints = 100;
    const progress = points / nextLevelPoints;

    // Tier details
    const getTier = (pts: number) => {
        if (pts <= 100) return { name: 'Sprout', color: '#4CAF50', next: 'Gardener' };
        if (pts <= 500) return { name: 'Gardener', color: '#8BC34A', next: 'Harvest Master' };
        return { name: 'Harvest Master', color: '#FFD700', next: 'None' };
    };

    const tier = getTier(points);

    // Pulse Animation for CTA
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (points > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [points]);

    return (
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
            {/* Top Half - Soft Elegant Gradient Background with Pattern */}
            <LinearGradient
                colors={['#9edf7cff', '#8DC26F']} // Nature-inspired green gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.topSection, { paddingTop: insets.top + 10 }]}
            >
                <ImageBackground
                    source={require('../assets/images/veg_pattern.png')}
                    style={StyleSheet.absoluteFill}
                    imageStyle={{ opacity: 0.08, resizeMode: 'repeat' }}
                />

                {/* Header Actions */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </Pressable>
                    <Text style={[styles.brandText, { color: '#FFF' }]}>HealthyFood</Text>
                    <Pressable style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={24} color="#000" />
                    </Pressable>
                </View>

                {/* Hero Content with Progress Ring */}
                <View style={styles.heroContent}>
                    <View style={styles.progressContainer}>
                        {/* Circular Progress */}
                        <View style={styles.circleOuter}>
                            <Image
                                source={require('../assets/images/hero_rewards_v2.png')}
                                style={styles.heroImage}
                            />
                            {/* Visual Progress Ring */}
                            <View style={[styles.ring, { borderColor: tier.color, opacity: 0.4 }]} />
                            <View style={[styles.ringInner, { borderTopColor: tier.color, transform: [{ rotate: '45deg' }] }]} />
                        </View>

                        <View style={styles.pointsBadge}>
                            <Text style={styles.pointsCount}>{points}</Text>
                            <Text style={styles.pointsLabel}>POINTS</Text>
                        </View>
                    </View>

                    <Text style={styles.tierName}>{tier.name} Rank</Text>
                    <View style={styles.levelProgressBarContainer}>
                        <View style={[styles.levelProgressBar, { width: `${progress * 100}%`, backgroundColor: tier.color }]} />
                    </View>
                    <Text style={styles.nextLevelText}>
                        {points < 500 ? `${nextLevelPoints - points} points away from ${tier.next}!` : 'You are at the top!'}
                    </Text>
                </View>
            </LinearGradient>

            {/* Bottom Half - Cards with Glassmorphism */}
            <View style={styles.bottomSection}>
                <View style={styles.featuresContainer}>
                    {/* Feature 1 */}
                    <View style={styles.featureCard}>
                        <View style={styles.featureIconContainer}>
                            <Ionicons name="sparkles" size={32} color="#1E88E5" />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Earn Points</Text>
                            <Text style={styles.featureDesc}>Get points after every order you place with us</Text>
                        </View>
                    </View>

                    {/* Feature 2 */}
                    <View style={styles.featureCard}>
                        <View style={styles.featureIconContainer}>
                            <Ionicons name="ticket" size={32} color="#8E24AA" />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Get Discounts</Text>
                            <Text style={styles.featureDesc}>Points help you get discount on your next order</Text>
                        </View>
                    </View>

                    {/* Feature 3 */}
                    <View style={styles.featureCard}>
                        <View style={styles.featureIconContainer}>
                            <Ionicons name="gift" size={32} color="#FB8C00" />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Claim Gift Cards</Text>
                            <Text style={styles.featureDesc}>Use points to buy or claim exciting gift cards</Text>
                        </View>
                    </View>
                </View>

                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Pressable
                        style={[
                            styles.claimButton,
                            points === 0 && styles.claimButtonDisabled
                        ]}
                        disabled={points === 0}
                    >
                        <Text style={[
                            styles.claimButtonText,
                            points === 0 && styles.claimButtonTextDisabled
                        ]}>
                            {points === 0 ? 'Need more points' : 'Claim Rewards'}
                        </Text>
                    </Pressable>
                </Animated.View>

                <Pressable style={styles.giftCardBanner}>
                    <View style={styles.giftCardIconContainer}>
                        <Ionicons name="color-wand" size={24} color="#E8A317" />
                    </View>
                    <View style={styles.giftCardTextContainer}>
                        <Text style={styles.giftCardTitle}>Claim Gift Card</Text>
                        <Text style={styles.giftCardDesc}>Enter gift card details to claim your voucher</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </Pressable>

                <Text style={styles.footerText}>HEALTHY EATING{'\n'}RICH REWARDS</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    topSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    brandText: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    heroContent: {
        alignItems: 'center',
    },
    progressContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    circleOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    ring: {
        position: 'absolute',
        width: 174,
        height: 174,
        borderRadius: 87,
        borderWidth: 8,
    },
    ringInner: {
        position: 'absolute',
        width: 174,
        height: 174,
        borderRadius: 87,
        borderWidth: 8,
        borderColor: 'transparent',
    },
    pointsBadge: {
        position: 'absolute',
        bottom: -5,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    pointsCount: {
        fontSize: 24,
        fontWeight: '900',
        color: '#4CAF50', // Match theme
    },
    pointsLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#777',
        marginTop: -4,
    },
    tierName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    levelProgressBarContainer: {
        width: '80%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginTop: 12,
        marginBottom: 8,
        overflow: 'hidden',
    },
    levelProgressBar: {
        height: '100%',
        borderRadius: 4,
    },
    nextLevelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        opacity: 0.9,
    },
    bottomSection: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 20,
        paddingTop: 30,
        marginTop: -30,
        paddingBottom: 40,
    },
    featuresContainer: {
        marginBottom: 10,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.03)', // Very subtle tint
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    featureIconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#222',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
        lineHeight: 18,
    },
    claimButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    claimButtonDisabled: {
        backgroundColor: '#FFE0E0', // Soft coral/red background
        shadowOpacity: 0.1,
        elevation: 2,
    },
    claimButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    claimButtonTextDisabled: {
        color: '#b61010ff', // Clear red text for visibility
    },
    giftCardBanner: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 30,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    giftCardIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    giftCardTextContainer: {
        flex: 1,
    },
    giftCardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#333',
        marginBottom: 2,
    },
    giftCardDesc: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    footerText: {
        textAlign: 'center',
        color: '#E0E0E0',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 1,
        lineHeight: 30,
    },
});
