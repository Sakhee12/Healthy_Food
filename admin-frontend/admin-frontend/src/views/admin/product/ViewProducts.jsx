import Card from "components/card";
import InputField from "components/fields/InputField";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { adminService, BASE_URL } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function ViewProducts() {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 12;

    // Get user role for permissions
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = (user?.role || "").toLowerCase().replace(/\s+/g, "");

    useEffect(() => {
        console.log("Current User Role:", userRole);
    }, [userRole]);

    const canAdd = ["superadmin", "admin", "manager"].includes(userRole);
    const canEdit = ["superadmin", "admin", "manager"].includes(userRole);
    const canDelete = ["superadmin", "admin"].includes(userRole);

    const [formData, setFormData] = useState({
        product_name: "",
        category_id: "",
        subcategory_id: "",
        price: "",
        discount_price: "",
        stock: "",
        product_description: "",
        brand_id: "",
        unit: "",
        rating: 0,
        review_count: 0,
        is_featured: 0,
        is_trending: 0,
        expiry_date: "",
        product_image: "",
        image2: "",
        image3: "",
        product_image_file: null,
        image2_file: null,
        image3_file: null
    });

    const fetchMetadata = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                adminService.getAllCategories(),
                adminService.getAllBrands()
            ]);
            setCategories(catRes.data);
            setBrands(brandRes.data);
        } catch (error) {
            console.error("Error fetching metadata:", error);
        }
    };

    useEffect(() => {
        if (formData.category_id) {
            adminService.getSubcategoriesByCategory(formData.category_id)
                .then(res => setSubcategories(res.data))
                .catch(err => console.error("Error fetching subcategories:", err));
        } else {
            setSubcategories([]);
        }
    }, [formData.category_id]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllProducts({ page, limit });
            // Backend returns { page, limit, totalProducts, totalPages, products: [] }
            if (response.data && response.data.products) {
                setData(response.data.products);
                setTotalPages(response.data.totalPages || 1);
                setTotalProducts(response.data.totalProducts || 0);
            } else {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();

        // Append text fields
        Object.keys(formData).forEach(key => {
            if (!key.endsWith('_file') && key !== 'product_image' && key !== 'image2' && key !== 'image3') {
                if (formData[key] !== null && formData[key] !== undefined) {
                    submissionData.append(key, formData[key]);
                }
            }
        });

        // Handle product_image: send file if exists, else send existing string/URL
        if (formData.product_image_file) {
            submissionData.append('product_image_file', formData.product_image_file);
        } else if (formData.product_image) {
            submissionData.append('product_image', formData.product_image);
        }

        // Handle image2: send file if exists, else send existing string/URL
        if (formData.image2_file) {
            submissionData.append('image2_file', formData.image2_file);
        } else if (formData.image2) {
            submissionData.append('image2', formData.image2);
        }

        // Handle image3: send file if exists, else send existing string/URL
        if (formData.image3_file) {
            submissionData.append('image3_file', formData.image3_file);
        } else if (formData.image3) {
            submissionData.append('image3', formData.image3);
        }

        try {
            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, submissionData);
                alert("Product updated!");
            } else {
                await adminService.addProduct(submissionData);
                alert("Product added!");
            }
            setShowModal(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Error saving product");
        }
    };

    const resetForm = () => {
        setFormData({
            product_name: "", category_id: "", subcategory_id: "", price: "", discount_price: "", stock: "",
            product_description: "", brand_id: "", unit: "", rating: 0, review_count: 0,
            is_featured: 0, is_trending: 0, expiry_date: "",
            product_image: "", image2: "", image3: "",
            product_image_file: null, image2_file: null, image3_file: null
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            product_name: product.product_name || "",
            category_id: product.category_id || "",
            subcategory_id: product.subcategory_id || "",
            price: product.price || "",
            discount_price: product.discount_price || "",
            stock: product.stock || "",
            product_description: product.product_description || "",
            brand_id: product.brand_id || "",
            unit: product.unit || "",
            rating: product.rating || 0,
            review_count: product.review_count || 0,
            is_featured: product.is_featured || 0,
            is_trending: product.is_trending || 0,
            expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : "",
            product_image: product.product_image || "",
            image2: product.image2 || "",
            image3: product.image3 || "",
            product_image_file: null,
            image2_file: null,
            image3_file: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        console.log(`Frontend: Attempting to delete product with ID: ${id}`);
        if (window.confirm("Delete this product?")) {
            try {
                console.log(`Frontend: Confirming deletion for ID: ${id}`);
                const res = await adminService.deleteProduct(id);
                console.log("Frontend: Delete response:", res.data);
                fetchProducts();
            } catch (error) {
                console.error("Frontend: Delete error:", error);
                alert("Error deleting product");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("product_image", {
            header: () => <p className="text-sm font-bold text-gray-600">IMAGE</p>,
            cell: (info) => {
                const imgValue = info.getValue();
                const imgSrc = imgValue
                    ? (imgValue.startsWith('http') ? imgValue : `${BASE_URL}${imgValue.startsWith('/') ? '' : '/'}${imgValue}`)
                    : 'https://placehold.co/48x48/f3f4f6/94a3b8?text=No+Img';
                return (
                    <div className="flex items-center justify-start py-1">
                        <img
                            src={imgSrc}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover shadow-sm bg-gray-50 border border-gray-100"
                            onError={(e) => { e.target.src = 'https://placehold.co/48x48/f3f4f6/94a3b8?text=Error'; }}
                        />
                    </div>
                );
            },
        }),
        columnHelper.accessor(row => row.product_name || row.name, {
            id: "product_name",
            header: () => <p className="text-sm font-bold text-gray-600 text-left">PRODUCT NAME</p>,
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 min-w-[180px]">{info.getValue() || "Unnamed Product"}</p>
            ),
        }),
        columnHelper.accessor("brand", {
            header: () => <p className="text-sm font-bold text-gray-600">BRAND</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() || "Generic"}</p>,
        }),
        columnHelper.accessor("unit", {
            header: () => <p className="text-sm font-bold text-gray-600">UNIT</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() || "N/A"}</p>,
        }),
        columnHelper.accessor("category_name", {
            header: () => <p className="text-sm font-bold text-gray-600">CATEGORY</p>,
            cell: (info) => {
                const catName = info.getValue();
                return <p className="text-sm font-bold text-navy-700">{catName || `Cat ID: ${info.row.original.category_id || 'N/A'}`}</p>;
            },
        }),
        columnHelper.accessor("price", {
            header: () => <p className="text-sm font-bold text-gray-600">PRICE</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">₹{info.getValue()}</p>,
        }),
        columnHelper.accessor("discount_price", {
            header: () => <p className="text-sm font-bold text-gray-600">DISCOUNT</p>,
            cell: (info) => <p className="text-sm font-bold text-green-500">₹{info.getValue() || 0}</p>,
        }),
        columnHelper.accessor("rating", {
            header: () => <p className="text-sm font-bold text-gray-600">RATING</p>,
            cell: (info) => (
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-navy-700">{info.getValue() || 0}</span>
                    <span className="text-orange-400">★</span>
                </div>
            ),
        }),
        columnHelper.accessor("review_count", {
            header: () => <p className="text-sm font-bold text-gray-600">REVIEWS</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() || 0}</p>,
        }),
        columnHelper.accessor("stock", {
            header: () => <p className="text-sm font-bold text-gray-600">STOCK</p>,
            cell: (info) => <p className={`text-sm font-bold ${info.getValue() < 10 ? 'text-red-500' : 'text-navy-700'}`}>{info.getValue()}</p>,
        }),
        columnHelper.display({
            id: "status",
            header: () => <p className="text-sm font-bold text-gray-600">STATUS</p>,
            cell: (info) => (
                <div className="flex gap-1">
                    {info.row.original.is_featured === 1 && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-[10px] font-bold">Featured</span>}
                    {info.row.original.is_trending === 1 && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md text-[10px] font-bold">Trending</span>}
                </div>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewingProduct(info.row.original)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-xl text-gray-500 transition-all hover:scale-110 hover:bg-gray-100 active:scale-95"
                        title="View Details"
                    >
                        <MdVisibility />
                    </button>
                    {canEdit && (
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-500 transition-all hover:scale-110 hover:bg-brand-100 active:scale-95"
                            title="Edit"
                        >
                            <MdEdit />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDelete(info.row.original.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-xl text-red-500 transition-all hover:scale-110 hover:bg-red-100 active:scale-95"
                            title="Delete"
                        >
                            <MdDelete />
                        </button>
                    )}
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex w-full flex-col gap-5 pt-8">
            <Card extra={"w-full h-full sm:overflow-auto px-6 pb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Product Management</div>
                    {canAdd && (
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                resetForm();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                        >
                            <MdAdd /> Add Product
                        </button>
                    )}
                </header>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full min-w-[1200px]">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 px-4 text-start">
                                            <div className="text-xs text-gray-500">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="11" className="text-center py-10 text-gray-400 font-medium">Loading products...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="11" className="text-center py-10 text-gray-400 font-medium">No products found. Click "Add Product" to start.</td></tr> :
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="border-white/0 py-3 px-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-between px-4">
                    <div className="text-sm text-gray-500">
                        Page <span className="font-bold text-navy-700">{page}</span> of <span className="font-bold text-navy-700">{totalPages}</span> ({totalProducts} products)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition duration-200 ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-50 text-brand-500 hover:bg-brand-100'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages || loading}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition duration-200 ${page >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-50 text-brand-500 hover:bg-brand-100'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-800 animate-in fade-in zoom-in duration-200">
                            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                                <InputField label="Product Name *" id="product_name" type="text" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} required />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Brand</label>
                                        <select
                                            className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                            value={formData.brand_id}
                                            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                                        >
                                            <option value="">Select Brand...</option>
                                            {brands.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputField label="Unit (e.g. 1kg, 500g)" id="unit" type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Price *" id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                    <InputField label="Discount Price" id="discount_price" type="number" step="0.01" value={formData.discount_price} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <InputField label="Stock" id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    <InputField label="Rating" id="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                                    <InputField label="Reviews" id="review_count" type="number" value={formData.review_count} onChange={(e) => setFormData({ ...formData, review_count: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Category *</label>
                                        <select
                                            className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Subcategory</label>
                                        <select
                                            className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                            value={formData.subcategory_id}
                                            onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                                        >
                                            <option value="">Select Subcategory...</option>
                                            {subcategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Images (Click to select)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col items-center gap-1 border-2 border-dashed border-gray-200 rounded-xl p-2">
                                            <span className="text-[10px] font-bold text-gray-400">Main *</span>
                                            <input type="file" className="text-[10px] w-full" onChange={(e) => setFormData({ ...formData, product_image_file: e.target.files[0] })} />
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-2 border-dashed border-gray-200 rounded-xl p-2">
                                            <span className="text-[10px] font-bold text-gray-400">Img 2</span>
                                            <input type="file" className="text-[10px] w-full" onChange={(e) => setFormData({ ...formData, image2_file: e.target.files[0] })} />
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-2 border-dashed border-gray-200 rounded-xl p-2">
                                            <span className="text-[10px] font-bold text-gray-400">Img 3</span>
                                            <input type="file" className="text-[10px] w-full" onChange={(e) => setFormData({ ...formData, image3_file: e.target.files[0] })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Expiry Date" id="expiry_date" type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} />
                                    <div className="flex flex-col gap-2 mt-5">
                                        <label className="flex items-center gap-2 text-sm font-bold text-navy-700 dark:text-white cursor-pointer hover:text-brand-500">
                                            <input type="checkbox" className="w-4 h-4 rounded text-brand-500" checked={formData.is_featured === 1} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })} />
                                            Featured
                                        </label>
                                        <label className="flex items-center gap-2 text-sm font-bold text-navy-700 dark:text-white cursor-pointer hover:text-brand-500">
                                            <input type="checkbox" className="w-4 h-4 rounded text-brand-500" checked={formData.is_trending === 1} onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked ? 1 : 0 })} />
                                            Trending
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Description</label>
                                    <textarea
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white focus:border-brand-500 transition-colors"
                                        rows="3"
                                        value={formData.product_description}
                                        onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-navy-700 dark:text-white hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all">
                                        {editingProduct ? "Update Product" : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {viewingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-800 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-navy-700 dark:text-white">Product Details</h3>
                                <button onClick={() => setViewingProduct(null)} className="text-gray-400 hover:text-gray-600"><MdAdd className="rotate-45 text-2xl" /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100">
                                        <img
                                            src={viewingProduct.product_image ? (viewingProduct.product_image.startsWith('http') ? viewingProduct.product_image : BASE_URL + viewingProduct.product_image) : 'https://placehold.co/400x400?text=No+Image'}
                                            alt={viewingProduct.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {viewingProduct.image2 && (
                                            <img src={viewingProduct.image2.startsWith('http') ? viewingProduct.image2 : BASE_URL + viewingProduct.image2} className="h-24 w-full rounded-xl object-cover border border-gray-100" />
                                        )}
                                        {viewingProduct.image3 && (
                                            <img src={viewingProduct.image3.startsWith('http') ? viewingProduct.image3 : BASE_URL + viewingProduct.image3} className="h-24 w-full rounded-xl object-cover border border-gray-100" />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</p>
                                        <p className="text-xl font-bold text-navy-700 dark:text-white">{viewingProduct.product_name}</p>
                                        <p className="text-sm text-gray-500 font-medium">{viewingProduct.brand} • {viewingProduct.unit}</p>
                                    </div>

                                    <div className="flex gap-10">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price</p>
                                            <p className="text-lg font-bold text-navy-700 dark:text-white">₹{viewingProduct.price}</p>
                                            {viewingProduct.discount_price > 0 && <p className="text-sm text-green-500 font-bold">₹{viewingProduct.discount_price}</p>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory</p>
                                            <p className={`text-lg font-bold ${viewingProduct.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>{viewingProduct.stock} units</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-10">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</p>
                                            <p className="text-lg font-bold text-navy-700 dark:text-white">{viewingProduct.rating || 0} <span className="text-orange-400">★</span></p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reviews</p>
                                            <p className="text-lg font-bold text-navy-700 dark:text-white">{viewingProduct.review_count || 0}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-3 rounded-xl ${viewingProduct.is_featured ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'} text-center font-bold text-xs`}>
                                            FEATURED
                                        </div>
                                        <div className={`p-3 rounded-xl ${viewingProduct.is_trending ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'} text-center font-bold text-xs`}>
                                            TRENDING
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{viewingProduct.product_description || 'No description provided.'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-[10px] text-gray-400">Category ID: {viewingProduct.category_id || 'N/A'}</p>
                                        {viewingProduct.expiry_date && <p className="text-[10px] text-red-400">Expires: {new Date(viewingProduct.expiry_date).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button onClick={() => setViewingProduct(null)} className="w-full rounded-xl bg-navy-700 py-3 text-sm font-bold text-white hover:bg-navy-800 transition-colors">Close Details</button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default ViewProducts;
