import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { getOrderInfo, updateOrderStatus } from "../../actions/requestProduct.actions.js";
import { PUBLIC_URL } from "../../config/api.config.js";
import covertNumberToINR from "../../handler/NumberToINR.js";
import { MetaData } from "../../components/index.jsx";

function OrderDetail() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        setLoading(true);
        const response = await getOrderInfo(orderId);

        if (response?.success) {
            setOrder(response?.order);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, []);

    const [orderStatus, setOrderStatus] = useState("");
    const [arrivingDate, setArrivingDate] = useState("");
    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
    
        if (selectedDate <= today) {
            toast.warn('Arriving date must be in the future');
            return;
        }
        else {
            setArrivingDate(e.target.value);
        }
    }

    const handleUpdateOrderStatus = async() => {
        if (!orderStatus) {
            toast.error("Order status must be selected.");
            return;
        }

        if (orderId && orderStatus || arrivingDate) {
            const response = await updateOrderStatus(orderId, orderStatus, arrivingDate);
            if (response?.success) {
                toast.success("Order Status updated successfully");
                fetchOrder();
            }
        }
    }

    return (
    <>
    <MetaData title="Admin Dashboard - Order Detail" />
    <div>
        <h2 className="text-lg lg:text-xl font-medium">Order Details</h2>
        {
            loading ? (
                <div className="border-2 rounded-md px-4 py-2 mt-4 flex flex-col gap-4">
                    <p className="p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[60%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[40%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[40%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[80%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[80%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[30%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[90%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                    <p className="w-[90%] p-4 rounded-md bg-slate-200 animate-pulse"></p>
                </div>
            ) : (
                <div className="border-2 rounded-md px-4 py-2 mt-4 flex flex-col gap-2">
                    <div className="text-sm lg:text-base flex items-center justify-between font-semibold text-gray-900">
                        <h5>
                            Ordered on: <span className="font-bold">{moment(order?.createdAt).format('LLLL')}</span>
                        </h5>
                        <h5>
                            Order Status: <span className="border-2 border-green-600 text-sm font-medium text-black bg-green-200 rounded-full px-2">
                            {
                                // order?.isDelivered? "Delivered" : "Pending"
                                order?.status
                            }
                            </span> 
                        </h5>
                    </div>

                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                        <h5>
                            Order Id: <span className="font-bold">{order?._id}</span>
                        </h5>
                        <h5>
                            Total Amount: <span className="font-bold">{covertNumberToINR(order?.totalPrice)}</span>
                        </h5>
                        <p>
                            Order Delivery Date: <span className="font-bold text-green-500">{
                                order?.deliveredAt? moment(order?.deliveredAt).format('LLLL') : "N/A"
                            }</span>
                        </p>
                    </div>

                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                        <h2>
                            User Info
                        </h2>
                        <div className="mt-2 p-3 bg-slate-100 rounded-md">
                            <h5>
                                User Name: <span className="font-bold">{order?.user?.fullName}</span>
                            </h5>
                            <h5>
                                Email-id: <span className="font-bold">{order?.user?.email}</span>
                            </h5>
                        </div>
                    </div>

                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                        <h2>
                            Order Items
                        </h2>
                        <div className="max-h-[400px] overflow-y-auto flex flex-col gap-3 p-3">
                        {
                            order?.orderItems?.map((item) => (
                                <div
                                key={uuidv4()}
                                className="bg-slate-100 rounded-md p-2 flex items-center gap-2 hover:shadow-md">
                                    <div className="w-28 h-28">
                                        <img 
                                        className="w-full h-full object-contain"
                                        src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/${item?.product?.images[0]}`} alt="" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h5 className="text-sm lg:text-lg font-medium w-[400px] truncate">
                                        {
                                            item?.product?.name
                                        }
                                        </h5>
                                        <h6 className="text-xs lg:text-sm font-medium text-gray-600">
                                            Qty: {item?.qty}
                                        </h6>
                                        <h6 className="font-bold text-green-500 tracking-wider">
                                        {
                                            covertNumberToINR(item?.product?.sellingPrice)
                                        }
                                        </h6>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    
                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                        <h2>
                            Payment Info
                        </h2>
                        {
                        order?.paymentInfo?.paymentMethod === "Card" ? (
                            <div className="mt-2 p-3 bg-slate-100 rounded-md">
                                <h5>
                                    Payment Method: <span className="font-bold text-green-500">
                                    {
                                        order?.paymentInfo?.paymentMethod
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Card Holder Name: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.cardHolderName
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Email-id: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.email
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Amount: <span className="font-bold">
                                    {
                                        covertNumberToINR(order?.paymentInfo?.amount)
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Payment Created At: <span className="font-bold">
                                    {
                                        moment(order?.paymentInfo?.createdAt).format("LLLL")
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Payment Status: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.status
                                    }
                                    </span>
                                </h5>
                            </div>
                        ) : (
                            <div className="mt-2 p-3 bg-slate-100 rounded-md">
                                <h5>
                                    Payment Method: <span className="font-bold text-green-500">
                                    {
                                        order?.paymentInfo?.paymentMethod
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Sender UPI ID: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.senderUpiId
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Receiver UPI ID: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.receiverUpiId
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Amount: <span className="font-bold">
                                    {
                                        covertNumberToINR(order?.paymentInfo?.amount)
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Payment Created At: <span className="font-bold">
                                    {
                                        moment(order?.paymentInfo?.createdAt).format("LLLL")
                                    }
                                    </span>
                                </h5>
                                <h5>
                                    Payment Status: <span className="font-bold">
                                    {
                                        order?.paymentInfo?.status
                                    }
                                    </span>
                                </h5>
                            </div>
                        )
                        }
                    </div>

                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                        <h2>
                            Shipping Info
                        </h2>
                        <div className="mt-2 p-3 bg-slate-100 rounded-md">
                            <h5>
                                Country: <span className="font-bold">
                                {
                                    order?.shippingAddress?.country
                                }
                                </span>
                            </h5>
                            <h5>
                                State: <span className="font-bold">
                                {
                                    order?.shippingAddress?.state
                                }
                                </span>
                            </h5>
                            <h5>
                                City: <span className="font-bold">
                                {
                                    order?.shippingAddress?.city
                                }
                                </span>
                            </h5>
                            <h5>
                                Postal Code: <span className="font-bold">
                                {
                                    order?.shippingAddress?.postalCode
                                }
                                </span>
                            </h5>
                            <h5>
                                Phone: <span className="font-bold">
                                {
                                    order?.shippingAddress?.phone
                                }
                                </span>
                            </h5>
                            <h5>
                                Address: <span className="font-bold">
                                {
                                    order?.shippingAddress?.address
                                }
                                </span>
                            </h5>
                        </div>
                    </div>

                    <div className="p-2 bg-slate-100 rounded-md flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                        <p className="text-base lg:text-lg font-medium text-gray-800">Update Order Status</p>
                        <select 
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="border-2 hover:border-blue-600 rounded-md px-4 cursor-pointer">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-base lg:text-lg font-medium text-gray-800">Arriving Date</p>
                            <input
                            value={arrivingDate}
                            onChange={handleDateChange}
                            type="date" className="border-2 focus-within:border-blue-500 rounded-md px-4 outline-none cursor-pointer" />
                        </div>
                        <button
                        onClick={() => handleUpdateOrderStatus()}
                        className="text-sm lg:text-base bg-orange-500 w-fit text-white rounded-md hover:bg-opacity-85 px-4 py-1 mt-2">Update</button>
                    </div>
                </div>
            )
        }
    </div>
    </>
    );
}

export default OrderDetail;
