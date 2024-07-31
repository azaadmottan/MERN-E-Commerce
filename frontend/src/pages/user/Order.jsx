import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
    IoIosSearch,
    RiCheckboxMultipleFill,
    BsFillBagCheckFill,
    BsBagXFill,
} from "../../components/Icons.jsx";
import { Modal } from "../../components/index.jsx";
import {
    PUBLIC_URL,
} from "../../config/api.config.js";
import convertNumberToINR from "../../handler/NumberToINR.js";
import { getUserOrders } from '../../actions/requestProduct.actions.js';

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
    const fetchOrders = async () => {
        const response = await getUserOrders();

        if (response?.success) {
            const newOrdersArray = [];
            const oldOrdersArray = [];

            response?.orders.forEach((order) => {
                if (!order?.isDelivered) {
                    newOrdersArray.push(order);
                } else {
                    oldOrdersArray.push(order);
                }
            });

            setNewOrders(newOrdersArray);
            setOldOrders(oldOrdersArray);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const [orderId, setOrderId] = useState(null);
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const handleCancelOrder = () => {
        console.log(orderId);
    }

    return (
    <div>
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

        <h2 className="text-xl font-semibold mt-4">New Orders</h2>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
        {
        newOrders?.map((order) => (
        <>
        {
            order?.orderItems?.map((item) => (
                <div 
                key={uuidv4()}
                className="card-body p-2 bg-slate-100 rounded-md flex items-center gap-2 hover:shadow-md">
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
                                </div>
                                
                            </div>

                            <div className="flex items-center w-[30%]">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center font-medium gap-2 text-sm">
                                        <span className="text-xl font-medium tracking-wider">
                                            <BsFillBagCheckFill className="text-green-500" />
                                        </span>
                                        <span>
                                            Ordered on {moment(order?.createdAt).format('LL')}.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <span>
                                        {
                                            !order?.isPaid ? (
                                                "Complete your payment process"
                                            ) : (
                                                "Your order in progress"
                                            )
                                        }
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                </div>
            ))
        }
            <div className="my-2 border-b-2 py-4">
                {
                    !order?.isPaid && (
                        <h4 className="text-lg text-gray-600 font-medium">Your order payment has been pending ! Please complete your payment process</h4>
                    )
                }
                {
                    order?.isPaid && (
                        <h4 className="text-lg text-gray-800 font-medium">Your order payment has been successfully completed ! ( {moment(order?.paidAt).format('LLLL')} )</h4>
                    )
                }
                <div className="flex gap-2">
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
        </>
        ))
        }
        </div>

        <h2 className="text-xl font-semibold mt-4">Old Orders</h2>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            <div className="card-body p-2 bg-slate-100 rounded-md flex items-center gap-2 hover:shadow-md">
                    <div className="w-[10%] h-36">
                        <img
                        className="w-full h-full object-contain"
                        src="http://localhost:8000/productImages/iPhone-15-1720078630313.jpeg" 
                        alt="" />
                    </div>
                    <div className="w-[90%] px-4 py-2 flex justify-between">
                        <div className="flex flex-col gap-2">
                            <h2
                            // onClick={() => navigate(`/product/${formatUrl(item?.product?.name)}/${item?.product?._id}`)}
                            className="font-semibold cursor-pointer hover:text-blue-500 w-fit tracking-wider text-ellipsis line-clamp-1">
                                Apple iPhone 15 (Blue, 128 GB)
                            </h2>
                            <h4 className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                                apple
                            </h4>

                        </div>

                        <div className="flex items-center">
                            <div className="flex flex-col gap-2">
                                <span className="font-medium tracking-wider">
                                    ₹71,999
                                </span>
                                <span className="font-bold text-green-500 italic font-serif tracking-wide">
                                    9% off
                                </span>
                            </div>
                            
                        </div>

                        <div className="flex items-center">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center font-medium gap-2 text-sm">
                                    <span className="text-xl font-medium tracking-wider">
                                        <BsFillBagCheckFill className="text-green-500" />
                                    </span>
                                    <span>
                                        Delivered on 12 July, 2024.
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>
                                        Your item has been reached.
                                    </span>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
        </div>

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