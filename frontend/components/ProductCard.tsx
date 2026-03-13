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
    image2?: string | null;
    image3?: string | null;
    expiry_date?: string | null;
    rating: number;
    mrp: number;
    discountPrice?: number | null;
    description: string | null;
    categoryId?: number | null;
    containerStyle?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    weight,
    price,
    image,
    image2,
    image3,
    expiry_date,
    rating,
    mrp,
    discountPrice,
    description,
    categoryId,
    containerStyle
}) => {
    const router = useRouter();
    const { addToCart, cartItems } = useCart();
    const cardRef = React.useRef<View>(null);

    const isInCart = cartItems.some(item => item.id === id);

    const [isLiked, setIsLiked] = React.useState(false);
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
                        // Pass additional images if available
                        image2: image2 || '',
                        image3: image3 || '',
                        expiryDate: expiry_date || '',
                        categoryId: categoryId?.toString() || '',
                        rating: rating.toString(),
                        description: description || '',
                        originX: centerX.toString(),
                        originY: centerY.toString()
                    }
                });
            });
        }
    };

    const handleAction = (e: any) => {
        e.stopPropagation();
        if (isInCart) {
            router.push('/cart');
        } else {
            addToCart({ id, name, weight, price, image });
        }
    };

    const toggleLike = (e: any) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const hasDiscount = discountPrice && discountPrice < mrp;

    return (
        <Pressable
            ref={cardRef as any}
            style={[styles.card, containerStyle]}
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

                {/* Heart / Like Button */}
                <Pressable
                    onPress={toggleLike}
                    style={styles.heartButton}
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? "#FF4B4B" : "#666"}
                    />
                </Pressable>
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
                        <View style={styles.priceColumn}>
                            <Text style={styles.price}>₹{discountPrice || mrp}</Text>
                            {hasDiscount && (
                                <Text style={styles.mrp}>{mrp}</Text>
                            )}
                        </View>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={10} color={Colors.healthy.yellow} />
                            <Text style={styles.ratingValue}>{rating || '0.0'}</Text>
                        </View>
                    </View>
                    <Pressable
                        style={[styles.addButton, isInCart && styles.viewButton]}
                        onPress={handleAction}
                    >
                        <Text style={[styles.addButtonText, isInCart && styles.viewButtonText]}>
                            {isInCart ? 'VIEW' : 'ADD'}
                        </Text>
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
        width: 140,
        height: 280,
        marginVertical: 8,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 120,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        fontSize: 14,
        fontWeight: '900',
        color: '#000',
    },
    priceColumn: {
        flexDirection: 'column',
    },
    mrp: {
        fontSize: 10,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2,
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
    viewButton: {
        backgroundColor: Colors.healthy.successGreen,
        borderColor: Colors.healthy.successGreen,
    },
    viewButtonText: {
        color: Colors.healthy.white,
    }
});
