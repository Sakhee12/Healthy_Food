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

function ViewCategories() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [viewingCategory, setViewingCategory] = useState(null);

    // Get user role for permissions
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user?.role?.toLowerCase() || "";

    const canManage = ["superadmin", "admin"].includes(userRole);

    const [formData, setFormData] = useState({
        category_name: "",
        slug: "",
        description: "",
        category_image: "",
        banner_image: "",
        parent_id: "",
        display_order: 0,
        status: 1,
        category_image_file: null,
        banner_image_file: null
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllCategories();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({
            category_name: "", slug: "", description: "", category_image: "", banner_image: "",
            parent_id: "", display_order: 0, status: 1,
            category_image_file: null, banner_image_file: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();

        // Append non-image text fields
        Object.keys(formData).forEach(key => {
            if (!key.endsWith('_file') && key !== 'category_image' && key !== 'banner_image') {
                if (formData[key] !== null && formData[key] !== undefined) {
                    submissionData.append(key, formData[key]);
                }
            }
        });

        // Handle category_image: send file if exists, else send existing string/URL
        if (formData.category_image_file) {
            submissionData.append('category_image_file', formData.category_image_file);
        } else if (formData.category_image) {
            submissionData.append('category_image', formData.category_image);
        }

        // Handle banner_image: send file if exists, else send existing string/URL
        if (formData.banner_image_file) {
            submissionData.append('banner_image_file', formData.banner_image_file);
        } else if (formData.banner_image) {
            submissionData.append('banner_image', formData.banner_image);
        }

        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, submissionData);
                alert("Category updated!");
            } else {
                await adminService.addCategory(submissionData);
                alert("Category added!");
            }
            setShowModal(false);
            setEditingCategory(null);
            resetForm();
            fetchCategories();
        } catch (error) {
            alert("Error saving category");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            category_name: category.category_name || "",
            slug: category.slug || "",
            description: category.description || "",
            category_image: category.category_image || "",
            banner_image: category.banner_image || "",
            parent_id: category.parent_id || "",
            display_order: category.display_order || 0,
            status: category.status !== undefined ? category.status : 1,
            category_image_file: null,
            banner_image_file: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this category?")) {
            try {
                await adminService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                alert("Error deleting category");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("category_image", {
            header: () => <p className="text-sm font-bold text-gray-600">ICON</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    {info.getValue() ? (
                        <img
                            src={info.getValue().startsWith('http') ? info.getValue() : BASE_URL + info.getValue()}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover shadow-sm"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">N/A</div>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor("category_name", {
            header: () => <p className="text-sm font-bold text-navy-700">NAME</p>,
            cell: (info) => (
                <div>
                    <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">/{info.row.original.slug || info.getValue().toLowerCase().replace(/ /g, '-')}</p>
                </div>
            ),
        }),
        columnHelper.accessor("banner_image", {
            header: () => <p className="text-sm font-bold text-gray-600">BANNER</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    {info.getValue() ? (
                        <img
                            src={info.getValue().startsWith('http') ? info.getValue() : BASE_URL + info.getValue()}
                            alt=""
                            className="h-8 w-16 rounded-md object-cover overflow-hidden"
                            onError={(e) => { e.target.hidden = true; }}
                        />
                    ) : (
                        <span className="text-[10px] text-gray-300">No Banner</span>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor("display_order", {
            header: () => <p className="text-sm font-bold text-gray-600">ORDER</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("status", {
            header: () => <p className="text-sm font-bold text-gray-600">STATUS</p>,
            cell: (info) => (
                <p className={`text-sm font-bold ${info.getValue() === 1 ? 'text-green-500' : 'text-red-500'}`}>
                    {info.getValue() === 1 ? 'Active' : 'Inactive'}
                </p>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => setViewingCategory(info.row.original)} className="text-xl text-gray-500 hover:text-navy-700 transition-all hover:scale-110" title="View Details"><MdVisibility /></button>
                    {canManage && <button onClick={() => handleEdit(info.row.original)} className="text-xl text-brand-500 hover:text-brand-600 transition-all hover:scale-110" title="Edit"><MdEdit /></button>}
                    {canManage && <button onClick={() => handleDelete(info.row.original.id)} className="text-xl text-red-500 hover:text-red-600 transition-all hover:scale-110" title="Delete"><MdDelete /></button>}
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
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Category Management</div>
                    {canManage && (
                        <button
                            onClick={() => { setEditingCategory(null); resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                        >
                            <MdAdd /> Add Category
                        </button>
                    )}
                </header>

                <div className="mt-8 overflow-x-scroll">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="7" className="text-center py-10 text-gray-400 font-medium">Loading categories...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="7" className="text-center py-10 text-gray-400 font-medium">No categories found. Click "Add Category" to start.</td></tr> :
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-navy-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Category Name *" id="category_name" type="text" value={formData.category_name} onChange={(e) => setFormData({ ...formData, category_name: e.target.value })} required />
                                    <InputField label="Slug" id="slug" type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Display Order" id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: e.target.value })} />
                                    <InputField label="Parent ID" id="parent_id" type="number" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Category Icon</label>
                                        <input
                                            type="file"
                                            className="text-xs border-2 border-dashed border-gray-100 rounded-xl p-3"
                                            onChange={(e) => setFormData({ ...formData, category_image_file: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-2">Banner Image</label>
                                        <input
                                            type="file"
                                            className="text-xs border-2 border-dashed border-gray-100 rounded-xl p-3"
                                            onChange={(e) => setFormData({ ...formData, banner_image_file: e.target.files[0] })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Status</label>
                                    <select
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Description</label>
                                    <textarea
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-navy-700 dark:text-white hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all">Save Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {viewingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-navy-800 animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-navy-700 dark:text-white">Category Details</h3>
                                <button onClick={() => setViewingCategory(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><MdAdd className="rotate-45 text-2xl" /></button>
                            </div>

                            <div className="space-y-8">
                                <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                                    <img
                                        src={viewingCategory.banner_image ? (viewingCategory.banner_image.startsWith('http') ? viewingCategory.banner_image : BASE_URL + viewingCategory.banner_image) : 'https://placehold.co/800x200/f3f4f6/94a3b8?text=No+Banner+Image'}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 left-4 flex items-center gap-4">
                                        <div className="h-20 w-20 rounded-2xl border-4 border-white dark:border-navy-800 overflow-hidden shadow-xl bg-white">
                                            <img
                                                src={viewingCategory.category_image ? (viewingCategory.category_image.startsWith('http') ? viewingCategory.category_image : BASE_URL + viewingCategory.category_image) : 'https://placehold.co/100x100?text=Icon'}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category Name</p>
                                            <p className="text-xl font-bold text-navy-700 dark:text-white">{viewingCategory.category_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Slug / URL</p>
                                            <p className="text-sm font-medium text-brand-500 font-mono">/{viewingCategory.slug || viewingCategory.category_name.toLowerCase().replace(/ /g, '-')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order</p>
                                                <p className="text-lg font-bold text-navy-700 dark:text-white">{viewingCategory.display_order}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                <p className={`text-lg font-bold ${viewingCategory.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {viewingCategory.status === 1 ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Parent ID</p>
                                            <p className="text-sm font-bold text-navy-700 dark:text-white">{viewingCategory.parent_id || 'Top Level'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-navy-900 p-4 rounded-xl">{viewingCategory.description || 'No description provided.'}</p>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
                                    <button onClick={() => { setViewingCategory(null); handleEdit(viewingCategory); }} className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all">Edit Category</button>
                                    <button onClick={() => setViewingCategory(null)} className="flex-1 rounded-xl bg-navy-700 py-3 text-sm font-bold text-white hover:bg-navy-800 transition-colors">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default ViewCategories;
