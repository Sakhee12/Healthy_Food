import { BASE_URL } from './api';

export interface Category {
    id: number;
    category_name: string;
    category_image: string | null;
    banner_image: string | null;
    parent_id: number | null;
    display_order: number;
    status: number;
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${BASE_URL}/admin/categories`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching categories: ${response.status}`);
        }

        const data = await response.json();
        return data as Category[];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
};
