import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, Modal, ScrollView, TouchableOpacity, Image, TextInput, Animated, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchProducts, Product } from "@/api/product";
import { fetchCategories, Category } from "@/api/category";
import { ProductCard } from "@/components/ProductCard";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "@/context/CartContext";
import { BASE_URL } from "@/api/api";

interface FilterState {
  sort: string;
  minPrice: string;
  maxPrice: string;
  rating: number;
}

export default function CategoryProducts() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, itemCount, totalAmount } = useCart();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(Number(params.categoryId));
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(String(params.category));

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('Price');
  const [filterSearch, setFilterSearch] = useState('');

  // Smooth slide animation logic
  const filterSlideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (filterVisible) {
      Animated.spring(filterSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10
      }).start();
    }
  }, [filterVisible, filterSlideAnim]);

  const closeFilterModal = () => {
    Animated.timing(filterSlideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setFilterVisible(false);
    });
  };

  const [tempFilters, setTempFilters] = useState<FilterState>({
    sort: '',
    minPrice: '',
    maxPrice: '',
    rating: 0
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    sort: '',
    minPrice: '',
    maxPrice: '',
    rating: 0
  });

  const filterCategories = [
    "Brand",
    "Price",
    "Munchies type",
    "Diet Preference",
    "Type",
    "Taste Profile",
    "Flavour Family",
    "Sugar Profile"
  ];

  const loadCategories = async () => {
    try {
      setCatLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setCatLoading(false);
    }
  };

  const loadProducts = useCallback(async (catId: number, filters: FilterState) => {
    try {
      setLoading(true);
      const queryParams: any = { category: catId };
      if (filters.sort) queryParams.sort = filters.sort;
      if (filters.minPrice) queryParams.minPrice = filters.minPrice;
      if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
      if (filters.rating > 0) queryParams.rating = filters.rating;

      const response = await fetchProducts(queryParams);
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to load category products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(selectedCategoryId, appliedFilters);
  }, [selectedCategoryId, appliedFilters, loadProducts]);

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    closeFilterModal();
  };

  const resetFilters = () => {
    const reset = { sort: '', minPrice: '', maxPrice: '', rating: 0 };
    setTempFilters(reset);
    setAppliedFilters(reset);
    closeFilterModal();
  };

  const sortOptions = [
    { label: 'Relevance (default)', value: '' },
    { label: 'Price (low to high)', value: 'price_asc' },
    { label: 'Price (high to low)', value: 'price_desc' },
    { label: 'Rating (high to low)', value: 'rating' },
    { label: 'Discount (high to low)', value: 'discount' },
  ];

  const ratingOptions = [0, 1, 2, 3, 4];

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isActive = selectedCategoryId === item.id;
    return (
      <Pressable
        onPress={() => {
          setSelectedCategoryId(item.id);
          setSelectedCategoryName(item.category_name);
        }}
        style={[styles.catItem, isActive && styles.activeCatItem]}
      >
        {isActive && <View style={styles.activeIndicator} />}
        <View style={styles.catIconContainer}>
          {item.category_image ? (
            <Image
              source={{ uri: item.category_image.startsWith('http') ? item.category_image : `${BASE_URL.replace('/api', '')}${item.category_image}` }}
              style={styles.catImage}
            />
          ) : (
            <View style={styles.catIconPlaceholder}>
              <Ionicons name="fast-food-outline" size={20} color={isActive ? Colors.healthy.primary : '#666'} />
            </View>
          )}
        </View>
        <Text style={[styles.catName, isActive && styles.activeCatName]} numberOfLines={2}>
          {item.category_name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{selectedCategoryName}</Text>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryText} numberOfLines={1}>Delivering to : </Text>
              <Text style={styles.locationText} numberOfLines={1}>Kate Wasti, Tathawade,...</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.healthy.successGreen} />
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerIconButton}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search-outline" size={22} color="#333" />
          </Pressable>
          <Pressable style={styles.headerIconButton}>
            <Ionicons name="share-outline" size={22} color="#333" />
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        <View style={styles.sidebar}>
          {catLoading ? (
            <ActivityIndicator size="small" color={Colors.healthy.primary} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sidebarContent}
            />
          )}
        </View>

        {/* Right Product List Area */}
        <View style={styles.productListContainer}>
          {/* Horizontal Filters Row */}
          <View style={styles.topFiltersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topFiltersScroll}>
              <Pressable style={styles.filterChip} onPress={() => setFilterVisible(true)}>
                <Ionicons name="options-outline" size={16} color="#333" />
                <Text style={styles.filterChipText}>Filters</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </Pressable>
              <Pressable style={styles.filterChip} onPress={() => setSortVisible(true)}>
                <Ionicons name="swap-vertical-outline" size={16} color="#333" />
                <Text style={styles.filterChipText}>Sort</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </Pressable>
              <Pressable style={styles.filterChip} onPress={() => { setFilterVisible(true); setActiveFilterTab('Price'); }}>
                <Text style={styles.filterChipText}>Price</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </Pressable>
              <Pressable style={styles.filterChip} onPress={() => { setFilterVisible(true); setActiveFilterTab('Rating'); }}>
                <Text style={styles.filterChipText}>Rating</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </Pressable>
            </ScrollView>
          </View>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.healthy.primary} />
            </View>
          ) : products.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="basket-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.productCardWrapper}>
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
              )}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.columnWrapper}
            />
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
      </View>

      {/* Filters Modal */}
      <Modal
        visible={filterVisible}
        animationType="fade"
        transparent
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalOverlay}>

          <Pressable style={styles.modalBackdrop} onPress={closeFilterModal} />

          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: filterSlideAnim }] }]}>

            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={closeFilterModal}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#777" />
              <TextInput
                placeholder="Search across filters..."
                style={styles.searchInput}
                value={filterSearch}
                onChangeText={setFilterSearch}
              />
            </View>

            <View style={styles.filterBody}>

              {/* LEFT SIDEBAR */}
              <ScrollView style={styles.sidebarFilters}>

                {filterCategories.map(tab => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveFilterTab(tab)}
                    style={[
                      styles.sidebarItem,
                      activeFilterTab === tab && styles.sidebarItemActive
                    ]}
                  >
                    {activeFilterTab === tab && <View style={styles.activeBar} />}
                    <Text
                      style={[
                        styles.sidebarText,
                        activeFilterTab === tab && styles.sidebarTextActive
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}

              </ScrollView>

              {/* RIGHT OPTIONS */}
              <ScrollView style={styles.optionsArea}>

                {activeFilterTab === "Price" && (

                  <>
                    {[
                      { label: "Below ₹99", min: "0", max: "99", count: 355 },
                      { label: "₹100 - ₹199", min: "100", max: "199", count: 183 },
                      { label: "₹200 - ₹299", min: "200", max: "299", count: 34 },
                      { label: "Above ₹300", min: "300", max: "", count: 3 }
                    ].map((opt, index) => {

                      const selected =
                        tempFilters.minPrice === opt.min &&
                        tempFilters.maxPrice === opt.max;

                      return (
                        <Pressable
                          key={index}
                          style={styles.optionRow}
                          onPress={() =>
                            setTempFilters({
                              ...tempFilters,
                              minPrice: opt.min,
                              maxPrice: opt.max
                            })
                          }
                        >

                          <Text style={styles.optionText}>
                            {opt.label} <Text style={styles.optionCount}>({opt.count})</Text>
                          </Text>

                          <Ionicons
                            name={selected ? "checkbox" : "square-outline"}
                            size={22}
                            color={selected ? "#2ECC71" : "#ccc"}
                          />

                        </Pressable>
                      );
                    })}
                  </>
                )}

              </ScrollView>

            </View>

            {/* FOOTER */}
            <View style={styles.footer}>

              <Pressable style={styles.clearBtn} onPress={resetFilters}>
                <Text style={styles.clearText}>Clear Filter</Text>
              </Pressable>

              <Pressable style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyText}>Apply</Text>
              </Pressable>

            </View>

          </Animated.View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={sortVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSortVisible(false)}
      >
        <View style={styles.sortModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSortVisible(false)} />
          <View style={styles.sortContent}>
            <View style={styles.sortHeader}>
              <Text style={styles.sortTitle}>Sort by</Text>
              <Pressable onPress={() => setSortVisible(false)} style={styles.sortCloseBtn}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={styles.sortOptionsList}>
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    setAppliedFilters({ ...appliedFilters, sort: opt.value });
                    setSortVisible(false);
                  }}
                  style={styles.sortOptionItem}
                >
                  <Ionicons
                    name={appliedFilters.sort === opt.value ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={appliedFilters.sort === opt.value ? Colors.healthy.successGreen : "#666"}
                  />
                  <Text style={[styles.sortOptionText, appliedFilters.sort === opt.value && styles.activeSortText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: '#000',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  deliveryText: {
    fontSize: 12,
    color: Colors.healthy.successGreen,
    fontWeight: '800',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    maxWidth: 160,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 70,
    backgroundColor: '#F7F8FA', // Subtle background for sidebar
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  catItem: {
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  activeCatItem: {
    backgroundColor: '#fff', // Highlighted category has white background
  },
  catIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  catIconPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.healthy.successGreen,
  },
  catName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#666',
  },
  activeCatName: {
    color: '#000',
    fontWeight: '800',
  },
  productListContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 8,
    paddingBottom: 100, // Extra space for floating cart banner
  },
  productCardWrapper: {
    flex: 0.5,
    padding: 0,
    alignItems: 'center',
  },
  columnWrapper: {
    paddingHorizontal: 2,
    gap: 0,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    fontWeight: '600',
  },
  resetLink: {
    marginTop: 12,
  },
  resetLinkText: {
    color: Colors.healthy.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  // New Modal Styles
  filterModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  filterContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  closeBtnContainer: {
    position: 'absolute',
    top: -45,
    left: '50%',
    marginLeft: -20,
  },
  closeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterSplitContent: {
    flex: 1,
    flexDirection: 'row',
  },
  filterTabsSidebar: {
    width: '22%',
    backgroundColor: '#F7F8FA',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  filterTabItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeFilterTab: {
    backgroundColor: '#F0FFF4',
  },
  tabActiveBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.healthy.successGreen,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterTabText: {
    color: Colors.healthy.successGreen,
    fontWeight: '800',
  },
  filterOptionsArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  optionCount: {
    color: '#999',
    fontWeight: '400',
  },
  filterModalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  clearBtn: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.healthy.successGreen,
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.healthy.successGreen,
  },
  applyBtn: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#BCC1CD', // Matching the gray from image
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  // Sort Modal Styles
  sortModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sortContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  sortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  sortOptionsList: {
    paddingTop: 10,
  },
  sortOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 15,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  activeSortText: {
    color: '#111',
    fontWeight: '700',
  },
  placeholderOptions: {
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  priceOptionsContainer: {
    paddingVertical: 10,
  },
  ratingOptionsContainer: {
    paddingVertical: 10,
  },
  sidebarContent: {
    paddingVertical: 10,
  },
  topFiltersRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
  },
  topFiltersScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  sortCloseBtn: {
    padding: 4,
  },
  closeButton: {
    position: "absolute",
    top: -22,
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },

  modalHeader: {
    padding: 16
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800"
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14
  },

  filterBody: {
    flex: 1,
    flexDirection: "row"
  },

  sidebarFilters: {
    width: 0,
    backgroundColor: "#F5F5F5"
  },

  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 14
  },

  sidebarItemActive: {
    backgroundColor: "#fff"
  },

  activeBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#2ECC71"
  },

  sidebarText: {
    fontSize: 13,
    color: "#444",
    fontWeight: "600"
  },

  sidebarTextActive: {
    color: "#2ECC71",
    fontWeight: "800"
  },

  optionsArea: {
    flex: 1
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600"
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },


  clearText: {
    color: "#2ECC71",
    fontWeight: "700"
  },

  applyText: {
    color: "#fff",
    fontWeight: "700"
  }
});
