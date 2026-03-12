import { CategoryTabs } from '@/components/CategoryTabs';
import { HomeScreenHeader } from '@/components/HomeScreenHeader';
import { HoliBanner } from '@/components/HoliBanner';
import { OffersBanner } from '@/components/OffersBanner';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { fetchCategories, Category } from '@/api/category';
import { fetchProducts, fetchTrendingProducts, Product } from '@/api/product';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
              rating={product.rating}
              mrp={product.price}
              discountPrice={product.discount_price}
              description={product.product_description}
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
      <HomeScreenHeader activeCategory={activeCategory} />

      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.healthy.primary} />
        }
      >
        {/* Sticky Tabs Section */}
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
});
