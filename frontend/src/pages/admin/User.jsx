import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid"; 
import { getAllUsers } from '../../actions/requestProduct.actions.js';
import { MetaData } from "../../components/index.jsx";
import { MdOutlineSort } from "react-icons/md";

function User() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const fetchAllUsers = async () => {
        setLoading(true);
        const response = await getAllUsers();

        if (response?.success) {
            setUsers(response?.users);
            setFilteredUsers(response?.users);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const loadingElements = new Array(10).fill(null);

    const [showSortOptions, setShowSortOptions] = useState(false);
    const toggleSortOptions = () => {
        setShowSortOptions(!showSortOptions);
    }

    const [searchTerms, setSearchTerms] = useState("");
    const handleSearchFilter = () => {
        const filtered = users.filter(user =>
            user?.fullName.toLowerCase().includes(searchTerms.toLowerCase()) ||
            user?.email.toLowerCase().includes(searchTerms.toLowerCase()) ||
            user?._id.toString().includes(searchTerms.toLowerCase()) 
        );
        setFilteredUsers(filtered);
    }

    useEffect(() => {
        handleSearchFilter();
    }, [searchTerms]);

    const [sortAdmin, setSortAdmin] = useState(false);
    const [sortUser, setSortUser] = useState(false);
    const [sortByName, setSortByName] = useState(false);
    const [sortByJoined, setSortByJoined] = useState(false);
    const [sortByActive, setSortByActive] = useState(false);
    const [sortByBlock, setSortByBlock] = useState(false);
    const handleSortChange = () => {
        let sortedUsers = [...filteredUsers];
        if (sortAdmin) {
            sortedUsers = sortedUsers.filter(user => user.isAdmin);
        }
        if (sortUser) {
            sortedUsers = sortedUsers.filter(user => !user.isAdmin);
        }
        if (sortByName) {
            sortedUsers.sort((a, b) => a.fullName.localeCompare(b.fullName));
        } 
        if (sortByJoined) {
            sortedUsers.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
        }
        if (sortByActive) {
            sortedUsers = sortedUsers.filter(user => user.isActive);
        }
        if (sortByBlock) {
            sortedUsers = sortedUsers.filter(user => !user.isActive);
        }
        if (!sortAdmin && !sortUser && !sortByName && !sortByJoined && !sortByActive && !sortByBlock) {
            sortedUsers = users;
        }
        setFilteredUsers(sortedUsers);
        // setShowSortOptions(false);
    }

    useEffect(() => {
        handleSortChange();
    }, [sortAdmin, sortUser, sortByName, sortByJoined, sortByActive, sortByBlock]);

    return (
    <>
    <MetaData title="Admin Dashboard - User List" />
    <div>
        <h2 className="text-lg lg:text-xl font-semibold my-2">All Users</h2>
        <div className="flex items-center justify-between gap-4 my-2 font-medium select-none">
            {/* search functionality */}
            <div className="flex items-center w-[80%]">
                <input 
                type="search" 
                value={searchTerms}
                onChange={e => setSearchTerms(e.target.value)}
                className="px-3 py-0.5 font-normal lg:font-medium tracking-wider rounded-md outline-none border-2 focus-within:border-blue-500 w-full"
                placeholder="Search user (by name, email-id or user-id) here..."
                />
            </div>
            {/* sort functionality */}
            <div className="flex items-center gap-2 ">
                <h4 className="text-xs lg:text-base text-gray-500">Sort Data</h4>
                <div className="relative">
                    <span
                    onClick={() => toggleSortOptions()}
                    className="flex items-center p-2 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer">
                        <MdOutlineSort className="text-xl lg:text-2xl" />
                    </span>
                    {
                    showSortOptions && (
                        <ul className="text-sm lg:text-base absolute top-10 right-10 bg-slate-100 shadow-lg text-nowrap rounded-md">
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortAdmin(prev => !prev))}
                                checked={sortAdmin}
                                className="w-3 h-3 cursor-pointer"
                                id="admin"
                                name="sort-options"
                                />
                                <label htmlFor="admin" className="cursor-pointer">
                                    Admins
                                </label>
                            </li>
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortUser(prev => !prev))}
                                checked={sortUser}
                                className="w-3 h-3 cursor-pointer"
                                id="users"
                                name="sort-options"
                                />
                                <label htmlFor="users" className="cursor-pointer">
                                    Users
                                </label>
                            </li>
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortByName(prev => !prev))}
                                checked={sortByName}
                                className="w-3 h-3 cursor-pointer"
                                id="name"
                                name="sort-options"
                                />
                                <label htmlFor="name" className="cursor-pointer">
                                    Sort by Name (A-Z)
                                </label>
                            </li>
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortByJoined(prev => !prev))}
                                checked={sortByJoined}
                                className="w-3 h-3 cursor-pointer"
                                id="joined"
                                name="sort-options"
                                />
                                <label htmlFor="joined" className="cursor-pointer">
                                    Sort by Joined At
                                </label>
                            </li>
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortByActive(prev => !prev))}
                                checked={sortByActive}
                                className="w-3 h-3 cursor-pointer"
                                id="active"
                                name="sort-options"
                                />
                                <label htmlFor="active" className="cursor-pointer">
                                    Sort by Active User
                                </label>
                            </li>
                            <li 
                            className="px-4 py-1 hover:text-blue-500 hover:bg-white hover:bg-opacity-55 rounded-md flex items-center gap-2">
                                <input
                                type="checkbox"
                                onChange={() => (setSortByBlock(prev => !prev))}
                                checked={sortByBlock}
                                className="w-3 h-3 cursor-pointer"
                                id="block"
                                name="sort-options"
                                />
                                <label htmlFor="block" className="cursor-pointer">
                                    Sort by Block User
                                </label>
                            </li>
                        </ul>
                    )
                    }
                </div>
            </div>
        </div>
        <div className="max-h-[450px] overflow-y-auto hiddenScrollBar">
        <table className="table-fixed text-xs lg:text-base w-full mt-4 overflow-x-auto bg-slate-50 rounded-md">
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
                    (filteredUsers.length === 0) ? (
                    <tr className="text-center">
                        <td className="p-4 text-gray-600 bg-slate-100 shadow-md font-semibold tracking-wider" colSpan="6">No user found.</td>
                    </tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr
                            onClick={() => navigate(`/admin/dashboard/user/${user?._id}`)}
                            key={uuidv4()} className="text-xs lg:text-sm border-b hover:bg-slate-100 cursor-pointer hover:shadow-md">
                                <td className="p-2 flex items-center gap-2">
                                    <span className="font-bold rounded-[50%] bg-violet-800 text-white px-3 py-1.5">
                                        {user?.fullName[0]}
                                    </span>
                                    {user?.fullName}
                                </td>
                                <td className="p-2 font-normal lg:font-semibold text-wrap break-words">{user?.email}</td>
                                <td className="p-2 break-words">{user?._id}</td>
                                <td className="p-2 font-semibold lg:font-bold text-center text-xs">{user?.isActive ? (<span className="text-white bg-green-500 px-4 py-0.5 rounded-full">Active</span>) : <span className="text-white bg-red-500 px-5 py-0.5 rounded-full">Block</span>}</td>
                                <td className="p-2 font-semibold lg:font-bold text-center">
                                    <span className={`${user?.isAdmin ? "bg-orange-500 text-xs text-white px-4 py-0.5 rounded-full " : ""}`}>
                                        {user?.isAdmin ? "Admin" : "User"}
                                    </span>
                                </td>
                                <td className="p-2 font-normal lg:font-semibold">{moment(user?.createdAt).format("lll")}</td>
                            </tr>
                        ))
                    )
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