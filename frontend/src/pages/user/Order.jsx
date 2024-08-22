import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { toast } from 'react-toastify';
import {
    IoIosSearch,
    RiCheckboxMultipleFill,
    BsFillBagCheckFill,
    BsBagXFill,
} from "../../components/Icons.jsx";
import { SiTicktick } from "react-icons/si";
import { MetaData, Modal } from "../../components/index.jsx";
import {
    PUBLIC_URL,
} from "../../config/api.config.js";
import convertNumberToINR from "../../handler/NumberToINR.js";
import { getUserOrders, updateOrderStatus } from '../../actions/requestProduct.actions.js';

function UserOrder() {
    const navigate = useNavigate();
    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const [newOrders, setNewOrders] = useState([]);
    const [oldOrders, setOldOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchOrders = async () => {
        setLoading(true);
        const response = await getUserOrders();

        if (response?.success) {
            const newOrdersArray = [];
            const oldOrdersArray = [];

            response?.orders.forEach((order) => {
                if (!order?.isDelivered && !(order?.status === "Cancelled") ) {
                    newOrdersArray.push(order);
                } else {
                    oldOrdersArray.push(order);
                }
            });

            setNewOrders(newOrdersArray);
            setOldOrders(oldOrdersArray);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const [orderId, setOrderId] = useState(null);
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const handleCancelOrder = async () => {
        const response = await updateOrderStatus(orderId, "Cancelled");

        if (response?.success) {
            toast.success("Order cancelled successfully");
            fetchOrders();
        }
        setShowCancelOrderModal(false);
    }

    return (
    <div>
        <MetaData title="Dashboard - My Orders" />
        <h2 className="text-xl font-semibold mt-4">My Orders</h2>

        <div className="flex items-center">
            <input
            type="search" name="Search orders here"
            placeholder="Search your orders here..."
            className="text-lg w-full px-3 py-1 my-2 border-2 outline-none focus-within:border-blue-600 rounded-l-md"/>
            <button className="text-2xl font-bold flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-16 h-10 rounded-r-md">
                <IoIosSearch />
            </button>
        </div>

        {
            loading ? (
                <div className="mt-2 flex flex-col gap-4">
                    <p className="p-6 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="p-4 w-[80%] rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="p-4 w-[60%] rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="p-4 w-[30%] rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="p-4 w-[40%] rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="p-4 w-[50%] rounded-md bg-slate-200 animate-pulse"></p>
                </div>
            ) : (
            <>
            <h2 className="text-xl font-semibold mt-4">New Orders</h2>

            <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            {
                newOrders?.length === 0 ? (
                <div>
                    <p className="text-center text-gray-400">No new order found !</p>
                </div>
                ) : (
                    newOrders?.map((order) => (
                    <>
                    {
                        order?.orderItems?.map((item) => (
                            <div 
                            key={uuidv4()}
                            className="card-body p-2 bg-slate-50 rounded-md flex items-center gap-2 hover:shadow-md">
                                    <div className="w-[10%] h-36">
                                        <img
                                        className="w-full h-full object-contain"
                                        src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/${item?.product?.images[0]}`}
                                        alt={item?.product?.name} />
                                    </div>
                                    <div className="w-[90%] px-4 py-2 flex justify-between">
                                        <div className="flex flex-col w-[35%] gap-2">
                                            <h2
                                            onClick={() => navigate(`/product/${formatUrl(item?.product?.name)}/${item?.product?._id}`)}
                                            className="font-semibold cursor-pointer hover:text-blue-500 w-fit tracking-wider text-ellipsis line-clamp-1">
                                                {item?.product?.name}
                                            </h2>
                                            <h4 className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                                                {item?.product?.brand}
                                            </h4>
                
                                        </div>
                
                                        <div className="flex items-center w-[10%]">
                                            <div className="flex flex-col gap-2">
                                                <span className="font-medium tracking-wider">
                                                    {convertNumberToINR(item?.product?.sellingPrice)}
                                                </span>
                                                <span className="font-bold text-green-500 italic font-serif tracking-wide">
                                                    {item?.product?.discount}% off
                                                </span>
                                                {
                                                order?.coupon && (
                                                    <span className="text-xs text-gray-500 font-semibold tracking-wide flex flex-col">
                                                        Coupon
                                                        <span className="text-blue-500 font-serif italic">
                                                            {order?.coupon?.code} get {order?.coupon?.discountType === 'Percentage' ? `${order?.coupon?.discountValue}%` : `₹${order?.coupon?.discountValue}`} off
                                                        </span>
                                                    </span>
                                                )
                                                }
                                            </div>
                                            
                                        </div>
            
                                        <div className="flex items-center w-[30%]">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center font-medium gap-2 text-sm">
                                                    <span className="text-xl font-medium tracking-wider">
                                                        <BsFillBagCheckFill className="text-green-500" />
                                                    </span>
                                                    <span>
                                                        Ordered on {moment(order?.createdAt).format('lll')}.
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start gap-2 text-gray-500 text-sm">
                                                    <span>
                                                    {
                                                        !order?.isPaid && (
                                                            "Complete your payment process"
                                                        )
                                                    }
                                                    </span>
                                                    <span>
                                                    Order Status: <span className="text-orange-500 font-bold">
                                                        "{
                                                            order?.status && (
                                                                order?.status
                                                            )
                                                        }"
                                                    </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        ))
                    }
                    {
                        !(order?.status === "Cancelled") && (
                            <div 
                            key={uuidv4()}
                            className="my-2 border-b-2 py-4">
                                {
                                    !order?.isPaid && (
                                        <h4 className="text-lg text-gray-600 font-medium">Your order payment has been pending ! Please complete your payment process</h4>
                                    )
                                }
                                {
                                    order?.isPaid && (
                                        <h4 className="text-lg font-medium flex items-center gap-2">
                                            <SiTicktick className="text-xl text-green-500" />Your order payment has been successfully completed ! ( {moment(order?.paidAt).format('LLLL')} )</h4>
                                    )
                                }
                                {
                                    order?.deliveredAt && (
                                        <h4 className="text-lg text-gray-800 font-medium">Your order has been delivered on <span className="text-orange-500 font-bold">{moment(order?.deliveredAt).format('LLLL')}</span></h4>
                                    )
                                }
                                <div className="flex gap-2 mt-2">
                                    {
                                        !order?.isPaid && (
                                            <button
                                            onClick={() => navigate(`/payment/shop-pay/${order?._id}`)}
                                            className="px-8 py-2 mt-2 rounded-md font-semibold text-white bg-orange-500 hover:bg-opacity-90">Pay Now</button>
                                        )
                                    }
    
                                    <button 
                                    onClick={() => ( setShowCancelOrderModal(true), setOrderId(order?._id) )}
                                    className="px-4 py-2 mt-2 rounded-md font-semibold text-white bg-red-500 hover:bg-opacity-90">Cancel Order</button>
                                </div>
                            </div>
                        ) 
                    }
                    </>
                    ))
                )
            }
            </div>

            <h2 className="text-xl font-semibold mt-4">Old Orders</h2>

            <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            {
                oldOrders?.length === 0 ? (
                    <div className="mt-2">
                        <h4 className="text-lg text-gray-600 font-medium">No old orders found !</h4>
                    </div>
                ) : (
                    oldOrders?.map((order) => (
                        (order?.status === "Cancelled") ? (
                            <div
                            className="border p-4 rounded-md"
                            key={uuidv4()}
                            >
                                <div className="flex items-center gap-2 p-2 bg-red-500 rounded-md hover:shadow-md">
                                    <BsBagXFill className="w-6 h-6 text-white" />
                                    <span className="text-lg font-bold text-white">
                                        Order has been cancelled
                                    </span>
                                </div>
                                <p className="text-lg text-gray-600 font-medium mt-2">Your payment will be refunded with in 4-5 working days.</p>
                                <p className="mt-2">
                                    <span className="font-semibold text-gray-600">Order ID: </span>
                                    <span className="font-bold">{order?._id}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-600">Total Items: </span>
                                    <span className="font-bold">
                                        {order?.orderItems?.length} items
                                    </span>
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-600">Total Amount: </span>
                                    <span className="font-bold text-green-500">
                                        {convertNumberToINR(order?.totalPrice)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-600">
                                        Ordered on: {moment(order?.createdAt).format('lll')}.
                                    </span>
                                </p>
                            </div>
                        ) : (
                            order?.orderItems?.map((item) => (
                                <div 
                                key={uuidv4()}
                                className="card-body p-2 bg-slate-50 rounded-md flex items-center gap-2 hover:shadow-md">
                                    <div className="w-[10%] h-36">
                                        <img
                                        className="w-full h-full object-contain"
                                        src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/${item?.product?.images[0]}`}
                                        alt={item?.product?.name} />
                                    </div>
                                    <div className="w-[90%] px-4 py-2 flex justify-between">
                                        <div className="flex flex-col w-[30%] gap-2">
                                            <h2
                                            onClick={() => navigate(`/product/${formatUrl(item?.product?.name)}/${item?.product?._id}`)}
                                            className="font-semibold cursor-pointer hover:text-blue-500 w-fit tracking-wider text-ellipsis line-clamp-1">
                                                {item?.product?.name}
                                            </h2>
                                            <h4 className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                                                {item?.product?.brand}
                                            </h4>
                
                                        </div>
                
                                        <div className="flex items-center w-[25%]">
                                            <div className="flex flex-col gap-2">
                                                <span className="font-medium tracking-wider">
                                                    {convertNumberToINR(item?.product?.sellingPrice)}
                                                </span>
                                                <span className="font-bold text-green-500 italic font-serif tracking-wide">
                                                    {item?.product?.discount}% off
                                                </span>
                                                {
                                                order?.coupon && (
                                                    <span className="text-xs text-gray-500 font-semibold tracking-wide flex flex-col">
                                                        Coupon
                                                        <span className="text-blue-500 font-serif italic">
                                                            {order?.coupon?.code} get {order?.coupon?.discountType === 'Percentage' ? `${order?.coupon?.discountValue}%` : `₹${order?.coupon?.discountValue}`} off
                                                        </span>
                                                    </span>
                                                )
                                                }
                                            </div>
                                            
                                        </div>
            
                                        <div className="flex items-center w-[30%]">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center font-medium gap-2 text-sm">
                                                    <span className="text-xl font-medium tracking-wider">
                                                        <BsFillBagCheckFill className="text-green-500" />
                                                    </span>
                                                    <span>
                                                        Ordered on {moment(order?.createdAt).format('lll')}.
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <span>
                                                    {
                                                        !order?.isPaid && (
                                                            "Complete your payment process"
                                                        )
                                                    }
                                                    Order Status: <span className="text-orange-500 font-bold">"{
                                                        order?.status && (
                                                            order?.status
                                                        )
                                                    }"</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ))
                )
            }
            </div>
            </>
            )
        }

        {/* delete address modal */}
        <Modal isOpen={showCancelOrderModal} title="Confirm Cancel Order" onClose={() => setShowCancelOrderModal(false)}>
            <div className="grid gap-2">
                <p className="my-3">Are you sure you want to cancel this order ?</p>

                <button
                onClick={() => handleCancelOrder()}
                className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Cancel Order
                </button>
            </div>
        </Modal>
    </div>
    )
}

export default UserOrder;