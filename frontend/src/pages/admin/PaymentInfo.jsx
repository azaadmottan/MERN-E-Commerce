import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getSinglePayment } from '../../actions/requestProduct.actions';
import convertNumberToINR from '../../handler/NumberToINR.js';
import { MetaData, Modal } from "../../components/index.jsx";
import { createTransaction } from "../../actions/requestProduct.actions.js";
import { MdVerified } from "react-icons/md";

function PaymentInfo() {
    const { paymentId } = useParams();
    const [paymentInfo, setPaymentInfo] = useState([]);
    const [upiDetails, setUpiDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPaymentInfo = async () => {
        setLoading(true);
        if (paymentId) {
            const response = await getSinglePayment(paymentId);
            if (response?.success) {
                setPaymentInfo(response?.payment);
                setUpiDetails(response?.upiDetails);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPaymentInfo();
    }, []);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [senderUpiId, setSenderUpiId] = useState("");
    const [receiverUpiId, setReceiverUpiId] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [password, setPassword] = useState("");

    const [disableBtn, setDisableBtn] = useState(false);
    const submitPaymentForm = async (e) => {
        e.preventDefault();
        setDisableBtn(true);

        if (!senderUpiId.trim() || !receiverUpiId.trim() || !amount || !password.trim()) {
            toast.error("Please enter all required fields");
            setDisableBtn(false);
            return;
        }

        const response = await createTransaction(senderUpiId, receiverUpiId, amount, description, password, paymentStatus);

        if (response?.success) {
            toast.success("Transaction successful: " + convertNumberToINR(response?.transaction?.amount), {
                autoClose: false,
            });
            fetchPaymentInfo();
            setShowPaymentModal(false);
            setSenderUpiId("");
            setReceiverUpiId("");
            setAmount("");
            setDescription("");
            setPaymentStatus("");
            setPassword("");
        }

        if (response?.error) {
            toast.error(response?.message);
        }
        setDisableBtn(false);
    }

    return (
    <>
    <MetaData title="Admin Dashboard - Payment Information" />
    <div>
        <h2 className="text-xl font-medium">User Order Payment Details</h2>

        {
            loading ? (
            <>
                <div className="p-8 my-6 rounded-md bg-slate-200 animate-pulse"></div>
                <p className="p-4 mt-4 rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[50%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[50%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[80%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[70%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[90%] bg-slate-200 animate-pulse"></p>
            </>
            ) : (
            <>    
            {
                paymentInfo?.order?.status === "Cancelled" && (
                    <div className="p-4 my-6 rounded-md bg-orange-200 bg-opacity-65 flex items-center gap-4">
                        <div className="p-1 rounded-r-md bg-orange-500 inline-block h-[25vh]"></div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-medium">Order has been cancelled by user</h2>
                            <p className="text-lg font-semibold">
                                Please refund the order payment before due date !
                            </p>
                            <p className="font-medium">
                                Order Cancel Date: <span className="font-bold">{moment(paymentInfo?.order?.orderCancelledAt).format('LLLL')}</span>
                            </p>
                            <p className="font-medium">Refund Amount: <span className="text-green-500 font-bold">{convertNumberToINR(paymentInfo?.amount)}</span></p>
                            {
                                paymentInfo?.status === "Completed" && (
                                <button
                                onClick={() => (
                                    setShowPaymentModal(true), 
                                    setAmount(paymentInfo?.amount),
                                    setReceiverUpiId(upiDetails?.upiId)
                                )}
                                className="text-white bg-orange-500 font-bold tracking-wider rounded-md px-10 py-2 mt-2 w-fit hover:scale-105 hover:bg-orange-600 transition-all">
                                    Refund Now
                                </button>
                                )
                            }
                            {
                                paymentInfo?.status === "Refunded" && (
                                    <p className="text-green-500 font-bold flex items-center gap-2">
                                        <MdVerified /> Order Payment Refund Successfully !</p>
                                )
                            }
                        </div>
                    </div>
                )
            }

            <div className="border-2 rounded-md px-4 py-2 mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold text-gray-900">
                    <h5>
                        Payment on: <span className="font-bold">{moment(paymentInfo?.createdAt).format('LLLL')}</span>
                    </h5>
                    <h5>
                        Payment Status: <span className="border-2 border-green-600 text-sm font-medium text-black bg-green-200 rounded-full px-2">
                        {
                            paymentInfo?.status
                        }
                        </span> 
                    </h5>
                </div>

                <div className="font-semibold text-gray-900">
                    <h5>
                        Payment Id: <span className="font-bold text-orange-500">{paymentInfo?.paymentId}</span>
                    </h5>
                    <h5>
                        Order Id: <span className="font-bold">{paymentInfo?.order?._id}</span>
                    </h5>
                    <h5>
                        Total Amount: <span className="font-bold">{convertNumberToINR(paymentInfo?.amount)}</span>
                    </h5>
                </div>

                <div className="font-semibold text-gray-900">
                    <h2>
                        User Info
                    </h2>
                    <div className="mt-2 p-3 bg-slate-100 rounded-md">
                        <h5>
                            User Name: <span className="font-bold">{paymentInfo?.user?.fullName}</span>
                        </h5>
                        <h5>
                            Email-id: <span className="font-bold">{paymentInfo?.user?.email}</span>
                        </h5>
                    </div>
                </div>

                <div className="font-semibold text-gray-900">
                    <h2>
                        Payment Info
                    </h2>
                    <div className="mt-2 p-3 bg-slate-100 rounded-md">
                        <h5>
                            Card Holder Name: <span className="font-bold">
                            {
                                paymentInfo?.cardHolderName
                            }
                            </span>
                        </h5>
                        <h5>
                            Email-id: <span className="font-bold">
                            {
                                paymentInfo?.email
                            }
                            </span>
                        </h5>
                        <h5>
                            Amount: <span className="font-bold">
                            {
                                convertNumberToINR(paymentInfo?.amount)
                            }
                            </span>
                        </h5>
                    </div>
                </div>

                {/* <div className="p-2 bg-slate-100 rounded-md flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-800">Update Order Status</p>
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
                        <p className="text-lg font-medium text-gray-800">Arriving Date</p>
                        <input
                        value={arrivingDate}
                        onChange={handleDateChange}
                        type="date" className="border-2 focus-within:border-blue-500 rounded-md px-4 outline-none cursor-pointer" />
                    </div>
                    <button
                    onClick={() => handleUpdateOrderStatus()}
                    className="bg-orange-500 w-fit text-white rounded-md hover:bg-opacity-85 px-4 py-1 mt-2">Update</button>
                </div> */}
            </div>
            </>
            )
        }

        {/* payment modal */}
        <Modal isOpen={showPaymentModal} title="Refund Order Payment" onClose={() => (setShowPaymentModal(false), setPassword(""))}>
            <form onSubmit={submitPaymentForm}
            className="grid gap-2">
                <label htmlFor="senderId">Sender UPI Id</label>
                <input type="text" id="senderId" name='senderId'
                value={senderUpiId}
                onChange={(e) => setSenderUpiId(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter sender upi id" />

                <label htmlFor="receiverId">Receiver UPI Id</label>
                <input type="text" id="receiverId" name='receiverId'
                value={receiverUpiId}
                readOnly={true}
                onChange={(e) => setReceiverUpiId(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter receiver upi id" />

                <label htmlFor="amount">Amount (in INR)</label>
                <input type="number" id="amount" name='amount'
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter payment amount" />

                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name='description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter description here"></textarea>

                <label htmlFor="payment-status">Payment Status</label>
                <input type="text" id="payment-status" name='payment-status'
                value={paymentStatus} 
                onChange={(e) => setPaymentStatus(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter payment status" />


                <label htmlFor="password">Password</label>
                <input type="text" id="password" name='password'
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter your upi-id password" />

                <button
                type='submit'
                disabled={disableBtn}
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Confirm Pay
                </button>
            </form>
        </Modal>
    </div>
    </>
    )
}

export default PaymentInfo;