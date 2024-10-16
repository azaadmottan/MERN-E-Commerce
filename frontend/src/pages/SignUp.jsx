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
    const [phone, setPhone] = useState("");

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
            phone,
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
    <div className="max-w-lg mx-auto mt-5 mb-3 bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-md">
        <div>
            <h2 className="text-xl sm:text-3xl font-bold">SignUp</h2>
            <p className="mt-2 text-gray-700 font-semibold text-base sm:text-lg">Sign up with your email to get started.</p>
        </div>

        <div className='mt-4'>
            <form
            onSubmit={handleSignUpForm}
            className="grid gap-2 text-base sm:text-lg">
                <label htmlFor="username" className="font-semibold">Username <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div>
                    <input 
                    type="text" 
                    id="username"
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <label htmlFor="fullName" className="font-semibold">Full Name <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div>
                    <input 
                    type="text" 
                    id="fullName"
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <label htmlFor="email" className="font-semibold">Email-id <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div>
                    <input 
                    type="text" 
                    id="email"
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your email-id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <label htmlFor="confirmPassword" className="font-semibold">Confirm Password <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div className="relative">
                    <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {
                        showConfirmPassword ? (
                            <FaEyeSlash
                            className="text-base sm:text-xl absolute top-2.5 sm:top-3 right-3 cursor-pointer"
                            title="Hide password"
                            onClick={() => setShowConfirmPassword((prev) =>!prev)}
                            />
                        ) : (
                            <FaEye
                            className="text-base sm:text-xl absolute top-2.5 sm:top-3 right-3 cursor-pointer" 
                            title="Show password"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            />
                        )
                    }
                </div>

                <label htmlFor="profilePicture" className="font-semibold">Profile Picture <sup className="text-red-500 text-lg font-bold" title="Required field">*</sup></label>
                <div>
                    <input 
                    type="file"
                    name="profilePicture" 
                    id="profilePicture"
                    className="w-full px-2 py-0.5 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Upload your profile picture"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>

                
                <label htmlFor="phone" className="font-semibold">Phone No.</label>
                <div>
                    <input 
                    type="number" 
                    id="phone"
                    className="w-full px-2 py-1 sm:p-2 outline-none border-2 focus-within:border-blue-500 rounded-md"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <button 
                className="mt-4 py-0.5 sm:p-1 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white tracking-widest rounded-md"
                type="submit" 
                >
                    SignUp
                </button>
            </form>

            <p className='mt-4 text-sm sm:text-base font-semibold'>
                Already have an account ? 
                <Link 
                to={"/login"}
                className="text-blue-600 ml-1 hover:text-orange-600"
                >Login</Link>
            </p>
        </div>

    </div>
    </>
    )
}

export default SignUp;