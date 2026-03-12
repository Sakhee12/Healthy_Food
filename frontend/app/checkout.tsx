import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

const RECOMMENDATIONS = [
    { id: '1', name: 'Free Cookie Box', weight: '90 g', price: 'FREE', mrp: '₹40', image: '🍪' },
    { id: '2', name: 'Sweet Karam Coffee Andhra Spicy Murukku', weight: '95 g', price: '₹85', mrp: '₹92', image: '🥨' },
];

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { totalAmount, itemCount } = useCart();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient colors={['#F5F5F5', '#FFFFFF']} style={StyleSheet.absoluteFill} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Best Deal Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Best deal on your cart</Text>
                    <View style={styles.dealCard}>
                        <View style={styles.dealMain}>
                            <View style={styles.dealImageWrapper}>
                                <Text style={styles.dealEmoji}>🍪</Text>
                            </View>
                            <View style={styles.dealInfo}>
                                <Text style={styles.dealName}>Free Cookie Box</Text>
                                <Text style={styles.dealWeight}>90 g</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.freeText}>FREE</Text>
                                    <Text style={styles.mrpText}>₹40</Text>
                                </View>
                            </View>
                            <Pressable style={styles.addButton}>
                                <Text style={styles.addButtonText}>ADD</Text>
                            </Pressable>
                        </View>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '40%' }]} />
                            </View>
                            <View style={styles.progressLabel}>
                                <Ionicons name="lock-closed" size={12} color="#673AB7" />
                                <Text style={styles.progressText}>Add eligible items worth ₹114 more.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Delivery Time Section */}
                <View style={styles.deliveryCard}>
                    <View style={styles.deliveryHeader}>
                        <View style={styles.deliveryIconCircle}>
                            <Ionicons name="time" size={20} color="#F57C00" />
                        </View>
                        <View>
                            <Text style={styles.deliveryTitle}>Delivery in 24 minutes</Text>
                            <Text style={styles.shipmentText}>Shipment of {itemCount} item</Text>
                        </View>
                    </View>
                    <View style={styles.deliveryItem}>
                        <View style={styles.itemImageWrapper}>
                            <Text style={styles.itemEmoji}>🥨</Text>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>Sweet Karam Coffee Andhra Spicy Murukku</Text>
                            <Text style={styles.itemWeight}>95 g</Text>
                            <Pressable>
                                <Text style={styles.wishlistText}>Move to wishlist</Text>
                            </Pressable>
                        </View>
                        <View style={styles.qtyContainer}>
                            <View style={styles.qtyBadge}>
                                <Ionicons name="remove" size={16} color="#FFF" />
                                <Text style={styles.qtyText}>1</Text>
                                <Ionicons name="add" size={16} color="#FFF" />
                            </View>
                            <View style={styles.itemPriceCol}>
                                <Text style={styles.oldPrice}>₹92</Text>
                                <Text style={styles.newPrice}>₹85</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Recommendations Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>You might also like</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        {RECOMMENDATIONS.map(item => (
                            <View key={item.id} style={styles.recCard}>
                                <View style={styles.recImageWrapper}>
                                    <Text style={styles.recEmoji}>{item.image}</Text>
                                    <View style={styles.heartIcon}>
                                        <Ionicons name="heart-outline" size={14} color="#666" />
                                    </View>
                                </View>
                                <Pressable style={styles.addSmall}>
                                    <Text style={styles.addSmallText}>ADD</Text>
                                </Pressable>
                                <View style={styles.recInfo}>
                                    <Text style={styles.recWeight}>{item.weight}</Text>
                                    <Text style={styles.recName} numberOfLines={2}>{item.name}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <Pressable 
                    style={styles.actionButton}
                    onPress={() => router.push('/address_details')}
                >
                    <Text style={styles.actionButtonText}>Choose address at next step</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#FFF',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
        color: '#333',
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A2E',
        marginBottom: 12,
    },
    dealCard: {
        backgroundColor: '#F3E5F5',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E1BEE7',
    },
    dealMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dealImageWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dealEmoji: {
        fontSize: 30,
    },
    dealInfo: {
        flex: 1,
        marginLeft: 12,
    },
    dealName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    dealWeight: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    freeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2E7D32',
    },
    mrpText: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#AAA',
    },
    addButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#2E7D32',
    },
    progressContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E1BEE7',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#FFF',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#9C27B0',
    },
    progressLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 6,
    },
    progressText: {
        fontSize: 12,
        color: '#673AB7',
        fontWeight: '600',
    },
    deliveryCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    deliveryIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#222',
    },
    shipmentText: {
        fontSize: 12,
        color: '#777',
    },
    itemImageWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deliveryItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemEmoji: {
        fontSize: 30,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    itemWeight: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    wishlistText: {
        fontSize: 12,
        color: '#666',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    qtyContainer: {
        alignItems: 'flex-end',
        gap: 8,
    },
    qtyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E7D32',
        borderRadius: 6,
        padding: 4,
        gap: 8,
    },
    qtyText: {
        color: '#FFF',
        fontWeight: '800',
    },
    itemPriceCol: {
        alignItems: 'flex-end',
    },
    oldPrice: {
        fontSize: 11,
        textDecorationLine: 'line-through',
        color: '#AAA',
    },
    newPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#000',
    },
    horizontalScroll: {
        gap: 12,
    },
    recCard: {
        width: 140,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    recImageWrapper: {
        height: 100,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recEmoji: {
        fontSize: 40,
    },
    heartIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
    },
    addSmall: {
        position: 'absolute',
        top: 80,
        right: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#2E7D32',
        elevation: 2,
    },
    addSmallText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#2E7D32',
    },
    recInfo: {
        marginTop: 12,
    },
    recWeight: {
        fontSize: 10,
        color: '#777',
    },
    recName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        marginTop: 2,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
});
