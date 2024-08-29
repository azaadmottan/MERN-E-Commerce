import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createWallet, getUserWallet } from "../../actions/requestProduct.actions.js";
import { MdVerified } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";
import { MetaData } from "../../components/index.jsx";
import { updatePassword, updateProfileDetails } from '../../actions/user.actions.js';


function UserSettings() {
    const dispatch = useDispatch();

    const { user, success, error } = useSelector((state) => state?.user);
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(value);
    };

    const [userName, setUserName] = useState(user?.userName);
    const [fullName, setFullName] = useState(user?.fullName);
    const [email, setEmail] = useState(user?.email);
    const [userOldPassword, setUserOldPassword] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");

    const [updateProfileForm, setUpdateProfileForm] = useState(false);
    const handleUpdateProfileDetails = (e) => {
        setUpdateProfileForm(false);
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) {
            toast.error("Full name and email are required");
            return;
        }

        if ((fullName === user?.fullName) && (email === user?.email)) {
            toast.info("No changes made to profile details");
            return;
        }

        dispatch(updateProfileDetails(fullName, email));
        setUpdateProfileForm(true);
    }

    useEffect(() => {
        if (error && updateProfileForm) {
            toast.error(error);
            return;
        }
        if (success && updateProfileForm) {
            toast.success("Profile details updated successfully");
        }
    }, [success, error]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!userOldPassword.trim() || !newUserPassword.trim()) {
            toast.error("Old and new password are required");
            return;
        }

        if (newUserPassword?.length < 8) {
            toast.error("Password should be at least 8 characters long");
            return;
        }

        const response = await updatePassword(userOldPassword, newUserPassword);
        if (response?.error) {
            toast.error(response?.message);
            return;
        }
        if (response?.success) {
            toast.success("Password updated successfully");
            setUserOldPassword("");
            setNewUserPassword("");
        }
    }

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
    const [loading, setLoading] = useState(true);
    const getWallet = async () => {
        setLoading(true);
        const response = await getUserWallet();
        if (response?.success) {
            setWallet(response?.wallet);
        }
        setLoading(false);
    }

    useEffect(() => {
        generateUpiId();
        getWallet();
    }, []);

    return (
    <>
    <MetaData title="Dashboard - Settings" />

    <div>
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
            <h2 className="text-xl font-semibold">
                Common Dashboard Settings
            </h2>

            <div className="my-2">
                <h2 className="text-xl font-semibold my-4 flex items-center gap-2">
                    <RiListSettingsLine className="text-2xl text-orange-600" />
                    Profile Settings
                </h2>

                <form
                onSubmit={handleUpdateProfileDetails}
                className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-gray-600">Update Profile Details</h3>
                    <div className="flex flex-wrap justify-between">
                        <div className="w-[40%]">
                            <label htmlFor="username" className="block font-medium text-gray-500">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="mt-1 block w-full py-1.5 px-2 outline-none border-gray-300 rounded-md border-2 focus-within:border-blue-500"
                                disabled={true}
                            />
                        </div>
                        <div className="w-[40%]">
                            <label htmlFor="email" className="block font-medium text-gray-600">Email-id</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full py-1.5 px-2 outline-none border-gray-300 rounded-md border-2 focus-within:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between">
                        <div className="w-[40%]">
                            <label htmlFor="fullName" className="block font-medium text-gray-500">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 block w-full py-1.5 px-2 outline-none border-gray-300 rounded-md border-2 focus-within:border-blue-500"
                            />
                        </div>
                    </div>
                    <button
                    type="submit"
                    className="py-1.5 w-[20%] text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Update Profile
                    </button>
                </form>

                <form
                onSubmit={handleUpdatePassword}
                className="flex flex-col gap-2 mt-2">
                    <h3 className="text-lg font-medium text-gray-600">Update Account Password</h3>
                    <div className="flex flex-wrap justify-between">
                        <div className="w-[40%]">
                            <label htmlFor="password"  className="block font-medium text-gray-500">Old Password</label>
                            <input 
                            type="password"
                            id="password"
                            value={userOldPassword}
                            onChange={(e) => setUserOldPassword(e.target.value)}
                            placeholder="Enter old password"
                            className="mt-1 block w-full py-1.5 px-2 outline-none border-gray-300 rounded-md border-2 focus-within:border-blue-600"
                            />
                        </div>
                        <div className="w-[40%]">
                            <label htmlFor="cPassword"  className="block font-medium text-gray-500">New Password</label>
                            <input 
                            type="password"
                            id="cPassword"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="mt-1 block w-full py-1.5 px-2 outline-none border-gray-300 rounded-md border-2 focus-within:border-blue-600"
                            />
                        </div>
                    </div>
                    <button 
                    className="py-1.5 w-[20%] text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Update Password
                    </button>
                </form>
            </div>

            <div className="my-2">
                <h2 className="text-xl font-semibold my-4 flex items-center gap-2">
                    <RiListSettingsLine className="text-2xl text-orange-600" />
                    Wallet Settings
                </h2>
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
                <h2 className="text-lg font-semibold text-gray-600">
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
                            <h2 className="text-lg font-semibold text-gray-600">
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
        </>
        )
    }
    </div>
    </>
    )
}

export default UserSettings;