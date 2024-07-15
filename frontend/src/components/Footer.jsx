import React from 'react';
import Logo from "./Logo.jsx";

function Footer() {
    return (
    <>
    <div
    className="text-gray-500 flex flex-col sm:flex-row items-center justify-around p-2 bg-slate-200"
    >
        <p className="flex items-center gap-2 font-bold text-black">
            <Logo width={30} height={30} />
            Shopkart
        </p>
        <p>
            All rights reserved &copy; 2024 | Shopkart.in
        </p>
        <p>
            Privacy Policy &bull; Terms of Use
        </p>
    </div>
    </>
    )
}

export default Footer;