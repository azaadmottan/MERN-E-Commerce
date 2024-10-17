import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllOrders } from "../../actions/requestProduct.actions.js";
import covertNumberToINR from "../../handler/NumberToINR.js";
import { useNavigate } from "react-router-dom";
import { MetaData } from "../../components/index.jsx";

function Order() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        setLoading(true);
        const response = await getAllOrders();

        if (response?.success) {
            setOrders(response?.orders);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const loadingElements = new Array(10).fill(null);

    return (
    <>
    <MetaData title="Admin Dashboard - User Orders" />
    <div>
        <h1 className="text-lg lg:text-xl font-semibold">User Orders</h1>
        <div className="max-h-[450px] overflow-y-auto overflow-x-auto hiddenScrollBar">
            <table className="lg:table-fixed text-xs lg:text-base w-full mt-4 bg-slate-50 rounded-md">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th scope="col" className="p-2">Order ID</th>
                        <th scope="col" className="p-2">Customer ID</th>
                        <th scope="col" className="p-2">Items</th>
                        <th scope="col" className="p-2">Total Price</th>
                        <th scope="col" className="p-2">Payment</th>
                        <th scope="col" className="p-2">Order Status</th>
                    </tr>
                </thead>
                <tbody>
                {
                    loading ? (
                        loadingElements.map((_, index) => (
                        <tr key={index}
                        className="border-b my-4">
                            <td className="p-4"></td>
                        </tr>
                        ))
                    ) : (
                        orders.map((order) => (
                            <tr
                            onClick={() => navigate(`/admin/dashboard/order/${order?._id}`)}
                            key={uuidv4()} className="text-center text-xs lg:text-sm border-b hover:bg-slate-200 cursor-pointer">
                                <td className="truncate p-2">{order?._id}</td>
                                <td className="truncate p-2">{order?.user}</td>
                                <td className="p-2">{order?.orderItems?.length}</td>
                                <td className="p-2 font-medium">{covertNumberToINR(order?.totalPrice)}</td>
                                <td className="p-2">
                                {order?.isPaid ?
                                    <span className="border-2 border-green-500 bg-green-200 font-medium px-2 rounded-full">
                                        Completed
                                    </span>
                                    :
                                    <span className="border-2 border-red-500 bg-red-200 font-medium px-2 rounded-full">
                                        Pending
                                    </span>
                                }
                                </td>
                                <td className="p-1.5">
                                {order?.isDelivered ?
                                    <span className="border-2 border-green-500 bg-green-200 font-medium px-2 rounded-full">
                                        Delivered
                                    </span> 
                                    :
                                    <span className="border-2 border-red-500 bg-red-200 font-medium px-2 rounded-full">
                                        {order?.status}
                                    </span>
                                }
                                </td>
                            </tr>
                        ))
                    )
                }
                </tbody>
            </table>
        </div>
    </div>
    </>
    );
}

export default Order;