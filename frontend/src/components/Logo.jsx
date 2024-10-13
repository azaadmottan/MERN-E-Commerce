import React from 'react'
import logo from "../assets/logo-512.png";


function Logo({width=60, height=80, className=""}) {
    return (
    <>
        <img 
            src={logo} 
            alt="ShopKart"
            width={width} height={height}
            className={`inline-flex ${className}`}
        />
    </>
    );
}

export default Logo;