import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import {
    FaEye,
    FaEyeSlash
} from '../components/Icons.jsx';
import { clearErrors, loginUser } from '../actions/user.actions.js';

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
            toast.error("All fields are required");
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
            }
            if (error) {
                toast.error(error);
                dispatch(clearErrors());
            }
            console.log("requested user")
        }
    }, [error, isAuthenticated]);

    useEffect(() => {

        if (isAuthenticated) {
            navigate(`/${redirect}`);
        }
    }, [dispatch, error, isAuthenticated, redirect, navigate]);

    return (
    <>
    <div className="max-w-lg mx-auto mt-5 bg-white px-6 py-4 rounded-md">
        <div>
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="mt-2 text-gray-700 font-semibold text-lg">Get access to your Orders, Wishlist and Recommendations.</p>
        </div>

        <div className='mt-4'>
            <form 
            onSubmit={handleLoginForm}
            className="grid gap-3 text-lg">
                <label htmlFor="username" className="font-semibold">Username / Email-id</label>
                <div>
                    <input 
                    type="text" 
                    id="username"
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your username / email-id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <label htmlFor="password" className="font-semibold">Password</label>
                <div className="relative">
                    <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    {
                        showPassword ? (
                            <FaEyeSlash
                            className="text-xl absolute top-3 right-3 cursor-pointer"
                            title="Hide password"
                            onClick={() => setShowPassword((prev) =>!prev)}
                            />
                        ) : (
                            <FaEye
                            className="text-xl absolute top-3 right-3 cursor-pointer" 
                            title="Show password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            />
                        )
                    }
                </div>

                <button 
                className="mt-4 p-1 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                type="submit"
                disabled={loading}
                >
                    Login
                </button>
            </form>

            <p className='mt-4 font-semibold'>
                Don't have an account ? 
                <Link 
                to={"/signUp"}
                className="text-blue-600 ml-1 hover:text-red-600"
                > SignUp</Link>
            </p>
        </div>

    </div>
    </>
    )
}

export default Login;