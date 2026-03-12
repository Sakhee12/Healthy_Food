import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { BASE_URL } from '@/api/api';

interface ProductCardProps {
    id: string;
    name: string;
    weight: string;
    price: string;
    image: string;
    rating: number;
    mrp: number;
    discountPrice?: number | null;
    description: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    weight,
    price,
    image,
    rating,
    mrp,
    discountPrice,
    description
}) => {
    const router = useRouter();
    const { addToCart } = useCart();
    const cardRef = React.useRef<View>(null);

    const [imgError, setImgError] = React.useState(false);

    const isEmoji = !image.startsWith('/');
    const imageUrl = isEmoji ? null : `${BASE_URL.replace('/api', '')}${image}`;

    const handlePress = () => {
        if (cardRef.current) {
            cardRef.current.measure((x, y, width, height, pageX, pageY) => {
                const centerX = pageX + width / 2;
                const centerY = pageY + height / 2;
                
                router.push({
                    pathname: '/product/[id]',
                    params: { 
                        id, 
                        name, 
                        weight, 
                        mrp: mrp.toString(),
                        discountPrice: (discountPrice || mrp).toString(),
                        image, 
                        rating: rating.toString(),
                        description: description || '',
                        originX: centerX.toString(),
                        originY: centerY.toString()
                    }
                });
            });
        }
    };

    const handleAdd = (e: any) => {
        e.stopPropagation();
        addToCart({ id, name, weight, price, image });
    };

    const hasDiscount = discountPrice && discountPrice < mrp;

    return (
        <Pressable 
            ref={cardRef as any}
            style={styles.card} 
            onPress={handlePress}
        >
            <View style={styles.imageContainer}>
                {isEmoji || imgError ? (
                    <Text style={styles.placeholderImage}>{isEmoji ? image : '🍎'}</Text>
                ) : (
                    <Image 
                        source={{ uri: imageUrl! }} 
                        style={styles.productImage} 
                        resizeMode="contain"
                        onError={() => setImgError(true)}
                    />
                )}
            </View>

            <View style={styles.details}>
                <View style={styles.badges}>
                    <View style={styles.timeBadge}>
                        <Ionicons name="timer-outline" size={10} color="#666" />
                        <Text style={styles.badgeText}>13 MINS</Text>
                    </View>
                </View>

                <Text style={styles.name} numberOfLines={2}>{name}</Text>
                <Text style={styles.weight}>{weight}</Text>

                <View style={styles.footer}>
                    <View>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>{price}</Text>
                            {hasDiscount && (
                                <Text style={styles.mrp}>₹{mrp}</Text>
                            )}
                        </View>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={10} color={Colors.healthy.yellow} />
                            <Text style={styles.ratingValue}>{rating}</Text>
                        </View>
                    </View>
                    <Pressable style={styles.addButton} onPress={handleAdd}>
                        <Text style={styles.addButtonText}>ADD</Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.healthy.white,
        borderRadius: 12,
        width: 156,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 140,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderImage: {
        fontSize: 70,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    details: {
        padding: 8,
    },
    badges: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    badgeText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#666',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
        height: 34,
        lineHeight: 17,
        marginBottom: 2,
    },
    weight: {
        fontSize: 11,
        color: '#777',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 13,
        fontWeight: '900',
        color: '#000',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    mrp: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: '#999',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingValue: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
    },
    addButton: {
        backgroundColor: Colors.healthy.white,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.healthy.successGreen,
        shadowColor: Colors.healthy.successGreen,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '900',
        color: Colors.healthy.successGreen,
    },
});
