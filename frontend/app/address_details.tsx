// Address selection screen for checkout flow
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const ADDRESSES = [
    { id: '1', type: 'Home', address: 'B-102, Green Valley Apartments, Sector 45, Gurgaon, Haryana, 122003', icon: 'home' },
    { id: '2', type: 'Work', address: 'Tower C, DLF Cyber City, Phase 2, Gurgaon, Haryana, 122002', icon: 'business' },
    { id: '3', type: 'Other', address: 'Flat 405, Sky Heights, MG Road, Gurgaon, Haryana, 122001', icon: 'location' },
];

export default function AddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedId, setSelectedId] = useState('1');

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient colors={['#E8F5E9', '#FFFFFF']} style={StyleSheet.absoluteFill} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Select Address</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>SAVED ADDRESSES</Text>
                
                {ADDRESSES.map(item => (
                    <Pressable 
                        key={item.id} 
                        style={[styles.addressCard, selectedId === item.id && styles.selectedCard]}
                        onPress={() => setSelectedId(item.id)}
                    >
                        <View style={styles.addressHeader}>
                            <View style={styles.typeWrapper}>
                                <Ionicons name={item.icon as any} size={18} color="#2E7D32" />
                                <Text style={styles.typeText}>{item.type}</Text>
                            </View>
                            {selectedId === item.id && (
                                <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
                            )}
                        </View>
                        <Text style={styles.addressText}>{item.address}</Text>
                        <View style={styles.cardActions}>
                            <Pressable style={styles.actionBtn}>
                                <Text style={styles.actionBtnText}>EDIT</Text>
                            </Pressable>
                            <View style={styles.dot} />
                            <Pressable style={styles.actionBtn}>
                                <Text style={styles.actionBtnText}>SHARE</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ))}

                <Pressable style={styles.addNewCard}>
                    <Ionicons name="add-circle-outline" size={24} color="#2E7D32" />
                    <Text style={styles.addNewText}>Add New Address</Text>
                </Pressable>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <Pressable 
                    style={styles.proceedButton}
                    onPress={() => router.push('/payment')}
                >
                    <Text style={styles.proceedText}>Proceed to Payment</Text>
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
    subtitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#777',
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 8,
    },
    addressCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#2E7D32',
        backgroundColor: '#F1F8E9',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#333',
    },
    addressText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 16,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    actionBtn: {
        paddingVertical: 4,
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#2E7D32',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#999',
    },
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#2E7D32',
        gap: 10,
    },
    addNewText: {
        fontSize: 15,
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
    proceedButton: {
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
    },
    proceedText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFF',
    },
});
