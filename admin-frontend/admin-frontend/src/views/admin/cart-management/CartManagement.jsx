import Card from "components/card";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart, MdVisibility, MdPerson, MdRefresh } from "react-icons/md";
import { adminService, BASE_URL } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function CartManagement() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCart, setSelectedCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllCarts();
            setCarts(res.data);
        } catch (error) {
            console.error("Error fetching carts:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const viewCartItems = async (cart) => {
        setSelectedCart(cart);
        try {
            const res = await adminService.getCartDetails(cart.id);
            setCartItems(res.data);
            setShowModal(true);
        } catch (error) {
            alert("Error fetching cart items");
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("user_name", {
            header: () => <p className="text-sm font-bold text-gray-600">CUSTOMER</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-500">
                        <MdPerson size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
                        <p className="text-xs text-gray-400">{info.row.original.user_email}</p>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor("total_items", {
            header: () => <p className="text-sm font-bold text-gray-600">ITEMS</p>,
            cell: (info) => <p className="text-sm font-medium text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("total_price", {
            header: () => <p className="text-sm font-bold text-gray-600">TOTAL VALUE</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">₹{parseFloat(info.getValue()).toLocaleString()}</p>,
        }),
        columnHelper.accessor("updated_at", {
            header: () => <p className="text-sm font-bold text-gray-600">LAST UPDATED</p>,
            cell: (info) => {
                const date = new Date(info.getValue());
                return <p className="text-sm font-medium text-gray-600">{date.toLocaleString()}</p>;
            },
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <button
                    onClick={() => viewCartItems(info.row.original)}
                    className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-500 transition-all hover:bg-brand-100"
                >
                    <MdVisibility className="h-4 w-4" /> View items
                </button>
            ),
        }),
    ];

    const table = useReactTable({
        data: carts,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex w-full flex-col gap-5 pt-8">
            <Card extra={"w-full h-full sm:overflow-auto px-6 pb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg">
                            <MdOutlineShoppingCart className="h-6 w-6" />
                        </div>
                        <div className="text-xl font-bold text-navy-700 dark:text-white">Active User Carts</div>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-1 rounded-xl bg-lightPrimary p-2.5 text-navy-700 transition duration-200 hover:bg-gray-100 active:bg-gray-200"
                    >
                        <MdRefresh className="h-5 w-5" />
                        <span className="hidden text-sm font-bold sm:inline">Refresh</span>
                    </button>
                </header>

                <div className="mt-8 overflow-x-scroll">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-medium italic">Loading active carts...</td></tr> :
                                carts.length === 0 ? <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-medium">No active carts found at the moment.</td></tr> :
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

                {/* Cart Preview Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all dark:bg-navy-800">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-xl font-bold text-navy-700 dark:text-white">
                                    Cart Content for {selectedCart?.user_name}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                                {cartItems.length === 0 ? <p className="py-4 text-center text-gray-400">No items in this cart.</p> :
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 rounded-xl border p-3 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5">
                                                <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                                    {item.product_image && (
                                                        <img
                                                            src={item.product_image.startsWith('http') ? item.product_image : `${BASE_URL}${item.product_image.startsWith('/') ? '' : '/'}${item.product_image}`}
                                                            alt={item.product_name}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://placehold.co/48x48/f3f4f6/94a3b8?text=Error'; }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-navy-700 dark:text-white">{item.product_name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-brand-500">₹{parseFloat(item.total_price).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Value</p>
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">₹{parseFloat(selectedCart?.total_price).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl bg-navy-700 px-8 py-3 text-base font-bold text-white transition duration-200 hover:bg-navy-800 active:bg-brand-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default CartManagement;
