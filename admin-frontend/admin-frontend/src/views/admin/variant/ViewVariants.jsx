import Card from "components/card";
import InputField from "components/fields/InputField";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { adminService } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function ViewVariants() {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    // Get user role for permissions
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user?.role?.toLowerCase() || "";
    const canManage = ["superadmin", "admin", "manager", "inventory_manager"].includes(userRole);

    const [formData, setFormData] = useState({
        product_id: "",
        variant_name: "",
        price: 0,
        stock: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [varRes, prodRes] = await Promise.all([
                adminService.getAllVariants(),
                adminService.getAllProducts({ limit: 100 }) // fetch first 100 for dropdown, in real app use search
            ]);
            setData(varRes.data);
            setProducts(prodRes.data?.products || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({ product_id: "", variant_name: "", price: 0, stock: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVariant) {
                await adminService.updateVariant(editingVariant.id, formData);
                alert("Variant updated!");
            } else {
                await adminService.addVariant(formData);
                alert("Variant added!");
            }
            setShowModal(false);
            setEditingVariant(null);
            resetForm();
            fetchData();
        } catch (error) {
            alert("Error saving variant");
        }
    };

    const handleEdit = (v) => {
        setEditingVariant(v);
        setFormData({
            product_id: v.product_id || "",
            variant_name: v.variant_name || "",
            price: v.price || 0,
            stock: v.stock || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this variant?")) {
            try {
                await adminService.deleteVariant(id);
                fetchData();
            } catch (error) {
                alert("Error deleting variant");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("product_name", {
            header: () => <p className="text-sm font-bold text-gray-600">PRODUCT</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() || 'Unassigned'}</p>,
        }),
        columnHelper.accessor("variant_name", {
            header: () => <p className="text-sm font-bold text-navy-700">VARIANT (e.g., 500g)</p>,
            cell: (info) => <p className="text-sm font-bold text-brand-500">{info.getValue()}</p>,
        }),
        columnHelper.accessor("price", {
            header: () => <p className="text-sm font-bold text-gray-600">PRICE (₹)</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">₹{info.getValue()}</p>,
        }),
        columnHelper.accessor("stock", {
            header: () => <p className="text-sm font-bold text-gray-600">STOCK</p>,
            cell: (info) => <p className={`text-sm font-bold ${info.getValue() > 0 ? 'text-green-500' : 'text-red-500'}`}>{info.getValue()}</p>,
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    {canManage && (
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-500 transition-all hover:scale-110 hover:bg-brand-100 active:scale-95"
                            title="Edit"
                        >
                            <MdEdit />
                        </button>
                    )}
                    {canManage && (
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
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Product Variants Management</div>
                    {canManage && (
                        <button
                            onClick={() => { setEditingVariant(null); resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                        >
                            <MdAdd /> Add Variant
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
                            {loading ? <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-medium">Loading variants...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-medium">No variants found.</td></tr> :
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
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-navy-800 shadow-2xl">
                            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                                {editingVariant ? "Edit Variant" : "Add New Variant"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Product</label>
                                    <select
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                        value={formData.product_id}
                                        onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.product_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <InputField label="Variant Name (e.g. 500g) *" id="variant_name" type="text" value={formData.variant_name} onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Price (₹) *" id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                    <InputField label="Stock" id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-navy-700 dark:text-white hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default ViewVariants;
