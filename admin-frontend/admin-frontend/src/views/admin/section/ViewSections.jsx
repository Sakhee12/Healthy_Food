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

function ViewSections() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    // Get user role for permissions
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user?.role?.toLowerCase() || "";
    const canManage = ["superadmin", "admin"].includes(userRole);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        status: 1
    });

    const fetchSections = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllSections();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", slug: "", image: "", status: 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSection) {
                await adminService.updateSection(editingSection.id, formData);
                alert("Section updated!");
            } else {
                await adminService.addSection(formData);
                alert("Section added!");
            }
            setShowModal(false);
            setEditingSection(null);
            resetForm();
            fetchSections();
        } catch (error) {
            alert("Error saving section");
        }
    };

    const handleEdit = (section) => {
        setEditingSection(section);
        setFormData({
            name: section.name || "",
            slug: section.slug || "",
            image: section.image || "",
            status: section.status !== undefined ? section.status : 1
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this section?")) {
            try {
                await adminService.deleteSection(id);
                fetchSections();
            } catch (error) {
                alert("Error deleting section");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("image", {
            header: () => <p className="text-sm font-bold text-gray-600">IMAGE</p>,
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
        columnHelper.accessor("name", {
            header: () => <p className="text-sm font-bold text-navy-700">NAME</p>,
            cell: (info) => (
                <div>
                    <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">/{info.row.original.slug || info.getValue().toLowerCase().replace(/ /g, '-')}</p>
                </div>
            ),
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
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Section Management</div>
                    {canManage && (
                        <button
                            onClick={() => { setEditingSection(null); resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                        >
                            <MdAdd /> Add Section
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
                            {loading ? <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">Loading sections...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">No sections found.</td></tr> :
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
                                {editingSection ? "Edit Section" : "Add New Section"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <InputField label="Section Name *" id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <InputField label="Slug" id="slug" type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                <InputField label="Image URL" id="image" type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
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

export default ViewSections;
