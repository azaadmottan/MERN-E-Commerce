import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from "react-toastify";
import { getUserById, updateAccountActivity, updateUserRole } from '../../actions/requestProduct.actions.js';
import { PUBLIC_URL } from "../../config/api.config.js";
import { MetaData, Modal } from "../../components/index.jsx";

function UserInfo() {
    const { id } = useParams();

    const [userDetail, setUserDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUserDetails = async () => {
        setLoading(true);
        if (id) {
            const response = await getUserById(id);
            if (response?.success) {
                setUserDetail(response?.user);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const [activity, setActivity] = useState("");
    const handleChangeActivity = (activity) => {
        setActivity(activity);
    }

    const [disableBtn, setDisableBtn] = useState(false);
    const handleUpdateActivity = async () => {
        setDisableBtn(true);
        if (!activity || (activity === "none")) {
            toast.error("Please select activity status");
            setDisableBtn(false);
            return;
        }

        const response = await updateAccountActivity(id, activity);
        if (response?.success) {
            toast.success("Activity status updated successfully");
            fetchUserDetails();
            setActivity("");
        }
        if (response?.error) {
            toast.error("Something went wrong while updating activity status");
        }
        setDisableBtn(false);
    }

    const [role, setRole] = useState("");
    const [roleBtn, setRoleBtn] = useState(false);
    const handleUpdateUserRole = async() => {
        setRoleBtn(true);
        if (!role || (role === "none")) {
            toast.error("Please select user role");
            setRoleBtn(false);
            return;
        }

        const response = await updateUserRole(id, role);
        if (response?.success) {
            toast.success("User role updated successfully");
            fetchUserDetails();
            setRole("");
        }
        if (response?.error) {
            toast.error("Something went wrong while updating user role");
        }
        setRoleBtn(false);
    }

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const handleDeleteAccount = () => {
        setShowDeleteAccountModal(false);
    }

    return (
    <>
    <MetaData title={`Admin Dashboard - User Info - ${userDetail?.fullName}`} />
    <div>
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
                <h2 className="text-xl font-semibold my-2">
                    User Details
                </h2>
                <h3 className="text-lg font-semibold my-2 flex justify-between">
                    <span>
                    {
                        userDetail?.fullName
                    }
                    {
                        userDetail?.isAdmin ? (<span className=''> (Admin)</span>) : (<span className=''> (User)</span>)
                    }
                    </span>
                    <span>
                    Joined At: {
                        moment(userDetail?.createdAt).format("LLLL")
                    }
                    </span>
                </h3>

                <div className="flex items-center gap-2 my-4 px-4 py-2 rounded-md border-2 border-orange-500 ">
                    <div className="w-[30%] h-[60%] flex items-center rounded-md">
                        <img 
                        className="w-full h-full object-contain rounded-md"
                        loading='lazy'
                        src={PUBLIC_URL.PUBLIC_STATIC_URL + "/" + userDetail?.profilePicture} alt={userDetail?.userName} />
                    </div>
                    <div className="text-gray-600 bg-orange-100 font-semibold flex flex-col gap-2 w-full h-full px-6 p-4 rounded-md">
                        <p>
                            Username: <span className="text-gray-900">{userDetail?.userName}</span>
                        </p>
                        <p>
                            Full Name: <span className="text-gray-900">{userDetail?.fullName}</span>
                        </p>
                        <p>
                            Email-id: <span className="text-gray-900">{userDetail?.email}</span>
                        </p>
                        
                        <p className="flex flex-col gap-2">
                            <span>
                                Account Activity
                            </span>
                            <span className="flex items-center justify-between">
                                <select
                                onChange={(e) => handleChangeActivity(e.target.value)}
                                value={activity}
                                className="px-10 py-1 sm:w-[45%] text-gray-900 rounded-md border-2 focus-within:border-blue-500 outline-none cursor-pointer">
                                    <option value="none">Select Account Activity</option>
                                    <option value="true">Active Account</option>
                                    <option value="false">Block Account</option>
                                </select>
                                <button
                                onClick={() => handleUpdateActivity()}
                                disabled={disableBtn}
                                className="text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1 rounded-md"
                                >Update</button>
                            </span>
                        </p>

                        <p className="flex flex-col gap-2">
                            <span>
                                User Role
                            </span>
                            <span className="flex items-center justify-between">
                                <select
                                onChange={(e) => setRole(e.target.value)}
                                value={role}
                                className="px-10 py-1 sm:w-[45%] text-gray-900 rounded-md border-2 focus-within:border-blue-500 outline-none cursor-pointer">
                                    <option value="none">Select User Role</option>
                                    <option value="true">Admin</option>
                                    <option value="false">User</option>
                                </select>
                                <button
                                onClick={() => handleUpdateUserRole()}
                                disabled={roleBtn}
                                className="text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1 rounded-md"
                                >Update</button>
                            </span>
                        </p>
                        {
                            !userDetail?.isAdmin && (
                                <p className="flex items-center justify-between mt-4">
                                    <span>
                                        Delete User Account 
                                    </span>
                                    <span>
                                        <button
                                        onClick={() => setShowDeleteAccountModal(true)}
                                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </span>
                                </p>
                            )
                        }
                    </div>
                </div>
            </>
            )
        }

        {/* delete user modal */}
        <Modal isOpen={showDeleteAccountModal} title="Confirm Delete User Account" onClose={() => setShowDeleteAccountModal(false)}>
            <div className="grid gap-2">
                <p className="my-2 text-lg font-semibold">Are you sure you want to delete this account ?</p>
                <p className="my-2 text-red-600 font-medium italic tracking-wider">
                    NOTE: Deleting this account will remove all associated data. After that account be recovered !
                </p>

                <button
                onClick={() => handleDeleteAccount()}
                className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Confirm Delete
                </button>
            </div>
        </Modal>
    </div>
    </>
    )
}

export default UserInfo;