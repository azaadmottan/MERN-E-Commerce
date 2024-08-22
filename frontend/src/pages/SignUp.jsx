import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
    FaEye,
    FaEyeSlash
} from '../components/Icons.jsx';
import { toast } from 'react-toastify';
import { registerUser, clearErrors } from "../actions/user.actions.js"
import { MetaData } from "../components/index.jsx";

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state) => state.user);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const [formSubmit, setFormSubmit] = useState(false);
    const handleSignUpForm = (e) => {
        e.preventDefault();
        setFormSubmit(false);

        if (!userName.trim() || !fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !profilePicture) {
            toast.error("All fields must be provided !")
            return;
        }

        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(email)) {
            toast.error("Invalid email address !")
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords does not match !")
            return;
        }

        if (password.length < 8) {
            toast.warn("Password must be at least 8 characters long !");
            return;
        }

        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowedImageTypes.includes(profilePicture?.type)) {
            toast.error("Invalid image format !");
            return;
        }

        const userData = {
            userName,
            fullName,
            email,
            password,
            profilePicture,
        }

        dispatch(registerUser(userData));
        setFormSubmit(true);
    }

    useEffect(() => {
        if (formSubmit) {
            if (isAuthenticated) {
                toast.success("User registered successfully");
                setUserName("");
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setProfilePicture(null);
    
                navigate('/');
            }
    
            if (error) {
                toast.error(error);
                dispatch(clearErrors());
            }
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
    <>
    <MetaData title="SignUp @ Shopkart | India | Buy Products with Max Profit" />
    <div className="max-w-lg mx-auto mt-5 bg-white px-6 py-4 rounded-md">
        <div>
            <h2 className="text-3xl font-bold">SignUp</h2>
            <p className="mt-2 text-gray-700 font-semibold text-lg">Sign up with your email to get started.</p>
        </div>

        <div className='mt-4'>
            <form
            onSubmit={handleSignUpForm}
            className="grid gap-2 text-lg">
                <label htmlFor="username" className="font-semibold">Username</label>
                <div>
                    <input 
                    type="text" 
                    id="username"
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <label htmlFor="fullName" className="font-semibold">Full Name</label>
                <div>
                    <input 
                    type="text" 
                    id="fullName"
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <label htmlFor="email" className="font-semibold">Email-id</label>
                <div>
                    <input 
                    type="text" 
                    id="email"
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your email-id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
                <div className="relative">
                    <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {
                        showConfirmPassword ? (
                            <FaEyeSlash
                            className="text-xl absolute top-3 right-3 cursor-pointer"
                            title="Hide password"
                            onClick={() => setShowConfirmPassword((prev) =>!prev)}
                            />
                        ) : (
                            <FaEye
                            className="text-xl absolute top-3 right-3 cursor-pointer" 
                            title="Show password"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            />
                        )
                    }
                </div>

                <label htmlFor="profilePicture" className="font-semibold">Profile Picture</label>
                <div>
                    <input 
                    type="file"
                    name="profilePicture" 
                    id="profilePicture"
                    className="w-full p-2 bg-slate-100 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Upload your profile picture"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>

                <button 
                className="mt-4 p-1 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                type="submit" 
                >
                    SignUp
                </button>
            </form>

            <p className='mt-4 font-semibold'>
                Already have an account ? 
                <Link 
                to={"/login"}
                className="text-blue-600 ml-1 hover:text-red-600"
                >Login</Link>
            </p>
        </div>

    </div>
    </>
    )
}

export default SignUp;