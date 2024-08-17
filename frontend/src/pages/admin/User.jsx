import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid"; 
import { getAllUsers } from '../../actions/requestProduct.actions.js';

function User() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAllUsers = async () => {
        setLoading(true);
        const response = await getAllUsers();

        if (response?.success) {
            setUsers(response?.users);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const loadingElements = new Array(10).fill(null);


    return (
    <>
    <div>
        <h2 className="text-xl font-semibold my-2">All Users</h2>

        <div>
        <table className="table-fixed w-full mt-4 overflow-x-auto bg-slate-50 rounded-md">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th scope="col" className="p-2">Name</th>
                    <th scope="col" className="p-2">Email</th>
                    <th scope="col" className="p-2">User ID</th>
                    <th scope="col" className="p-2">Status</th>
                    <th scope="col" className="p-2">User Role</th>
                    <th scope="col" className="p-2">Joined</th>
                </tr>
            </thead>
            <tbody>
            {
                loading ? (
                    loadingElements.map((_, index) => (
                    <tr key={index}
                    className="border-b my-4">
                        <td className="p-4"></td>
                    </tr>
                    ))
                ) : (
                    users.map((user) => (
                        <tr
                        onClick={() => navigate(`/admin/dashboard/user/${user?._id}`)}
                        key={uuidv4()} className="text-sm border-b hover:bg-slate-100 cursor-pointer hover:shadow-md">
                            <td className="p-2 flex items-center gap-2">
                                <span className="font-bold rounded-[50%] bg-violet-800 text-white px-3 py-1.5">
                                    {user?.fullName[0]}
                                </span>
                                {user?.fullName}
                            </td>
                            <td className="p-2 font-semibold text-wrap break-words">{user?.email}</td>
                            <td className="p-2 break-words">{user?._id}</td>
                            <td className="p-2 font-bold text-center text-xs">{user?.isActive ? (<span className="text-white bg-green-500 px-4 py-0.5 rounded-full">Active</span>) : <span className="text-white bg-red-500 px-5 py-0.5 rounded-full">Block</span>}</td>
                            <td className="p-2 font-bold text-center">{user?.isAdmin ? "Admin" : "User"}</td>
                            <td className="p-2 font-semibold">{moment(user?.createdAt).format("lll")}</td>
                        </tr>
                    ))
                )
            }
            </tbody>
        </table>
        </div>
    </div>
    </>
    );
}

export default User;