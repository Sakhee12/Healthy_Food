import Card from "components/card";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { adminService } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function UserManagementTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                alert("Error deleting user");
            }
        }
    };

    const handleUpdateRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "customer" : "admin";
        try {
            await adminService.updateUserRole(id, newRole);
            fetchUsers();
        } catch (error) {
            alert("Error updating role");
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("phone", {
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">PHONE</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("role", {
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">ROLE</p>
            ),
            cell: (info) => (
                <span className={`text-sm font-bold px-2 py-1 rounded-lg ${info.getValue() === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {info.getValue().toUpperCase()}
                </span>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">ACTIONS</p>
            ),
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleUpdateRole(info.row.original.id, info.row.original.role)}
                        className="text-xl text-brand-500 hover:text-brand-600 dark:text-white"
                        title="Toggle Role"
                    >
                        <MdEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="text-xl text-red-500 hover:text-red-600"
                        title="Delete User"
                    >
                        <MdDelete />
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    return (
        <Card extra={"w-full h-full sm:overflow-auto px-6 pb-6"}>
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    User Management
                </div>
                <button
                    onClick={fetchUsers}
                    className="linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                    Refresh
                </button>
            </header>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                        >
                                            <div className="items-center justify-between text-xs text-gray-200">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-10 font-bold text-navy-700 dark:text-white">
                                    Loading users...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-10 font-bold text-navy-700 dark:text-white">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <td
                                                    key={cell.id}
                                                    className="min-w-[150px] border-white/0 py-3 pr-4"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default UserManagementTable;
