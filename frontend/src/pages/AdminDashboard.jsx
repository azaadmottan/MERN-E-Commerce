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
} from "../components/Icons.jsx";
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
        dispatch(loadProducts());
    }, []);

    // it is used to make the sidebar navigation link 'active'
    const path = useLocation();
    const isActive = path?.pathname;

    const userProfilePicture = (user?.profilePicture) ? (user?.profilePicture) : (<FaRegUserCircle />); 

    return (
    <>
    <div className="container mx-auto my-2 flex items-center gap-2">
        <aside className="md:w-3/12 lg:w-3/2 h-[85vh] px-2 py-4 bg-white rounded-md">
            <div className="bg-slate-100 rounded-md px-2 py-4 flex items-center gap-4">
                <div className='rounded-full w-20 h-20'>
                    <img
                    src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + userProfilePicture}
                    className="w-full h-full rounded-full object-cover"
                    alt="" 
                    />
                </div>
                <div>
                    <h2 className="text-sm lg:text-xl font-bold tracking-wider">Admin Dashboard</h2>
                    <p>Welcome to the dashboard</p>
                </div>
            </div>

            <nav className="grid mt-4 overflow-y-scroll h-[50vh] hiddenScrollBar">
                <Link
                to={'/admin/dashboard/profile'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/profile' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <PiUserListBold /> My Profile
                </Link>
                <Link
                to={'/admin/dashboard/category'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/category' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineCategory /> Category
                </Link>
                <Link
                to={'/admin/dashboard/product'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/product' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <AiOutlineProduct /> Products
                </Link>
                <Link
                to={'/admin/dashboard/order'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/order' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuGitPullRequestDraft /> Orders
                </Link>
                <Link
                to={'/admin/dashboard/user'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/user' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <LuUsers2 /> Users
                </Link>
                <Link
                to={'/admin/dashboard/coupon'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/coupon' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineLocalOffer /> Coupons
                </Link>
                <Link
                to={'/admin/dashboard/review'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/review' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineReviews /> Reviews
                </Link>
                <Link
                to={'/admin/dashboard/setting'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/setting' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <MdOutlineSettings /> Settings
                </Link>
                <Link
                to={'/admin/dashboard/payment'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/payment' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <BsCurrencyRupee /> Payment
                </Link>
                <Link
                to={'/admin/dashboard/comment'}
                className={`w-full px-4 py-2 mb-1 rounded-md flex items-center gap-2 text-lg font-medium ${isActive == '/admin/dashboard/comment' ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                <FaRegComments /> Comments
                </Link>
            </nav>
        </aside>

        <section className="md:w-9/12 lg:w-5/6 h-[85vh] px-6 py-8 bg-white rounded-md overflow-y-auto hiddenScrollBar">
            <Outlet />
        </section>
    </div>
    </>
    );
}

export default AdminDashboard;