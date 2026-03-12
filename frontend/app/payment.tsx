import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const PAYMENT_METHODS = [
    { 
        id: '1', 
        title: 'UPI', 
        icon: 'flash', 
        methods: [
            { id: 'upi1', name: 'Google Pay', icon: 'logo-google', color: '#4285F4' },
            { id: 'upi2', name: 'PhonePe', icon: 'wallet', color: '#5f259f' },
            { id: 'upi3', name: 'Add New UPI ID', icon: 'add', color: '#666' }
        ]
    },
    { 
        id: '2', 
        title: 'CARDS', 
        icon: 'card',
        methods: [
            { id: 'card1', name: 'Add New Card', icon: 'add-circle', sub: 'Save card for faster checkout', color: '#2E7D32' }
        ]
    },
    { 
        id: '3', 
        title: 'WALLETS', 
        icon: 'wallet',
        methods: [
            { id: 'w1', name: 'Blinkit Wallet', icon: 'cash', balance: '₹0', color: '#E91E63' },
            { id: 'w2', name: 'Paytm', icon: 'wallet', color: '#00BAF2' }
        ]
    },
    { 
        id: '4', 
        title: 'CASH', 
        icon: 'cash',
        methods: [
            { id: 'cash1', name: 'Cash on Delivery', icon: 'hand-left', sub: 'Pay at your doorstep', color: '#333' }
        ]
    }
];

export default function PaymentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedId, setSelectedId] = useState('upi1');

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient colors={['#F1F8E9', '#FFFFFF', '#E8F5E9']} style={StyleSheet.absoluteFill} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <View>
                    <Text style={styles.headerTitle}>Payments</Text>
                    <Text style={styles.headerSubtitle}>Amount to pay: ₹112</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {PAYMENT_METHODS.map(section => (
                    <View key={section.id} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={18} color="#666" />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>

                        <View style={styles.methodsCard}>
                            {section.methods.map((method, idx) => (
                                <View key={method.id}>
                                    <Pressable 
                                        style={styles.methodItem}
                                        onPress={() => setSelectedId(method.id)}
                                    >
                                        <View style={[styles.iconBox, { backgroundColor: method.color + '15' }]}>
                                            <Ionicons name={method.icon as any} size={22} color={method.color} />
                                        </View>
                                        <View style={styles.methodDetails}>
                                            <Text style={styles.methodName}>{method.name}</Text>
                                            {(method as any).sub && <Text style={styles.methodSub}>{(method as any).sub}</Text>}
                                            {(method as any).balance && <Text style={styles.methodSub}>Balance: {(method as any).balance}</Text>}
                                        </View>
                                        <View style={[styles.radio, selectedId === method.id && styles.radioActive]}>
                                            {selectedId === method.id && <View style={styles.radioInner} />}
                                        </View>
                                    </Pressable>
                                    {idx < section.methods.length - 1 && <View style={styles.separator} />}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.safetyBox}>
                    <Ionicons name="shield-checkmark" size={24} color="#2E7D32" />
                    <Text style={styles.safetyText}>Secure and encrypted payments</Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <Pressable 
                    style={styles.payButton}
                    onPress={() => router.replace('/order-success')}
                >
                    <View style={styles.payButtonContent}>
                        <View>
                            <Text style={styles.payAmount}>₹112</Text>
                            <Text style={styles.payAmountTotal}>TOTAL AMOUNT</Text>
                        </View>
                        <View style={styles.payAction}>
                            <Text style={styles.payText}>Place Order</Text>
                            <Ionicons name="lock-closed" size={18} color="#FFF" />
                        </View>
                    </View>
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
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#111',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#2E7D32',
        fontWeight: '700',
        marginTop: 2,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#666',
        letterSpacing: 0.5,
    },
    methodsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodDetails: {
        flex: 1,
        marginLeft: 16,
    },
    methodName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    methodSub: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: '#2E7D32',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2E7D32',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 76,
    },
    safetyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        opacity: 0.6,
    },
    safetyText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
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
    payButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 16,
        padding: 4,
    },
    payButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 20,
    },
    payAmount: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
    },
    payAmountTotal: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '800',
    },
    payAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    payText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFF',
    },
});
