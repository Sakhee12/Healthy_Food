import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { userPhone, logout, isLoggedIn } = useAuth();
    const [hideSensitive, setHideSensitive] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const renderListItem = (title: string, icon?: string, onPress?: () => void) => (
        <Pressable style={styles.listItem} onPress={onPress}>
            <View style={styles.listItemContent}>
                {icon && <Ionicons name={icon as any} size={20} color="#555" style={styles.listItemIcon} />}
                <Text style={styles.listItemText}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} bounces={true} showsVerticalScrollIndicator={false}>
                {/* Header/Top Section */}
                <LinearGradient
                    colors={['#e3fae5ff', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
                >
                    <View style={styles.headerTop}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </Pressable>
                    </View>
-
                    <View style={styles.profileInfoContainer}>
                        <View style={styles.profileAvatar}>
                            <Ionicons name="person" size={50} color="#444" />
                        </View>
                        <Text style={styles.profileName}>{isLoggedIn ? 'Welcome Back!' : 'Guest Account'}</Text>
                        {isLoggedIn && <Text style={styles.profilePhone}>{userPhone}</Text>}
                    </View>
                </LinearGradient>

                <View style={styles.contentContainer}>
                    {/* Birthday Banner */}
                    <View style={styles.birthdayBanner}>
                        <View style={styles.birthdayTextContainer}>
                            <Text style={styles.birthdayTitle}>Add your birthday</Text>
                            <Text style={styles.birthdayAction}>Enter details ▸</Text>
                        </View>
                        <Ionicons name="gift-outline" size={40} color="#E8A317" style={{ opacity: 0.5 }} />
                    </View>

                    {/* Top 3 Cards */}
                    <View style={styles.topCardsRow}>
                        <Pressable style={styles.topCard}>
                            <View style={styles.topCardIconWrapper}>
                                <Ionicons name="basket-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.topCardText}>Your orders</Text>
                        </Pressable>
                        <Pressable style={styles.topCard}>
                            <View style={styles.topCardIconWrapper}>
                                <Ionicons name="wallet-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.topCardText}>Healthy Money</Text>
                        </Pressable>
                        <Pressable style={styles.topCard}>
                            <View style={styles.topCardIconWrapper}>
                                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.topCardText}>Need help?</Text>
                        </Pressable>
                    </View>

                    {/* App Update Card */}
                    <Pressable style={styles.bannerCard}>
                        <Ionicons name="phone-portrait-outline" size={24} color="#555" />
                        <View style={styles.bannerCardTextContainer}>
                            <Text style={styles.bannerCardSubtitle}>bug fixes and improvements</Text>
                        </View>
                        <Text style={styles.versionText}>v17.83.2</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: 8 }} />
                    </Pressable>

                    {/* Appearance Card */}
                    <Pressable style={styles.bannerCard}>
                        <Ionicons name="sunny-outline" size={24} color="#555" />
                        <View style={styles.bannerCardTextContainer}>
                            <Text style={styles.bannerCardTitle}>Appearance</Text>
                        </View>
                        <Text style={styles.appearanceValue}>LIGHT</Text>
                        <Ionicons name="chevron-down" size={16} color="#ccc" style={{ marginLeft: 4 }} />
                    </Pressable>

                    {/* Hide Sensitive Items */}
                    <View style={styles.bannerCard}>
                        <Ionicons name="eye-off-outline" size={24} color="#278A22" />
                        <View style={styles.bannerCardTextContainer}>
                            <Text style={styles.bannerCardTitle}>Hide sensitive items</Text>
                            <Text style={styles.bannerCardSubtitle}>Sexual wellness, nicotine products and other sensitive items will be hidden</Text>
                            <Text style={styles.knowMoreText}>Know more</Text>
                        </View>
                        <Switch
                            value={hideSensitive}
                            onValueChange={setHideSensitive}
                            trackColor={{ false: '#e0e0e0', true: '#278A22' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Sections */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Your information</Text>
                        <View style={styles.listContainer}>
                            {renderListItem('Address book', 'book-outline')}
                            {renderListItem('Bookmarked recipes', 'receipt-outline')}
                            {renderListItem('Your wishlist', 'heart-outline')}
                            {renderListItem('GST details', 'document-text-outline')}
                            {renderListItem('E-gift cards', 'gift-outline')}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Payment and coupons</Text>
                        <View style={styles.listContainer}>
                            {renderListItem('Healthy Money', 'wallet-outline')}
                            {renderListItem('Payment settings', 'card-outline')}
                            {renderListItem('Claim Gift card', 'gift-outline')}
                            {renderListItem('Your collected rewards', 'ticket-outline')}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Feeding India</Text>
                        <View style={styles.listContainer}>
                            {renderListItem('Your impact', 'leaf-outline')}
                            {renderListItem('Get Feeding India receipt', 'receipt-outline')}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Other Information</Text>
                        <View style={styles.listContainer}>
                            {renderListItem('Share the app', 'share-social-outline')}
                            {renderListItem('About us', 'information-circle-outline')}
                            {renderListItem('Account privacy', 'lock-closed-outline')}
                            {renderListItem('Notification preferences', 'notifications-outline')}
                            {renderListItem('Log out', 'log-out-outline', handleLogout)}
                        </View>
                    </View>

                    {/* Footer Logo */}
                    <View style={styles.footerLogoContainer}>
                        <Text style={styles.footerLogoText}>HealthyFood</Text>
                        <Text style={styles.footerVersionText}>v17.83.1</Text>
                    </View>
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8', // Light grey app background
    },
    headerGradient: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileInfoContainer: {
        alignItems: 'center',
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4,
    },
    profilePhone: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    birthdayBanner: {
        flexDirection: 'row',
        backgroundColor: '#FFF7E0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    birthdayTextContainer: {
        flex: 1,
    },
    birthdayTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    birthdayAction: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#278A22',
    },
    topCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    topCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    topCardIconWrapper: {
        marginBottom: 8,
    },
    topCardText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    bannerCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    bannerCardTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    bannerCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    bannerCardSubtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
        lineHeight: 16,
    },
    versionText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#20B2AA', // teal
    },
    appearanceValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
        letterSpacing: 1,
    },
    knowMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#278A22',
        marginTop: 4,
    },
    sectionContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        marginLeft: 4,
    },
    listContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemIcon: {
        marginRight: 16,
        width: 24,
    },
    listItemText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    footerLogoContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    footerLogoText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#CCC',
        letterSpacing: -1,
    },
    footerVersionText: {
        fontSize: 12,
        color: '#AAA',
        fontWeight: '500',
        marginTop: 4,
    },
});
