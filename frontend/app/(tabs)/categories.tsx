import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchCategories, Category } from "@/api/category";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/api/api";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#A47148" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>HealthyFood</Text>
        <Text style={styles.subtitle}>Healthy groceries near you</Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search products"
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* CATEGORY GRID */}
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const imageUrl = item.category_image 
            ? `${BASE_URL.replace('/api', '')}${item.category_image}`
            : null;

          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({
                pathname: "/categoryProducts",
                params: { category: item.category_name, categoryId: item.id }
              })}
            >
              <View style={styles.imageWrapper}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.emoji}>📦</Text>
                )}
              </View>
              <Text style={styles.cardText} numberOfLines={2}>{item.category_name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* HEADER */
  header: {
    backgroundColor: "#A47148",   // smooth brown
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 14,
    color: "#F2E8DC",
    marginTop: 2,
    fontWeight: "600",
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 14,
    height: 42,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },

  /* CATEGORY CARDS */
  card: {
    backgroundColor: "#fff",
    width: "31%",
    padding: 10,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  imageWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 6,
  },

  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  emoji: {
    fontSize: 30,
  },

  cardText: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "700",
    color: "#333",
  },
});