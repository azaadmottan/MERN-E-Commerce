import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    IoArrowBack,
} from "./Icons.jsx";

function BackButton() {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate(-1);
    }

    return (
    <>
        <button 
        onClick={() => navigateBack()}
        className='bg-slate-50 px-4 py-3 text-lg lg:text-2xl rounded-md hover:bg-slate-100 transition-all duration-100 delay-75'
        >
            <IoArrowBack />
        </button>
    </>
    )
}

export default BackButton;