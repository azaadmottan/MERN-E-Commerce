import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    IoArrowForward,
} from "./Icons.jsx";

function ForwardButton() {
    const navigate = useNavigate();

    const navigateForward = () => {
        navigate(+1);
    }

    return (
    <>
        <button 
        onClick={() => navigateForward()}
        className='bg-slate-50 px-4 py-3 text-lg lg:text-2xl rounded-md hover:bg-slate-100 transition-all duration-100 delay-75'
        >
            <IoArrowForward />
        </button>
    </>
    )
}

export default ForwardButton;