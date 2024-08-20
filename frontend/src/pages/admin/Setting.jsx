import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addOfficialOrderPaymentUpiId, createWallet, getOfficialOrderPaymentUpiId, getUserWallet, removeOfficialOrderPaymentUpiId } from "../../actions/requestProduct.actions.js";
import { MdVerified } from "react-icons/md";
import { Modal } from "../../components/index.jsx";

function Setting() {
    const { user } = useSelector((state) => state?.user);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(value);
    };

    const [upiId, setUpiId] = useState("");
    const generateUpiId = () => {
        if (user?.userName) {
            const id = user?.userName + "@spay";
            setUpiId(id);
        }
    }

    const [upiPassword, setUpiPassword] = useState("");
    const handleWalletFormSubmit = async (e) => {
        e.preventDefault();
        if (!upiId) {
            toast.error("Something went wrong. Please try again later");
            return;
        }
        if (!upiPassword) {
            toast.error("Please create your UPI-ID password!");
            return;
        }
        if (!validatePassword(upiPassword)) {
            toast.error("Invalid Password");
            return;
        }
        const response = await createWallet(upiId, upiPassword);

        if (response?.success) {
            toast.success("Wallet created successfully");
            setUpiPassword("");
        }
        if (response?.error) {
            toast.error("Something went wrong while creating wallet");
        }
    }

    const [wallet, setWallet] = useState([]);
    const getWallet = async () => {
        setLoading(true);
        const response = await getUserWallet();
        if (response?.success) {
            setWallet(response?.wallet);
        }
        setLoading(false);
    }

    const [officialOrderUpiId, setOfficialOrderUpiId] = useState("");
    const getOfficialOrderUpiId = async () => {
        const response = await getOfficialOrderPaymentUpiId();

        if (response?.success) {
            setOfficialOrderUpiId(response?.orderUpiId);
        }
    }

    useEffect(() => {
        generateUpiId();
        getWallet();
        getOfficialOrderUpiId();
    }, []);

    const [orderUpiId, setOrderUpiId] = useState("");
    const handleAddOrderUpiId = async (e) => {
        e.preventDefault();
        if (!orderUpiId) {
            toast.error("Please enter UPI-ID to add for order payments");
            return;
        }
        const response = await addOfficialOrderPaymentUpiId(orderUpiId);

        if (response?.success) {
            toast.success("UPI-ID added for order payments successfully");
            setOrderUpiId("");
            getOfficialOrderUpiId();
        }
        if (response?.error) {
            toast.error("Something went wrong while adding UPI-ID for order payments");
        }
    }

    const [showRemoveOrderIdModal, setShowRemoveOrderIdModal] = useState(false);
    const handleRemoveOrderId = async () => {
        // setOfficialOrderUpiId("");
        if (officialOrderUpiId?.upiId) {
            const response = await removeOfficialOrderPaymentUpiId(officialOrderUpiId?.upiId);
            if (response?.success) {
                toast.success("UPI-ID removed from order payments successfully");
                setOfficialOrderUpiId("");
                getOfficialOrderUpiId();
            }
            if (response?.error) {
                toast.error("Something went wrong while removing UPI-ID from order payments");
            }
        }
        setShowRemoveOrderIdModal(false);
    }

    return (
    <>
    {
        loading ? (
            <>
            <h2 className="text-xl font-semibold">
                Common Dashboard Settings
            </h2>
            <div className="p-6 rounded-md my-2 bg-slate-200 animate-pulse"></div>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[60%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[60%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[80%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[50%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[90%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[60%]"></p>
            <p className="my-2 p-4 rounded-md bg-slate-200 animate-pulse w-[60%]"></p>
            </>
        ) : (
            <div>
                <h2 className="text-xl font-semibold">
                    Common Dashboard Settings
                </h2>

                <div className="mt-2">
                    {
                        wallet?.isActive && (
                        <div className="flex items-center gap-2 bg-orange-200 bg-opacity-75 p-4 rounded-md">
                            <div className="p-1 rounded-r-md bg-orange-500 h-14"></div>
                            <div className="flex items-center gap-2">
                                <MdVerified className="text-blue-500 text-2xl" /> <span className="text-lg font-semibold">
                                    Your wallet has been activated successfully.
                                </span>
                            </div>
                        </div>
                        )
                    }
                    <h2 className="text-lg font-semibold">
                        Activate your Wallet
                    </h2>
                    <div className="text-gray-500 flex items-center justify-between">
                        <span>
                            Connect your wallet to your account to start receiving payments.
                        </span>
                        <div className="flex items-center">
                        <label className='relative cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={() => handleCheckboxChange()}
                                className='sr-only'
                            />
                            <div
                                className={`box block h-6 w-10 rounded-full ${
                                isChecked ? 'bg-blue-500' : 'bg-black'
                                }`}
                            ></div>
                            <div
                                className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                                isChecked ? 'translate-x-full' : ''
                                }`}
                            ></div>
                            </label>
                        </div>
                    </div>
                    {
                        isChecked && (
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Your account details
                                </h2>
                                <div className="flex flex-col gap-4 p-4 mt-2 text-lg bg-slate-100 rounded-md">
                                    <div className="flex flex-wrap justify-between">
                                        <div className="flex gap-2">
                                            <label className="text-gray-500 font-semibold" htmlFor="user-name">Username</label>
                                            <span className="text-gray-800 font-semibold">
                                            {
                                                user?.userName?? 'Not Available'
                                            }
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="text-gray-500 font-semibold" htmlFor="full-name">Full Name</label>
                                            <span className="text-gray-800 font-semibold">
                                            {
                                                user?.fullName?? 'Not Available'
                                            }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-between">
                                        <div className="flex gap-2">
                                            <label className="text-gray-500 font-semibold" htmlFor="email">Email-id</label>
                                            <span className="text-gray-800 font-semibold">
                                            {
                                                user?.email?? 'Not Available'
                                            }
                                            </span>
                                        </div>
                                    </div>
                                    <form onSubmit={handleWalletFormSubmit} className="flex flex-col gap-2">

                                    <div className="flex flex-wrap justify-between">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-500 font-semibold" htmlFor="upi">UPI ID</label>
                                            <input
                                            value={upiId}
                                            type="text" placeholder="Your's UPI ID" id='upi' className="border-2 focus-within:border-blue-600 outline-none rounded-md px-2 py-0.5" readOnly={true} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-500 font-semibold" htmlFor="upi-pass">UPI-ID PASSWORD</label>
                                            <input
                                            value={upiPassword}
                                            onChange={(e) => setUpiPassword(e.target.value)}
                                            type="password" placeholder="Create your password" id='upi-pass' className="border-2 focus-within:border-blue-600 outline-none rounded-md px-2 py-0.5" />
                                        </div>
                                    </div>
                                    <div className='text-sm text-gray-500 px-4'>
                                        <ul className='list-disc'>
                                            <li>Minimum length (e.g., 8 characters)</li>
                                            <li>At least one uppercase letter</li>
                                            <li>At least one lowercase letter</li>
                                            <li>At least one number</li>
                                            <li>At least one special character (e.g., !@#$%^&*)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <button
                                        type='submit'
                                        disabled={wallet?.isActive}
                                        className="font-bold uppercase px-4 py-0.5 rounded-md text-white bg-orange-500 hover:bg-orange-600">
                                            Activate Now
                                        </button>
                                    </div>

                                    </form>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className="my-2">
                    <h2 className="text-lg font-semibold">Order payment official UPI ID</h2>
                    <form 
                    onSubmit={handleAddOrderUpiId}
                    className="bg-slate-100 p-4 my-2 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <label className="text-gray-500 font-semibold" htmlFor="order-upi-id">UPI ID</label>
                            <input 
                            value={orderUpiId}
                            onChange={(e) => setOrderUpiId(e.target.value)}
                            readOnly={officialOrderUpiId}
                            className="border-2 focus-within:border-blue-600 outline-none rounded-md px-2 py-0.5"
                            id="order-upi-id"
                            type="text" placeholder="Enter upi id" />
                        </div>
                        
                        <button 
                        disabled={officialOrderUpiId}
                        className="px-4 py-0.5 font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        >
                            Add
                        </button>
                    </form>

                    <div className="p-4 rounded-md bg-slate-100 flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="text-gray-500 font-semibold">
                                Order Payment UPI ID: 
                            </span>
                            <span className="font-semibold">
                            {
                                officialOrderUpiId ? (
                                    officialOrderUpiId?.upiId
                                ) : (
                                    "No Order Payment UPI ID available yet"
                                )
                            }
                            </span>
                        </div>
                        {
                        (officialOrderUpiId) && (
                            <button 
                            onClick={() => setShowRemoveOrderIdModal(true)}
                            className="px-4 py-0.5 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                                Remove
                            </button>
                        )
                        }
                    </div>
                </div>
            </div>
        )
    }

        {/* delete user modal */}
        <Modal isOpen={showRemoveOrderIdModal} title="Confirm Remove Order UPI ID" onClose={() => setShowRemoveOrderIdModal(false)}>
            <div className="grid gap-2">
                <p className="my-2 font-semibold">Are you sure you want to remove this order UPI ID ?</p>

                <button
                onClick={() => handleRemoveOrderId()}
                className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Confirm Remove
                </button>
            </div>
        </Modal>
    </>
    )
}

export default Setting;