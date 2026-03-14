import axios from "axios";

export const BASE_URL = "http://localhost:5001";

const API = axios.create({
    baseURL: `${BASE_URL}/api`,
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    sendOtp: (phone) => API.post("/auth/send-otp", { phone }),
    verifyOtp: (phone, otp) => API.post("/auth/verify-otp", { phone, otp }),
    register: (data) => API.post("/auth/register", data),
    login: (email, password) => API.post("/auth/login", { email, password }),
    forgotPassword: (email) => API.post("/auth/forgot-password", { email }),
};

export const adminService = {
    // User Management
    getAllUsers: () => API.get("/admin/users"),
    getRoles: () => API.get("/admin/roles"),
    updateUserRole: (id, role_id) => API.put("/admin/update-role", { id, role_id }),
    deleteUser: (id) => API.delete(`/admin/delete-user/${id}`),

    // Product Management
    getAllProducts: (params) => API.get("/products", { params }),
    addProduct: (data) => API.post("/products/add", data),
    updateProduct: (id, data) => API.put(`/products/update/${id}`, data),
    deleteProduct: (id) => API.delete(`/products/delete/${id}`),

    // Category Management
    getAllCategories: () => API.get("/admin/categories"),
    addCategory: (data) => API.post("/admin/categories/add", data),
    updateCategory: (id, data) => API.put(`/admin/categories/update/${id}`, data),
    deleteCategory: (id) => API.delete(`/admin/categories/delete/${id}`),

    // Order Management
    getAllOrders: () => API.get("/admin/orders"),
    updateOrderStatus: (id, status) => API.put(`/admin/orders/update-status`, { id, status }),

    // Cart Monitoring
    getAllCarts: () => API.get("/admin/carts"),
    getCartDetails: (id) => API.get(`/admin/carts/${id}`),

    // Extensions
    // Sections
    getAllSections: () => API.get("/catalog/sections"),
    getSectionById: (id) => API.get(`/catalog/sections/${id}`),
    addSection: (data) => API.post("/catalog/sections", data),
    updateSection: (id, data) => API.put(`/catalog/sections/${id}`, data),
    deleteSection: (id) => API.delete(`/catalog/sections/${id}`),

    // Subcategories
    getAllSubcategories: () => API.get("/subcategories"),
    getSubcategoriesByCategory: (categoryId) => API.get(`/subcategories/category/${categoryId}`),
    addSubcategory: (data) => API.post("/subcategories", data),
    updateSubcategory: (id, data) => API.put(`/subcategories/${id}`, data),
    deleteSubcategory: (id) => API.delete(`/subcategories/${id}`),

    // Brands
    getAllBrands: () => API.get("/brands"),
    addBrand: (data) => API.post("/brands", data),
    updateBrand: (id, data) => API.put(`/brands/${id}`, data),
    deleteBrand: (id) => API.delete(`/brands/${id}`),

    // Product Variants
    getAllVariants: () => API.get("/product-variants"),
    getVariantsByProduct: (productId) => API.get(`/product-variants/product/${productId}`),
    addVariant: (data) => API.post("/product-variants", data),
    updateVariant: (id, data) => API.put(`/product-variants/${id}`, data),
    deleteVariant: (id) => API.delete(`/product-variants/${id}`)
};

export const publicService = {
    getSections: () => API.get("/sections"),
    getSectionProducts: (id) => API.get(`/sections/${id}/products`),
};

export default API;
