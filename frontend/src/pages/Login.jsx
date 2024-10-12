import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import {
    FaEye,
    FaEyeSlash
} from '../components/Icons.jsx';
import { clearErrors, loginUser } from '../actions/user.actions.js';
import { loadUserCartProducts } from "../actions/cart.actions.js";
import { MetaData } from "../components/index.jsx";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    // const {authStatus, userInfo, loading, error} = useSelector(state => state.user);
    const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);


    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [formSubmit, setFormSubmit] = useState(false);
    const handleLoginForm = (e) => {
        e.preventDefault();

        if (!username.trim() || !password) {
            toast.error("Username and Password must be provided");
            return;
        }
        
        const userData = {
            userName: username,
            email: username,
            password: password
        }

        dispatch(loginUser(userData));
        setFormSubmit(true);
    }

    const redirect = location.search ? location.search.split("/")[1] : "";
    
    useEffect(() => {
        if (formSubmit) {
            if (isAuthenticated && user) {
                toast.success("User logged in successfully");
                setUsername("");
                setPassword("");
                dispatch(loadUserCartProducts());
            }
            if (error) {
                toast.error(error);
                dispatch(clearErrors());
            }
        }
    }, [error, isAuthenticated]);

    useEffect(() => {

        if (isAuthenticated) {
            navigate(`/${redirect}`);
        }
    }, [dispatch, error, isAuthenticated, redirect, navigate]);

    return (
    <>
    <MetaData title="Login @ Shopkart | India | Buy Products with Max Profit" />
    <div className="max-w-lg mx-auto mt-5 bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-md">
        <div>
            <h2 className="text-xl sm:text-3xl font-bold">Login</h2>
            <p className="mt-2 text-gray-700 font-semibold text-base sm:text-lg">Get access to your Orders, Cart-items and Recommendations.</p>
        </div>

        <div className='mt-4'>
            <form 
            onSubmit={handleLoginForm}
            className="grid gap-3 text-base sm:text-lg">
                <label htmlFor="username" className="font-semibold">Username / Email-id <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div>
                    <input 
                    type="text" 
                    id="username"
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your username / email-id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <label htmlFor="password" className="font-semibold">Password <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div className="relative">
                    <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    {
                        showPassword ? (
                            <FaEyeSlash
                            className="text-base sm:text-xl absolute top-2.5 sm:top-3 right-3 cursor-pointer"
                            title="Hide password"
                            onClick={() => setShowPassword((prev) =>!prev)}
                            />
                        ) : (
                            <FaEye
                            className="text-base sm:text-xl absolute top-2.5 sm:top-3 right-3 cursor-pointer" 
                            title="Show password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            />
                        )
                    }
                </div>

                <button 
                className="mt-4 py-0.5 sm:p-1 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white tracking-widest rounded-md"
                type="submit"
                disabled={loading}
                >
                    Login
                </button>
            </form>

            <p className='mt-4 text-sm sm:text-base font-semibold'>
                Don't have an account ? 
                <Link 
                to={"/signUp"}
                className="text-blue-600 ml-1 hover:text-orange-600"
                > SignUp</Link>
            </p>
        </div>

    </div>
    </>
    )
}

export default Login;