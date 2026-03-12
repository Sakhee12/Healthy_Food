import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface CategoryTabsProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    'All': 'basket-outline',
    'Holi': 'color-palette-outline',
    'Ramzan': 'moon-outline',
    'Kids': 'balloon-outline',
    'Gifting': 'gift-outline',
    'Imported': 'airplane-outline',
    'Kuch Bhi': 'help-circle-outline',
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    activeCategory,
    onCategoryChange
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const isActive = activeCategory === category;
                    const iconName = CATEGORY_ICONS[category] || 'apps-outline';

                    return (
                        <Pressable
                            key={category}
                            onPress={() => onCategoryChange(category)}
                            style={styles.tabWrapper}
                        >
                            <View style={[
                                styles.tab,
                                isActive ? styles.activeTab : styles.inactiveTab
                            ]}>
                                {category === 'Ramzan' ? (
                                    <LottieView
                                        source={require('../assets/animations/ramzan.json')}
                                        autoPlay
                                        loop
                                        resizeMode="contain"
                                        style={styles.lottie}
                                    />
                                ) : (
                                    <Ionicons
                                        name={iconName}
                                        size={20}
                                        color={isActive ? '#000' : 'rgba(0,0,0,0.6)'}
                                    />
                                )}
                                <Text style={[
                                    styles.tabText,
                                    isActive ? styles.activeTabText : styles.inactiveTabText
                                ]}>
                                    {category}
                                </Text>
                            </View>
                            {isActive && <View style={styles.activeIndicator} />}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    tabWrapper: {
        alignItems: 'center',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    inactiveTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '700',
    },
    activeTabText: {
        color: '#000',
    },
    inactiveTabText: {
        color: 'rgba(0,0,0,0.6)',
    },
    activeIndicator: {
        marginTop: 4,
        height: 3,
        width: '60%',
        backgroundColor: '#000',
        borderRadius: 2,
    },
    lottie: {
        width: 24,
        height: 24,
    },
});
