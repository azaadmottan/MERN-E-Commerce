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

function AdminDashboard() {
    // global operations for admin dashboard
    const dispatch = useDispatch();

    const { user, loading: userLoading, error } = useSelector((state) => state.user);
    
    useEffect(() => {
        dispatch(loadUserAddress());
        // dispatch(loadProducts());
    }, []);

    // it is used to make the sidebar navigation link 'active'
    const path = useLocation();
    const isActive = path?.pathname;

    const userProfilePicture = (user?.profilePicture) ? (user?.profilePicture) : (<FaRegUserCircle />); 

    return (
    <>
    <MetaData title="Admin Dashboard" />
    <div className="container mx-auto my-2 flex items-center gap-2">
        <aside className="md:w-3/12 lg:w-3/2 h-[86vh] px-2 py-4 bg-white rounded-md">
            <div className="bg-slate-100 rounded-md px-2 py-4 flex items-center gap-4">
                <div className='rounded-full w-16 lg:w-20 h-16 lg:h-20'>
                    <img
                    src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + userProfilePicture}
                    className="w-16 lg:w-full h-16 lg:h-full rounded-full object-contain"
                    alt="" 
                    />
                </div>
                <div>
                    <Link
                    to={'/admin/dashboard/home'}
                    className="text-base lg:text-xl font-bold tracking-wider hover:text-blue-600 delay-75 duration-150 font-mono">Admin Dashboard</Link>
                    <p className="text-xs lg:text-base text-gray-600">Welcome to the dashboard</p>
                </div>
            </div>

            <nav className="text-base lg:text-lg font-medium grid mt-4 overflow-y-scroll h-[58vh] hiddenScrollBar border border-gray-200 px-1 py-2 rounded-md">
                <Link
                to={'/admin/dashboard/profile'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/profile' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <PiUserListBold /> My Profile
                </Link>
                <Link
                to={'/admin/dashboard/category'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/category' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineCategory /> Category
                </Link>
                <Link
                to={'/admin/dashboard/product'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/product' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <AiOutlineProduct /> Products
                </Link>
                <Link
                to={'/admin/dashboard/order'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/order' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuGitPullRequestDraft /> Orders
                </Link>
                <Link
                to={'/admin/dashboard/my-order'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/my-order' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuGitPullRequestDraft /> My Orders
                </Link>
                <Link
                to={'/admin/dashboard/user'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/user' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuUsers2 /> Users
                </Link>
                <Link
                to={'/admin/dashboard/coupon'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/coupon' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineLocalOffer /> Coupons
                </Link>
                <Link
                to={'/admin/dashboard/review'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/review' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineReviews /> Reviews
                </Link>
                <Link
                to={'/admin/dashboard/user-payments'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/user-payments' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <BsCurrencyRupee /> Payments
                </Link>
                <Link
                to={'/admin/dashboard/comment'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/comment' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <FaRegComments /> Comments
                </Link>
                <Link
                to={'/admin/dashboard/wallet'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/wallet' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <IoWalletOutline /> Wallet
                </Link>
                <Link
                to={'/admin/dashboard/setting'}
                className={`w-full px-3 lg:px-4 py-2 mb-1 rounded-md flex items-center gap-2 ${isActive == '/admin/dashboard/setting' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineSettings /> Settings
                </Link>
            </nav>
        </aside>

        <section className="md:w-9/12 lg:w-5/6 h-[86vh] px-3 lg:px-6 py-3 lg:py-6 bg-white rounded-md overflow-y-auto hiddenScrollBar">
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

export default AdminDashboard;