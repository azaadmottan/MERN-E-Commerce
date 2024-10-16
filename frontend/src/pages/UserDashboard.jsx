import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PUBLIC_URL } from '../config/api.config.js';
import {
    FaRegUserCircle,
    PiUserListBold,
    MdOutlineCategory,
    AiOutlineProduct,
    LuGitPullRequestDraft,
    LuUsers2,
    MdOutlineLocalOffer,
    MdOutlineReviews,
    IoMdSettings,
    MdOutlineSettings,
    BsCurrencyRupee,
    FaRegComments,
    FaLocationCrosshairs,
    IoWalletOutline,
} from "../components/Icons.jsx";
import {
    MetaData,
    BackButton,
    BreadCrumb,
    ForwardButton,
} from "../components/index.jsx";
import { 
    loadUserAddress,
} from "../actions/user.actions.js";
import {
    loadProducts,
} from '../actions/product.actions.js';

function UserDashboard() {
    // global operations for user dashboard
    const dispatch = useDispatch();

    const { user, loading: userLoading, error } = useSelector((state) => state.user);
    
    useEffect(() => {
        dispatch(loadUserAddress());
    }, []);

    // it is used to make the sidebar navigation link 'active'
    const path = useLocation();
    const isActive = path?.pathname;

    const userProfilePicture = (user?.profilePicture) ? (user?.profilePicture) : (<FaRegUserCircle />); 

    return (
    <>
    <MetaData title="User Dashboard" />
    <div className="container mx-auto my-2 flex items-center gap-2">
        <aside className="md:w-3/12 lg:w-3/2 h-[86vh] px-2 py-4 bg-white rounded-md">
            <div className="bg-slate-100 rounded-md px-2 py-4 flex items-center gap-4">
                <div className='rounded-full w-20 h-20'>
                    <img
                    src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + userProfilePicture}
                    className="w-full h-full rounded-full object-cover"
                    alt="" 
                    />
                </div>
                <div>
                    <h2 className="text-sm lg:text-xl font-bold tracking-wider">User Dashboard</h2>
                    <p>Welcome to the dashboard</p>
                </div>
            </div>

            <nav className="grid mt-4 overflow-y-scroll h-[50vh] hiddenScrollBar">
                <Link
                to={'/user/dashboard/profile'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/profile' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <PiUserListBold /> My Profile
                </Link>

                <Link
                to={'/user/dashboard/manage-address'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/manage-address' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <FaLocationCrosshairs /> Addresses
                </Link>
                
                <Link
                to={'/user/dashboard/order'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/order' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuGitPullRequestDraft /> My Orders
                </Link>
                <Link
                to={'/user/dashboard/my-coupon'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/my-coupon' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineLocalOffer /> My Coupons
                </Link>
                <Link
                to={'/user/dashboard/wallet'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/wallet' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <IoWalletOutline /> Wallet
                </Link>
                <Link
                to={'/user/dashboard/setting'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/user/dashboard/setting' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineSettings /> Settings
                </Link>
            </nav>
        </aside>

        <section className="md:w-9/12 lg:w-5/6 h-[86vh] px-6 py-6 bg-white rounded-md overflow-y-auto hiddenScrollBar">
            <div className="my-2 flex flex-col gap-2 select-none">
                <div className="flex items-center justify-between">
                    <BackButton />
                    <ForwardButton />
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-md">

                    <BreadCrumb />
                </div>
            </div>

            <Outlet />

        </section>
    </div>
    </>
    );
}

export default UserDashboard;