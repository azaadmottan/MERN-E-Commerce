import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from "react-toastify";
import { getUserById, updateAccountActivity } from '../../actions/requestProduct.actions.js';
import { PUBLIC_URL } from "../../config/api.config.js";

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
        if (!activity) {
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

    return (
    <>
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
                    <div className="w-[30%] h-[200px] flex items-center">
                        <img 
                        className="w-full h-full object-contain"
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
                                className="px-10 py-1 text-gray-900 rounded-md border-2 focus-within:border-blue-500 outline-none cursor-pointer">
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
                        {
                            !userDetail?.isAdmin && (
                                <p className="flex items-center justify-between mt-4">
                                    <span>
                                        Delete User Account 
                                    </span>
                                    <span>
                                        <button
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
    </div>
    </>
    )
}

export default UserInfo;