import Card from "components/card";
import { useEffect, useState } from "react";
import { MdDelete, MdPerson } from "react-icons/md";
import { adminService } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function AdminManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getRoles()
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleChange = async (userId, newRoleId) => {
        try {
            await adminService.updateUserRole(userId, newRoleId);
            alert("Role updated successfully!");
            fetchData();
        } catch (error) {
            alert("Error updating role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminService.deleteUser(userId);
                alert("User deleted successfully!");
                fetchData();
            } catch (error) {
                alert("Error deleting user");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("name", {
            header: () => <p className="text-sm font-bold text-gray-600">NAME</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-500">
                        <MdPerson />
                    </div>
                    <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
                </div>
            ),
        }),
        columnHelper.accessor("email", {
            header: () => <p className="text-sm font-bold text-gray-600">EMAIL</p>,
            cell: (info) => <p className="text-sm font-medium text-navy-700">{info.getValue() || "N/A"}</p>,
        }),
        columnHelper.accessor("phone", {
            header: () => <p className="text-sm font-bold text-gray-600">PHONE</p>,
            cell: (info) => <p className="text-sm font-medium text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("role", {
            header: () => <p className="text-sm font-bold text-gray-600">CURRENT ROLE</p>,
            cell: (info) => (
                <span className="capitalize px-2 py-1 rounded-md bg-gray-100 text-xs font-bold text-gray-600">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.display({
            id: "change_role",
            header: () => <p className="text-sm font-bold text-gray-600">CHANGE ROLE</p>,
            cell: (info) => (
                <select
                    className="text-xs font-bold text-navy-700 border border-gray-200 rounded-lg p-1 outline-none"
                    value={info.row.original.role_id}
                    onChange={(e) => handleRoleChange(info.row.original.id, e.target.value)}
                >
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.role_name}
                        </option>
                    ))}
                </select>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <button
                    onClick={() => handleDeleteUser(info.row.original.id)}
                    className="text-xl text-red-500 hover:text-red-600 transition-all hover:scale-110"
                    title="Delete User"
                >
                    <MdDelete />
                </button>
            ),
        }),
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex w-full flex-col gap-5 pt-8">
            <Card extra={"w-full h-full sm:overflow-auto px-6 pb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Admin Management
                    </div>
                </header>

                <div className="mt-8 overflow-x-scroll">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                        >
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-400 font-medium">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-400 font-medium">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default AdminManagement;
