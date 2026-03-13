import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeScreenHeaderProps {
    activeCategory: string;
}

export const HomeScreenHeader: React.FC<HomeScreenHeaderProps> = ({ activeCategory }) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const getGradientColors = () => {
        switch (activeCategory.toLowerCase()) {
            case 'holi': return Colors.gradients.holi;
            case 'ramzan': return Colors.gradients.ramzan;
            case 'kids': return Colors.gradients.kids;
            case 'gifting': return Colors.gradients.gifting;
            case 'imported': return Colors.gradients.imported;
            case 'kuch bhi': return Colors.gradients.kuchBhi;
            default: return Colors.gradients.all;
        }
    };

    const isLightBackground = ['ramzan', 'kids', 'imported', 'all'].includes(activeCategory.toLowerCase());
    const textColor = isLightBackground ? '#000' : Colors.healthy.white;
    const mutedColor = isLightBackground ? '#666' : Colors.healthy.mutedText;

    return (
        <LinearGradient
            colors={getGradientColors() as any}
            style={[styles.container, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.topRow}>
                <View style={styles.leftCol}>
                    <Text style={[styles.brandPrefix, { color: textColor }]}>HealthyFood in</Text>
                    <Text style={[styles.deliveryTime, { color: textColor }]}>13 minutes</Text>
                    <Pressable style={styles.locationRow}>
                        <Text style={[styles.address, { color: textColor }]} numberOfLines={1}>
                            Kate Wasti, Punawale, Pune
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={textColor} />
                    </Pressable>
                </View>
                <View style={styles.iconRow}>
                    <Pressable style={styles.rewardButton} onPress={() => router.push('/reward')}>
                        <View style={styles.rewardBadge}>
                            <Text style={styles.rewardText}>₹0</Text>
                        </View>
                        <Ionicons name="cash-outline" size={24} color={textColor} />
                    </Pressable>
                    <Pressable style={styles.profileIcon} onPress={() => router.push('/profile')}>
                        <Ionicons name="person" size={24} color={isLightBackground ? '#000' : Colors.healthy.primary} />
                    </Pressable>
                </View>
            </View>

            <Pressable 
                style={styles.searchContainer} 
                onPress={() => router.push('/search')}
            >
                <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
                <Text style={styles.searchPlaceholder}>Search "organic honey"</Text>
                <View style={styles.searchDivider} />
                <Ionicons name="mic-outline" size={20} color="#333" style={styles.micIcon} />
            </Pressable>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    leftCol: {
        flex: 1,
    },
    brandPrefix: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: -2,
    },
    deliveryTime: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    address: {
        fontSize: 14,
        fontWeight: '600',
        maxWidth: 200,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rewardButton: {
        alignItems: 'center',
        position: 'relative',
    },
    rewardBadge: {
        position: 'absolute',
        bottom: -6,
        backgroundColor: '#444',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
        zIndex: 1,
    },
    rewardText: {
        color: Colors.healthy.white,
        fontSize: 8,
        fontWeight: '900',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.healthy.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    searchDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#eee',
        marginHorizontal: 10,
    },
    micIcon: {
        marginLeft: 0,
    },
});
