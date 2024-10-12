import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4} from "uuid";

// import img1 from "../../assets/banner/img5.webp";
// import img2 from "../../assets/banner/img2.webp";
// import img3 from "../../assets/banner/img3.jpg";
// import img5 from "../../assets/banner/img1.webp";

import img1 from "../../assets/banner/banner-1.jpg";
import img2 from "../../assets/banner/banner-2.jpeg";
import img3 from "../../assets/banner/banner-3.jpeg";
import img4 from "../../assets/banner/banner-4.jpeg";
import img5 from "../../assets/banner/banner-5.jpg";
import img6 from "../../assets/banner/banner-6.jpg";
import img7 from "../../assets/banner/banner-7.jpg";
import img8 from "../../assets/banner/img3.jpg";

import img1_mobile from "../../assets/banner/img1_mobile.jpg";
import img2_mobile from "../../assets/banner/img2_mobile.webp";
import img3_mobile from "../../assets/banner/img3_mobile.jpg";
import img4_mobile from "../../assets/banner/img4_mobile.jpg";
import img5_mobile from "../../assets/banner/img5_mobile.png";
import img6_mobile from "../../assets/banner/img6_mobile.jpg";
import img7_mobile from "../../assets/banner/img7_mobile.jpg";
import img8_mobile from "../../assets/banner/img8_mobile.jpg";

import {
    FaAngleLeft,
    FaAngleRight,
} from "../Icons.jsx";

function Banner() {
    const desktopImages = [
        img1, img2, img3, img4, img5, img6, img7, img8
    ]
    const mobileImages = [
        img6_mobile, img7_mobile, img8_mobile, img1_mobile, img2_mobile, img3_mobile, img4_mobile, img5_mobile,
    ]

    const [currentImage, setCurrentImage] = useState(0);
    const intervalRef = useRef(null);

    const nextImage = () => {
        setCurrentImage((prevIndex) => (prevIndex + 1) % desktopImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prevIndex) => (prevIndex - 1 + desktopImages.length) % desktopImages.length);
    };

    // useEffect(() => {
    //     const intervalId = setInterval(nextImage, 5000); // Adjust interval as needed
    //     intervalRef.current = intervalId;

    //     return () => clearInterval(intervalRef.current);
    // }, [desktopImages.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 3000);
        return () => clearInterval(interval);
    }, [desktopImages.length, nextImage, prevImage]);
    

    // return (
    // <>
    // <div className="h-72 bg-white select-none">
    //     <div className="hidden md:flex items-center overflow-hidden rounded-md w-full h-full relative">
    //     <div className="absolute z-20 hidden md:flex items-center justify-between w-full h-full px-4">
    //         <FaAngleLeft
    //         onClick={() => nextImage()}
    //         className="w-10 h-10 p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200" />
    //         <FaAngleRight 
    //         onClick={() => prevImage()}
    //         className="w-10 h-10 p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200" />
    //     </div>
    //     {
    //         desktopImages.map((image) => (
    //             <div 
    //             className="w-full h-full min-w-full min-h-full flex items-center transition-all"
    //             style={{transform: `translateX(-${currentImage * 100}%)`}}
    //             key={uuidv4()}
    //             >
    //                 <img src={image} className="w-full h-full" alt="Banner Image" />
    //             </div>
    //         ))
    //     }
    //     </div>

    //     <div className="md:hidden flex items-center overflow-hidden rounded-md w-full h-full relative ">
    //     {
    //         mobileImages.map((image) => (
    //             <div 
    //             className="w-full h-full min-w-full min-h-full flex items-center transition-all object-cover"
    //             style={{transform: `translateX(-${currentImage * 100}%)`}}
    //             key={uuidv4()}
    //             >
    //                 <img src={image} className="w-full h-full object-center" alt="Banner Image" />
    //             </div>
    //         ))
    //     }
    //     </div>
    // </div>
    // </>
    // )

    return (
        <div className="h-72 bg-white select-none relative">
            {/* Desktop View */}
            <div className="hidden md:flex items-center overflow-hidden rounded-md w-full h-full">
                <div className="absolute inset-y-0 left-0 flex items-center justify-center z-10">
                    <button onClick={prevImage} className="text-2xl p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none">
                        <FaAngleLeft />
                    </button>
                </div>
                <div className="flex items-center w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                    {
                    desktopImages.map((image, index) => (
                        <div key={uuidv4()} className="w-full h-full flex-shrink-0">
                            <img src={image} className="w-full h-full object-fill" alt={`Banner ${index}`} />
                        </div>
                    ))
                    }
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center justify-center z-10">
                    <button onClick={nextImage} className="text-2xl p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none">
                        <FaAngleRight />
                    </button>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex items-center overflow-hidden rounded-md w-full h-full">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                    {
                    mobileImages.map((image, index) => (
                        <div key={uuidv4()} className="w-full flex-shrink-0">
                            <img src={image} className="w-full h-full object-contain" alt={`Banner ${index}`} />
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Banner;