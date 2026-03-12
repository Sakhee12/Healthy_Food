import { BASE_URL } from './api';

export interface Product {
    id: number;
    product_name: string;
    category_id: number | null;
    product_description: string | null;
    brand: string | null;
    price: number;
    discount_price: number;
    stock: number;
    unit: string | null;
    product_image: string | null;
    image2: string | null;
    image3: string | null;
    rating: number;
    review_count: number;
    is_featured: number;
    is_trending: number;
    expiry_date: string | null;
    category_name?: string;
    discount_percent?: number;
}

export interface ProductListResponse {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    products: Product[];
}

export const fetchProducts = async (filters: any = {}): Promise<ProductListResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) queryParams.append(key, value.toString());
        });
        const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { page: 1, limit: 12, totalProducts: 0, totalPages: 0, products: [] };
    }
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${BASE_URL}/products/featured`);
        if (!response.ok) throw new Error('Failed to fetch featured products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
};

export const fetchTrendingProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${BASE_URL}/products/trending`);
        if (!response.ok) throw new Error('Failed to fetch trending products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching trending products:', error);
        return [];
    }
};
