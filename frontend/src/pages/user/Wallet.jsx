import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";
import { BsFillHouseLockFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { FiAlertCircle } from "react-icons/fi";
import { MdCallMade } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";
import { createTransaction, getUserWallet } from "../../actions/requestProduct.actions.js";
import convertNumberToINR from "../../handler/NumberToINR.js";
import { MetaData, Modal } from "../../components/index.jsx";
import { toast } from 'react-toastify';

function Wallet() {
    const [userWallet, setUserWallet] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchWallet = async () => {
        setLoading(true);
        const response = await getUserWallet();
        if (response?.success) {
            setUserWallet(response?.wallet);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchWallet();
    }, []);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [senderUpiId, setSenderUpiId] = useState("");
    const [receiverUpiId, setReceiverUpiId] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");

    const [disableBtn, setDisableBtn] = useState(false);
    const submitPaymentForm = async (e) => {
        e.preventDefault();
        setDisableBtn(true);

        if (!senderUpiId.trim() || !receiverUpiId.trim() || !amount.trim() || !password.trim()) {
            toast.error("Please enter all required fields");
            setDisableBtn(false);
            return;
        }

        if (amount > userWallet?.balance) {
            toast.error("Insufficient balance in your wallet");
            setDisableBtn(false);
            return;
        }

        const response = await createTransaction(senderUpiId, receiverUpiId, amount, description, password);

        if (response?.success) {
            toast.success("Transaction successful: " + convertNumberToINR(response?.transaction?.amount));
            fetchWallet();
            setShowPaymentModal(false);
            setSenderUpiId("");
            setReceiverUpiId("");
            setAmount("");
            setDescription("");
            setPassword("");
        }

        if (response?.error) {
            toast.error(response?.message);
        }
        setDisableBtn(false);
    }

    return (
    <>
    <MetaData title="Dashboard - Wallet" />
    {
        loading ? (
            <div className="mt-2 flex flex-col gap-4">
                <p className="p-6 rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[80%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[80%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[60%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[30%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[40%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[70%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[50%] rounded-md bg-slate-200 animate-pulse"></p>
            </div>
        ) : (
        <>
        {
            !userWallet ? (
                <div className="w-full flex items-center justify-center">
                    <div className="w-[50vw] h-[60vh] bg-slate-200 backdrop-blur-l p-4 rounded-md">
                        <div className="w-full h-[55%] flex items-center justify-center">
                            <FaLock className="w-[20%] h-[70%] text-orange-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold">Activate your wallet</h2>
                            <p className="text-lg text-gray-800 font-medium">
                                To access your e-commerce order payments, you need to activate your wallet. Please provide your wallet address and PIN to proceed.
                            </p>
                            <p>
                                Note: <span className='italic font-medium'>Go to your settings to activate wallet.</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold">Your Wallet</h2>
                    {
                        userWallet?.isActive && (
                        <>
                        <div className="flex items-center gap-2 bg-orange-200 bg-opacity-75 p-4 my-2 rounded-md">
                            <div className="p-1 rounded-r-md bg-orange-500 h-16"></div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <MdVerified className="text-blue-500 text-2xl" /> <span className="text-lg font-semibold">
                                        Your wallet has been activated successfully.
                                    </span>
                                </div>
                                <p className="text-gray-800 font-semibold">
                                    Now you can receive (payments, refunds or offer-coins) and also pay any order payments.
                                </p>
                            </div>
                        </div>
                        
                        <div className="my-4">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-600">Wallet UPI-ID:</h4>
                                <span className="font-bold tracking-wide">{userWallet?.upiId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-gray-600">Account Activated At:</h5>
                                <span className="font-semibold">{moment(userWallet?.createdAt).format('LLLL')}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-gray-600">Wallet Balance</h5>
                                <span className="font-bold tracking-wider">{convertNumberToINR(userWallet?.balance)} (INR)</span>
                            </div>
                        </div>
    
                        <div className="my-2 bg-orange-100 p-4 rounded-md">
                            <div className="flex items-center justify-between font-semibold">
                                <h5>Transfer money through wallet</h5>
                                <button
                                disabled={userWallet?.balance <= 0}
                                onClick={() => (setShowPaymentModal(true), setSenderUpiId(userWallet?.upiId))}
                                className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded-md uppercase">Pay Now</button>
                            </div>
                        </div>
    
                        <div>
                            <h2 className="text-lg font-semibold my-2">Transaction History</h2>
    
                            <ul className="max-h-[450px] overflow-y-auto hiddenScrollBar flex flex-col gap-4 border p-4 rounded-md">
                                {
                                userWallet?.transactions?.length > 0 ? (
                                    userWallet?.transactions.map((transaction, index) => (
                                    <li 
                                    className="p-2 rounded-md bg-slate-100 hover:bg-opacity-70 border duration-150 delay-100 hover:border-blue-300"
                                    key={uuidv4()}>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-md text-2xl text-white bg-orange-500">
                                            {
                                                (userWallet?.upiId === transaction?.senderUpiId) ? (
                                                    <MdCallMade />
                                                ) : (
                                                    <MdCallReceived />
                                                )
                                            }
                                            </div>
                                            <div className="w-full px-4 flex flex-col gap-1">
                                                <div className="text-lg flex items-center justify-between">
                                                {
                                                    (userWallet?.upiId === transaction?.senderUpiId) ? (
                                                        <h4 className="font-semibold">Paid To</h4>
                                                    ) : (
                                                        <h4 className="font-semibold">Received From</h4>
                                                    )
                                                }
                                                    <span className="font-semibold tracking-wide">
                                                        {convertNumberToINR(transaction?.amount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold tracking-wider text-blue-600">
                                                    {
                                                        (userWallet?.upiId === transaction?.senderUpiId) ? (
                                                            transaction?.receiverUpiId
                                                        ) : (
                                                            transaction?.senderUpiId
                                                        )
                                                    }
                                                    </span>
                                                    <p className="text-sm text-gray-600 font-medium">Transaction Id: {transaction?.referenceId}</p>
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium flex items-center justify-between">
                                                    <p>
                                                        {moment(transaction?.createdAt).format("LLLL")}
                                                    </p>
                                                    <p>
                                                    {
                                                        transaction?.status === "Completed" && (
                                                            <span className="flex items-center gap-1 text-green-500">
                                                                <GrStatusGood />
                                                                {transaction?.status}
                                                            </span>      
                                                        )
                                                    }
                                                    {
                                                        transaction?.status === "Pending" && (
                                                            <span  className="flex items-center gap-1 text-yellow-500">
                                                                <FiAlertCircle />
                                                                {transaction?.status}
                                                            </span>      
                                                        )
                                                    }
                                                    {
                                                        transaction?.status === "Failed" && (
                                                            <span  className="flex items-center gap-1 text-red-600">
                                                                <FiAlertCircle />
                                                                {transaction?.status}
                                                            </span>      
                                                        )
                                                    }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center my-4">
                                        <FiAlertCircle className="text-4xl text-orange-500" />
                                        <p className="text-lg font-medium mt-2">No transaction found in your history.</p>
                                    </div>
                                )
                                }
                            </ul>
                        </div>
                        </>
                        )
                    }
                </div>
            )
        }
        </>
        )
    }
    {/* payment modal */}
    <Modal isOpen={showPaymentModal} title="Pay Now" onClose={() => (setShowPaymentModal(false), setPassword(""))}>
        <form onSubmit={submitPaymentForm}
        className="grid gap-2">
            <label htmlFor="senderId">Sender UPI Id</label>
            <input type="text" id="senderId" name='senderId'
            value={senderUpiId}
            readOnly={true}
            onChange={(e) => setSenderUpiId(e.target.value)} 
            className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
            placeholder="Enter sender upi id" />

            <label htmlFor="receiverId">Receiver UPI Id</label>
            <input type="text" id="receiverId" name='receiverId'
            value={receiverUpiId} 
            onChange={(e) => setReceiverUpiId(e.target.value)} 
            className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
            placeholder="Enter receiver upi id" />

            <label htmlFor="amount">Amount</label>
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

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name='password'
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
    </>
    )
}

export default Wallet;