import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CartScreen() {
    const { cartItems, updateQuantity, totalAmount, itemCount, clearCart } = useCart();
    const { isLoggedIn } = useAuth();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleProceed = () => {
        if (!isLoggedIn) {
            router.push({
                pathname: '/login',
                params: { redirect: 'checkout' }
            });
        } else {
            router.push('/checkout');
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.cartItemCard}>
            <View style={styles.itemImageContainer}>
                <Text style={styles.itemPlaceholder}>{item.image}</Text>
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemWeight}>{item.weight}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <View style={styles.quantityControls}>
                <Pressable 
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.qtyButton}
                >
                    <Ionicons name="remove" size={18} color="#2E7D32" />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable 
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.qtyButton}
                >
                    <Ionicons name="add" size={18} color="#2E7D32" />
                </Pressable>
            </View>
        </View>
    );

    if (itemCount === 0) {
        return (
            <View style={styles.emptyContainer}>
                <LinearGradient
                    colors={['#E8F5E9', '#FFFFFF']}
                    style={StyleSheet.absoluteFill}
                />
                <Ionicons name="cart-outline" size={100} color="#CCC" />
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>Fill it with fresh and healthy picks!</Text>
                <Pressable 
                    style={styles.shopButton}
                    onPress={() => router.push('/home')}
                >
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient
                colors={['#E8F5E9', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Checkout</Text>
                <Pressable onPress={clearCart}>
                    <Text style={styles.clearText}>Clear All</Text>
                </Pressable>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 250 }]}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                    <View style={styles.billDetails}>
                        <Text style={styles.sectionTitle}>Bill Details</Text>
                        <View style={styles.billRow}>
                            <View style={styles.billLabelRow}>
                                <Ionicons name="document-text-outline" size={16} color="#666" />
                                <Text style={styles.billLabel}>Item Total</Text>
                            </View>
                            <Text style={styles.billValue}>₹{totalAmount}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <View style={styles.billLabelRow}>
                                <Ionicons name="bicycle-outline" size={16} color="#666" />
                                <Text style={styles.billLabel}>Delivery Charge</Text>
                            </View>
                            <Text style={[styles.billValue, { color: '#2E7D32' }]}>FREE</Text>
                        </View>
                        <View style={[styles.billRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹{totalAmount}</Text>
                        </View>
                    </View>
                )}
            />

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.paymentInfo}>
                    <View style={styles.paymentMethod}>
                        <Ionicons name="card" size={20} color="#333" />
                        <Text style={styles.methodText}>PAY USING CARD</Text>
                    </View>
                    <Text style={styles.totalSummary}>₹{totalAmount} Total</Text>
                </View>
                <Pressable 
                    style={styles.proceedButton}
                    onPress={handleProceed}
                >
                    <Text style={styles.proceedText}>Proceed to Buy</Text>
                    <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#777',
        marginTop: 10,
        textAlign: 'center',
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
    },
    shopButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111',
    },
    clearText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#D32F2F',
    },
    listContent: {
        padding: 16,
    },
    cartItemCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemImageContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPlaceholder: {
        fontSize: 30,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },
    itemWeight: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#000',
        marginTop: 4,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        padding: 4,
    },
    qtyButton: {
        padding: 6,
    },
    qtyText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#2E7D32',
        paddingHorizontal: 10,
    },
    billDetails: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    billLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
    },
    paymentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    methodText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#333',
    },
    totalSummary: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
    },
    proceedButton: {
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    proceedText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
    },
});
