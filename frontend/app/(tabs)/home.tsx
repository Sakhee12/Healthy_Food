import { CategoryTabs } from '@/components/CategoryTabs';
import { HomeScreenHeader } from '@/components/HomeScreenHeader';
import { HoliBanner } from '@/components/HoliBanner';
import { OffersBanner } from '@/components/OffersBanner';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, ActivityIndicator, Pressable, Animated } from 'react-native';
import { fetchCategories, Category } from '@/api/category';
import { fetchProducts, fetchTrendingProducts, Product } from '@/api/product';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const scrollValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { cartItems, itemCount, totalAmount } = useCart();
  const router = useRouter();

  const loadData = async () => {
    try {
      if (!refreshing) setLoading(true);
      const [cats, productsRes, trending] = await Promise.all([
        fetchCategories(),
        fetchProducts({ limit: 100 }),
        fetchTrendingProducts()
      ]);
      
      console.log('Categories loaded:', cats.length);
      console.log('Products loaded:', productsRes.products.length);
      console.log('Trending products loaded:', trending.length);
      
      setCategories(cats);
      setAllProducts(productsRes.products);
      setTrendingProducts(trending);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollValue } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 400 && !showScrollTop) {
          setShowScrollTop(true);
        } else if (offsetY <= 400 && showScrollTop) {
          setShowScrollTop(false);
        }
      }
    }
  );

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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

  const currentGradient = getGradientColors();
  const categoryNames = ['All', 'Holi', 'Ramzan', 'Kids', 'Gifting', 'Imported'];

  // Reusable section renderer
  const renderProductSection = (title: string, products: Product[]) => {
    if (products.length === 0) return null;
    return (
      <View style={styles.section} key={title}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
          {products.map(product => (
            <ProductCard 
              key={`${title}-${product.id}`} 
              id={product.id.toString()}
              name={product.product_name}
              weight={product.unit || ''}
              price={`₹${product.discount_price || product.price}`}
              image={product.product_image || '🍎'}
              image2={product.image2}
              image3={product.image3}
              expiry_date={product.expiry_date}
              rating={product.rating}
              mrp={product.price || 0}
              discountPrice={product.discount_price}
              description={product.product_description}
              categoryId={product.category_id}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  // Seeded shuffle: same seed always produces the same order,
  // but different seeds produce different orders
  const seededShuffle = (arr: Product[], seed: number): Product[] => {
    const shuffled = [...arr];
    let s = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate a numeric seed from the tab name
  const tabSeed = activeCategory.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  // Shuffle products differently per tab so each tab shows a unique arrangement
  const shuffledProducts = seededShuffle(allProducts, tabSeed);
  const shuffledTrending = seededShuffle(trendingProducts, tabSeed + 100);

  // Build sections: Bestsellers uses trending products, rest use shuffled products
  const sections = [
    { title: 'Bestsellers 🔥', items: shuffledTrending.length > 0 ? shuffledTrending.slice(0, 6) : shuffledProducts.slice(0, 6) },
    { title: 'Healthy Picks', items: shuffledProducts.slice(0, 6) },
    { title: 'Daily Essentials', items: shuffledProducts.slice(6, 12) },
    { title: 'Great Deals', items: shuffledProducts.slice(12, 18) },
    { title: 'Sweet Tooth', items: shuffledProducts.slice(18, 24) },
    { title: 'Featured this week', items: shuffledProducts.slice(24, 30) },
    { title: 'For your cravings', items: shuffledProducts.slice(30, 36) },
    { title: 'Breakfast treats', items: shuffledProducts.slice(36, 42) },
  ];

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.healthy.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.healthy.primary} />
        }
      >
        {/* Scrollable Header */}
        <HomeScreenHeader activeCategory={activeCategory} />

        {/* Tabs Section (Now scrollable away too) */}
        <View style={[styles.stickyHeader, { backgroundColor: currentGradient[0] }]}>
          <CategoryTabs
            categories={categoryNames}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </View>

        {/* Dynamic Background Area */}
        <View style={{ backgroundColor: currentGradient[currentGradient.length - 1] }}>
          {/* Offers Section */}
          {activeCategory.toLowerCase() === 'holi' ? (
            <HoliBanner />
          ) : (
            <OffersBanner category={activeCategory} />
          )}

          {/* All Product Sections */}
          {sections.map(section => renderProductSection(section.title, section.items))}

          {/* Bottom Spacer */}
          <View style={{ height: 180 }} />
        </View>
      </ScrollView>

      {/* Scroll to Top Button (Now on the right) */}
      {showScrollTop && (
        <Pressable 
          style={[styles.scrollToTop, { bottom: (itemCount > 0 ? 90 : 20) + insets.bottom }]} 
          onPress={scrollToTop}
        >
          <Ionicons name="chevron-up" size={24} color="#fff" />
        </Pressable>
      )}

      {/* Floating View Cart Banner */}
      {itemCount > 0 && (
        <Pressable 
          style={[styles.floatingCartBanner, { bottom: insets.bottom + 10 }]}
          onPress={() => router.push('/cart')}
        >
          <View style={styles.cartBannerLeft}>
            <View style={styles.cartIconBadge}>
              <Ionicons name="cart" size={18} color="#fff" />
              <View style={styles.badgeDot}>
                <Text style={styles.badgeDotText}>{itemCount}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.cartBannerQty}>{itemCount} ITEM{itemCount > 1 ? 'S' : ''}</Text>
              <Text style={styles.cartBannerTotal}>₹{totalAmount}</Text>
            </View>
          </View>
          <View style={styles.cartBannerRight}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.healthy.white,
  },
  stickyHeader: {
    backgroundColor: Colors.healthy.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.healthy.primary,
  },
  productRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  scrollToTop: {
    position: 'absolute',
    right: 20,
    backgroundColor: Colors.healthy.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingCartBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: Colors.healthy.successGreen,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  cartBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartIconBadge: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeDotText: {
    color: Colors.healthy.successGreen,
    fontSize: 10,
    fontWeight: '900',
  },
  cartBannerQty: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
  },
  cartBannerTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  cartBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
