import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from "react-toastify";
import BackButton from "../components/BackButton.jsx";
import { getSingleOrder, makeOrderPayment } from '../actions/requestProduct.actions.js';
import convertNumberToINR from "../handler/NumberToINR.js";

function Payment() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState("");

    const fetchOrders = async () => {
        const response = await getSingleOrder(orderId);

        if (response?.success) {
            setOrder(response?.order);
        }
    }

    useEffect(() => {
        if (orderId) {
            fetchOrders();
        }
    }, []);

    const [email, setEmail] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [totalAmount, setTotalAmount] = useState("");

    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const handleOrderPayment = async (e) => {
        e.preventDefault();
        
        if (!email?.trim() || !cardNo.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardHolderName.trim() || !totalAmount) {
            toast.error("All fields must be provided");
            return;
        }
        
        setPaymentProcessing(true);
        const paymentData = {
            orderId,
            email,
            expiryDate: cardExpiry,
            cardNumber: cardNo,
            cvv: cardCvv,
            cardHolderName,
            amount: totalAmount
        };
        
        const response = await makeOrderPayment(paymentData);

        setTimeout(() => {
            if (response?.success) {
                toast.success("Order payment successful");
                setEmail("");
                setCardNo("");
                setCardExpiry("");
                setCardCvv("");
                setCardHolderName("");
                setTotalAmount("");
                // Redirect to order success page
                navigate(`/payment/success/t/${orderId}/${true}`);
            }
            
            if (response?.error) {
                toast.error("Payment process failed !");
            }
            setPaymentProcessing(false);
        }, 2000);
    }

    return (
    <>
    <div
    className="w-10/12 min-h-[80vh] px-6 py-8 mx-auto my-4 shadow-lg bg-white rounded-md"
    >
        <h2 className="flex items-center gap-4 text-xl">
            <BackButton />
            <span className="font-bold">Shopkart</span>
            <span className="font-serif font-bold italic tracking-wider text-orange-600">ShopPay</span>
        </h2>

        <div className="mt-4 p-2 border rounded-md flex gap-2">
            <div className="w-[50%] px-4 py-2 bg-slate-100 rounded-md">
                <h2 className="text-lg text-gray-900 font-bold">Order Information</h2>

                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-2">
                        <span className="font-medium text-gray-800">Order ID:</span>
                        <span className="font-semibold text-gray-600">{order?._id}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-medium text-gray-800">Date:</span>
                        <span className="font-semibold text-gray-600">
                            {moment(order?.createdAt).format("LLLL")}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg text-gray-800 font-medium">Total {order?.orderItems?.length} items has been ordered.</h2>
                        <div className="flex flex-col gap-2">
                        {
                            order?.orderItems?.map((item) => (
                                <div key={item._id} className="flex flex-col">
                                    <p className="font-medium text-gray-800 truncate w-[80%]">{item?.product?.name}</p>
                                    <p className="font-semibold text-gray-400">Qty: {item?.qty}</p>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-gray-800">Shipping Price:</span>
                        <span className="font-bold text-green-600 tracking-wider">{convertNumberToINR(order?.shippingPrice)}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-gray-800">Total Price:</span>
                        <span className="font-bold text-green-600 tracking-wider">{convertNumberToINR(order?.totalPrice)}</span>
                    </div>
                </div>
            </div>

            <div className="w-[50%] px-4 py-2">
                <h2 className="text-lg text-gray-900 font-bold">Payment Information</h2>

                <div className="mt-2">
                    <form
                    onSubmit={handleOrderPayment}
                    className="grid gap-2"
                    >
                        <label htmlFor="email" className="text-gray-600 font-medium">Email Address</label>
                        <div>
                            <input 
                            type="text" 
                            id="email"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            placeholder="Enter your email-id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <label htmlFor="card-no" className="text-gray-600 font-medium">Card Number</label>
                        <div>
                            <input 
                            type="text" 
                            id="card-no"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            placeholder="Enter your card number"
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value)}
                            />
                        </div>
                        <label htmlFor="card-expiry" className="text-gray-600 font-medium">Card Expiry Date</label>
                        <div>
                            <input 
                            type="text" 
                            id="card-expiry"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            placeholder="MM / YYYY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            />
                        </div>
                        <label htmlFor="card-cvv" className="text-gray-600 font-medium">Card CVV Number</label>
                        <div>
                            <input 
                            type="text" 
                            id="card-cvv"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            placeholder="XXX"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            />
                        </div>
                        <label htmlFor="card-holder-name" className="text-gray-600 font-medium">Card Holder Name</label>
                        <div>
                            <input 
                            type="text" 
                            id="card-holder-name"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            placeholder="Enter name of cardholder"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            />
                        </div>
                        {/* <label htmlFor="amount" className="text-gray-600 font-medium">Total Amount (in ₹)</label>
                        <div>
                            <input 
                            type="text" 
                            id="amount"
                            className="w-full px-2 py-1  outline-none border-2 focus-within:border-blue-500 rounded-md"
                            value={totalAmount}
                            onChange={() => setTotalAmount(order?.totalPrice)}
                            readOnly
                            />
                        </div> */}
                        {
                            paymentProcessing && (
                                <div className="flex items-center bg-orange-100 px-4 py-2 rounded-md">
                                    <span
                                        className="h-8 w-8 mr-4 border-2 border-orange-600 rounded-full animate-spin border-t-transparent"
                                        viewBox="0 0 24 24"
                                    ></span>
                                    <h2 className="text-lg font-medium tracking-wider">
                                        Payment Processing<span className="text-2xl font-bold animate-pulse">....</span>
                                    </h2>
                                </div>
                            )
                        }
                        
                        <button
                        onClick={() => setTotalAmount(order?.totalPrice)}
                        disabled={paymentProcessing}
                        className="p-2 mt-2 rounded-md font-medium uppercase text-white bg-orange-500 hover:bg-opacity-90 tracking-wide">
                            Pay {convertNumberToINR(order?.totalPrice)}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}

export default Payment;