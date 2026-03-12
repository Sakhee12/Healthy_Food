import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchProducts, Product } from "@/api/product";
import { ProductCard } from "@/components/ProductCard";
import { Colors } from "@/constants/theme";

export default function CategoryProducts() {
  const { category, categoryId } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts({ category: categoryId });
        setProducts(response.products);
      } catch (error) {
        console.error('Failed to load category products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.healthy.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            id={item.id.toString()}
            name={item.product_name}
            weight={item.unit || ''}
            price={`₹${item.discount_price || item.price}`}
            image={item.product_image || '🍎'}
            rating={item.rating}
            mrp={item.price}
            discountPrice={item.discount_price}
            description={item.product_description}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});