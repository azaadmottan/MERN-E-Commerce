import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import {
    IoIosAdd,
    BsThreeDotsVertical,
    MdEdit,
    MdDelete,
    FaRegAddressCard,
} from "../../components/Icons.jsx";
import {
    Modal,
    MiniLoading,
} from "../../components/index.jsx";
import moment from "moment";

function UserProfile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    return (
    <>
    <div>
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            <div className="flex items-center justify-between">
                <div className="text-xl flex gap-3 items-center">
                    <span className="">
                        Full Name:
                    </span>
                    <span className="font-semibold ">
                        {user?.fullName || user?.fullName}
                    </span> 
                </div>
                <div className="text-xl flex gap-3 items-center">
                    <span>
                        Username:
                    </span>
                    <span className="font-semibold">
                        {user?.userName || user?.userName}
                    </span>
                </div>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Email Address:
                </span>
                <span className="font-semibold">
                    {user?.email || user?.email}
                </span>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Profile Last Updated:
                </span>
                <span className="font-semibold">
                    {moment(user?.updatedAt).format('LLLL') || moment(user?.updatedAt).format('LLLL')}
                </span>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Account Created At:
                </span>
                <span className="font-semibold">
                    {moment(user?.createdAt).format('LLLL') || moment(user?.createdAt).format('LLLL')}
                </span>
            </div>
        </div>
    </div>
    </>
    )
}

export default UserProfile;