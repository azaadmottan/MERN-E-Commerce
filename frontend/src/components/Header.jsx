import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Logo from "./Logo.jsx";
import {
    BsCart3, 
    FaRegUserCircle,
    IoIosSearch,
    MdDashboard,
    LuLogOut
} from "./Icons.jsx";
import {
    logoutUser,
} from "../actions/user.actions.js";
import { LOGOUT_USER_EMPTY_CART } from '../constants/cart.constants.js';
import { LOGOUT_USER_EMPTY_ADDRESS } from '../constants/user.constants.js';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading, error } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    const [showMenu, setShowMenu] = useState(false);

    const [logoutUserSuccess, setLogoutUserSuccess] = useState(false);
    const handleLogout = () => {
        dispatch(logoutUser());
        setLogoutUserSuccess(true);

        setShowMenu(false);
    }

    useEffect(() => {
        if (logoutUserSuccess && error) {
            toast.error(error);
            setLogoutUserSuccess(false);
            return;
        }
        if (logoutUserSuccess && !isAuthenticated) {
            toast.success("User logged out successfully");
            dispatch({ type: LOGOUT_USER_EMPTY_ADDRESS });
            dispatch({ type: LOGOUT_USER_EMPTY_CART });
            setLogoutUserSuccess(false);
        }
    }, [isAuthenticated, error]);

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };


    return (
    <>
    <header className="bg-white h-16 shadow-md flex items-center sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between">
            <div>
                <Link href="/" className="text-2xl font-bold select-none flex items-center gap-2">
                    <Logo width={40} height={40} />Shopkart
                </Link>
            </div>

            <form className="hidden lg:flex items-center w-full max-w-sm focus-within:shadow-md border rounded-full">
                <input 
                type="search" 
                placeholder='Search for products and many more...' 
                className="w-full text-lg pl-4 py-1 outline-none rounded-l-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}                
                />
                <button 
                onClick={handleSearch}
                className='px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-r-full outline-none'>
                    <IoIosSearch size={24} />
                </button>
            </form>

            <div className="flex gap-4">
                <button 
                className="text-orange-500 text-xl sm:flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-md relative hidden"
                onClick={() => navigate("/cart")} 
                >
                    <BsCart3 size={24} />
                    Cart
                    <span className='text-sm text-white bg-orange-500 px-1 py-0 absolute top-0 right-0 rounded-full'>
                        {
                            cartItems ? cartItems?.length : 0
                        }
                    </span>
                </button>

                {
                    !isAuthenticated ? (
                    <>
                        {/* <button 
                        className="p-2 text-orange-500 hover:bg-slate-100 rounded-md inline-block sm:hidden"
                        onClick={() => navigate("/cart")} 
                        >
                            <BsCart3 size={22} />
                        </button> */}

                        <button
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-4 py-2 rounded-md sm:flex items-center gap-2 hidden"
                        onClick={() => navigate("/login")}
                        >
                            <FaRegUserCircle />
                            Login
                        </button>
                    </>
                    ) : (
                        <span className="flex items-center relative">
                            <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-4 py-3 rounded-md flex items-center"
                            onClick={() => setShowMenu((prev) => !prev)} 
                            >
                                <FaRegUserCircle size={22} />
                            </button>
                            {
                                showMenu && (
                                    <div className="text-lg text-nowrap font-medium absolute -left-48 top-14 bg-white p-2 rounded-md shadow-md z-20">
                                        {
                                            user?.isAdmin ? (
                                                <button className="w-full px-4 py-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                                                onClick={() => (navigate("/admin/dashboard/home"), setShowMenu(false))}
                                                >
                                                    <MdDashboard />
                                                    Admin Dashboard
                                                </button>
                                            ) : (
                                                <button className="w-full px-4 py-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                                                onClick={() => (navigate("/user/dashboard/profile"), setShowMenu(false))}
                                                >
                                                    <MdDashboard />
                                                    User Dashboard
                                                </button>
                                            )
                                        }
                                        <button 
                                        className="w-full px-4 py-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                                        onClick={handleLogout}
                                        >
                                            <LuLogOut />
                                            Logout
                                        </button>

                                    </div>
                                )
                            }
                        </span>
                    ) 
                }

                <button 
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md inline-block sm:hidden"
                onClick={() => navigate("/login")} 
                >
                    <FaRegUserCircle size={22} />
                </button>

            </div>
        </div>
    </header>
    </>
    )
}

export default Header;