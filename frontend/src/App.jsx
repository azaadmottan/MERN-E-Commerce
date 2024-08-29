import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Header, 
    Footer
} from "./components/index.jsx";
import {
    loadUser,
    loadUserAddress
} from "./actions/user.actions.js";
import {
    loadCategories,
    loadProducts
} from "./actions/product.actions.js";
import { loadUserCartProducts } from "./actions/cart.actions.js";

function App() {
    const { pathname } = useLocation();

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.info('You are back online.');
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('You are offline. Check your network connection.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline]);

    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);

    // fetch all the required data in the current state
    useEffect(() => {
        dispatch(loadUser());
        dispatch(loadCategories());
        dispatch(loadProducts());
        dispatch(loadUserCartProducts());
    }, [dispatch]);

    // useEffect(() => {
    //     dispatch(loadUserAddress());
    // }, [isAuthenticated]);

    // always scroll to top on route/path change
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [pathname])

    return (
    <>
    <ToastContainer 
        position="top-center"
    />

    <Header />
        <main 
        className="flex-1"
        style={{ minHeight: 'calc(100vh - 4rem - 2rem)'}}
        >
            <Outlet />
        </main>
    {
        (!pathname.includes("/admin") && !pathname.includes("/user")) && (
            <Footer />
        )
    }
    </>
    );
}

export default App;