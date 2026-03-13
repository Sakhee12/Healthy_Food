import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProducts, Product } from '@/api/product';
import { ProductCard } from '@/components/ProductCard';
import { BASE_URL } from '@/api/api';

const { width, height: screenHeight } = Dimensions.get('window');

const RECIPES = [
    { id: 'r1', name: 'Lemon Cilantro Fish Curry', image: '🥘' },
    { id: 'r2', name: 'Carrot and Coriander Soup', image: '🍲' },
    { id: 'r3', name: 'Lemon Coriander Soup', image: '🥣' },
];

export default function ProductDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const { addToCart, itemCount, totalAmount } = useCart();

    // Animation values
    const entryAnim = useRef(new Animated.Value(0)).current;

    const { id, name, weight, mrp, discountPrice, image, image2, image3, expiryDate, categoryId, rating, description, originX, originY } = params;

    const startX = originX ? parseFloat(originX as string) : width / 2;
    const startY = originY ? parseFloat(originY as string) : screenHeight / 2;

    const images = [image, image2, image3].filter(img => img && img !== '') as string[];

    const displayPrice = discountPrice ? parseFloat(discountPrice as string) : parseFloat(mrp as string);
    const actualMrp = parseFloat(mrp as string);
    const discountPercent = actualMrp > displayPrice ? Math.round(((actualMrp - displayPrice) / actualMrp) * 100) : 0;

    useEffect(() => {
        Animated.timing(entryAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (categoryId) {
            const loadSimilarProducts = async () => {
                try {
                    const result = await fetchProducts({
                        categoryId: parseInt(categoryId as string),
                        limit: 10
                    });
                    // Filter out current product
                    setSimilarProducts(result.products.filter(p => p.id.toString() !== id));
                } catch (error) {
                    console.error('Failed to load similar products:', error);
                }
            };
            loadSimilarProducts();
        }
    }, [categoryId, id]);

    const handleAddToCart = () => {
        addToCart({
            id: (id as string) || 'temp_id',
            name: (name as string) || 'Product',
            price: `₹${displayPrice}`,
            image: (image as string) || '📦',
            weight: (weight as string) || '100g'
        });
    };

    const renderImage = (img: string, index: number) => {
        const isEmoji = !img.startsWith('/');
        const imageUrl = isEmoji ? null : `${BASE_URL.replace('/api', '')}${img}`;

        return (
            <View key={index} style={styles.imageWrapper}>
                {isEmoji ? (
                    <Text style={styles.mainImagePlaceholder}>{img}</Text>
                ) : (
                    <Image source={{ uri: imageUrl! }} style={styles.productImage} resizeMode="contain" />
                )}
            </View>
        );
    };

    const animatedStyle = {
        opacity: entryAnim,
        backgroundColor: 'white', // Ensure it's opaque white when fully entered
        transform: [
            {
                translateX: entryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [startX - width / 2, 0],
                }),
            },
            {
                translateY: entryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [screenHeight / 2, 0], // Start from bottom edge
                }),
            },
            {
                scale: entryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.05, 1],
                }),
            },
        ],
    };

    const containerStyle = {
        flex: 1,
        backgroundColor: entryAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)'],
        }),
    };

    return (
        <Animated.View style={containerStyle}>
            <Animated.View style={[styles.mainWrapper, animatedStyle]}>
                <StatusBar style="dark" />

                {/* Soft Gradient Background */}
                <LinearGradient
                    colors={['#E8F5E9', '#FFFFFF', '#F1F8E9']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Absolute Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <Pressable onPress={() => router.back()} style={styles.headerIcon}>
                        <Ionicons name="chevron-down" size={28} color="#333" />
                    </Pressable>
                    <View style={styles.headerRight}>
                        <Pressable style={styles.headerIcon}>
                            <Ionicons name="heart-outline" size={24} color="#333" />
                        </Pressable>
                        <Pressable style={styles.headerIcon}>
                            <Ionicons name="search-outline" size={24} color="#333" />
                        </Pressable>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#FFF' }}>
                    {/* Hero Image Section with Horizontal Scroll */}
                    <View style={styles.heroContainer}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={{ width: width }}
                            contentContainerStyle={{ alignItems: 'center' }}
                        >
                            {images.map((img, idx) => renderImage(img, idx))}
                        </ScrollView>

                        {images.length > 1 && (
                            <View style={styles.carouselIndicator}>
                                {images.map((_, idx) => (
                                    <View key={idx} style={styles.indicatorDot} />
                                ))}
                            </View>
                        )}

                        <View style={styles.badgesContainer}>
                            <View style={styles.timerBadge}>
                                <Ionicons name="timer" size={14} color="#2E7D32" />
                                <Text style={styles.badgeLabelText}>8 MINS</Text>
                            </View>
                            <View style={[styles.timerBadge, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
                                <Ionicons name="star" size={14} color="#FBC02D" />
                                <Text style={[styles.badgeLabelText, { color: '#F57F17' }]}>{rating || '4.8'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Product Info Section */}
                    <View style={styles.infoSection}>
                        <Text style={styles.productName}>{name || 'Product Name'}</Text>
                        <Text style={styles.stockAlert}>Only 4 left</Text>
                        <Text style={styles.productWeight}>{weight || '100 g'}</Text>

                        <View style={styles.priceRow}>
                            <Text style={styles.currentPrice}>₹{displayPrice}</Text>
                            {discountPercent > 0 && (
                                <>
                                    <Text style={styles.mrp}>₹{actualMrp}</Text>
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                                    </View>
                                </>
                            )}
                        </View>

                        <Pressable
                            style={styles.detailsDropdown}
                            onPress={() => setDetailsExpanded(!detailsExpanded)}
                        >
                            <Text style={styles.detailsLabel}>View product details</Text>
                            <Ionicons
                                name={detailsExpanded ? "chevron-up" : "chevron-down"}
                                size={18}
                                color={Colors.healthy.successGreen}
                            />
                        </Pressable>

                        {detailsExpanded && (
                            <View style={styles.expandedDetails}>
                                <Text style={styles.detailText}>
                                    {description || `Fresh and organic ${name}. Sourced directly from local farmers to ensure maximum freshness and quality.`}
                                </Text>
                                {expiryDate && (
                                    <View style={styles.expiryBox}>
                                        <Ionicons name="calendar-outline" size={16} color="#666" />
                                        <Text style={styles.expiryText}>Expiry Date: {new Date(expiryDate as string).toLocaleDateString()}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Similar Products Section */}
                    {similarProducts.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Similar products</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                                {similarProducts.map((item) => (
                                    <View key={item.id} style={styles.similarProductWrapper}>
                                        <ProductCard
                                            id={item.id.toString()}
                                            name={item.product_name}
                                            weight={item.unit || ''}
                                            price={`₹${item.discount_price || item.price}`}
                                            image={item.product_image || '🍎'}
                                            image2={item.image2}
                                            image3={item.image3}
                                            expiry_date={item.expiry_date}
                                            rating={item.rating}
                                            mrp={item.price}
                                            discountPrice={item.discount_price}
                                            description={item.product_description}
                                            categoryId={item.category_id}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Recipes Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{name} recipes for you</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                            {RECIPES.map((recipe) => (
                                <View key={recipe.id} style={styles.recipeCard}>
                                    <View style={styles.recipeImageWrapper}>
                                        <Text style={styles.recipePlaceholder}>{recipe.image}</Text>
                                    </View>
                                    <Text style={styles.recipeName}>{recipe.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Spacer for bottom bar */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Add to Cart Bar */}
                <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                    <View style={styles.bottomPriceInfo}>
                        <Text style={styles.bottomWeight}>{weight || '100 g'}</Text>
                        <View style={styles.bottomPriceRow}>
                            <Text style={styles.bottomPrice}>₹{displayPrice}</Text>
                            {discountPercent > 0 && (
                                <>
                                    <Text style={styles.bottomMrp}>MRP ₹{actualMrp}</Text>
                                    <View style={[styles.discountBadge, { paddingVertical: 2 }]}>
                                        <Text style={[styles.discountText, { fontSize: 10 }]}>{discountPercent}% OFF</Text>
                                    </View>
                                </>
                            )}
                        </View>
                        <Text style={styles.taxInfo}>Inclusive of all taxes</Text>
                    </View>
                    <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
                        <Text style={styles.addToCartText}>Add to cart</Text>
                    </Pressable>
                </View>

                {/* Floating View Cart Banner - Render only if cart has items */}
                {itemCount > 0 && (
                    <Pressable
                        style={styles.viewCartBanner}
                        onPress={() => router.push('/cart')}
                    >
                        <View style={styles.cartIconCircle}>
                            <Ionicons name="cart" size={18} color="#FFF" />
                        </View>
                        <View style={styles.cartTextContainer}>
                            <Text style={styles.viewCartText}>View cart</Text>
                            <Text style={styles.cartItemsCount}>{itemCount} items</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FFF" />
                    </Pressable>
                )}
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        paddingTop: 80,
    },
    heroContainer: {
        width: '100%',
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    imageWrapper: {
        width: width * 0.9,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImagePlaceholder: {
        fontSize: 150,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    badgesContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        flexDirection: 'row',
        gap: 10,
    },
    timerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(46, 125, 50, 0.2)',
    },
    badgeLabelText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#2E7D32',
    },
    infoSection: {
        padding: 16,
        backgroundColor: '#FFF',
    },
    productName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginBottom: 6,
    },
    stockAlert: {
        fontSize: 14,
        color: '#D32F2F',
        fontWeight: '600',
        marginBottom: 8,
    },
    productWeight: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
    },
    mrp: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 12,
        color: '#1E88E5',
        fontWeight: '800',
    },
    detailsDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
    },
    detailsLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.healthy.successGreen,
    },
    expandedDetails: {
        paddingVertical: 10,
    },
    detailText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
    section: {
        marginTop: 10,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    horizontalScroll: {
        paddingHorizontal: 16, // Changed from paddingRight to paddingHorizontal
        gap: 12, // Added gap for spacing between items
        paddingBottom: 10,
    },
    similarProductWrapper: { // New style for ProductCard wrapper
        width: 140,
    },
    similarImageWrapper: {
        width: 140,
        height: 140,
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    similarPlaceholder: {
        fontSize: 60,
    },
    heartSmall: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    addSmall: {
        position: 'absolute',
        bottom: 75,
        right: 5,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
    },
    addSmallText: {
        fontSize: 11,
        fontWeight: '900',
        color: Colors.healthy.successGreen,
    },
    similarWeight: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600',
    },
    similarName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    recipeCard: {
        width: 160,
        marginRight: 12,
    },
    recipeImageWrapper: {
        width: 160,
        height: 120,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    recipePlaceholder: {
        fontSize: 50,
    },
    recipeName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomPriceInfo: {
        flex: 1,
    },
    bottomWeight: {
        fontSize: 11,
        fontWeight: '700',
        color: '#333',
    },
    bottomPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bottomPrice: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },
    bottomMrp: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    taxInfo: {
        fontSize: 9,
        color: '#AAA',
        fontWeight: '600',
    },
    addToCartButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    viewCartBanner: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        width: width * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    cartIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cartTextContainer: {
        flex: 1,
    },
    viewCartText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFF',
    },
    cartItemsCount: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    carouselIndicator: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
        gap: 6,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    expiryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    expiryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '700',
    }
});
