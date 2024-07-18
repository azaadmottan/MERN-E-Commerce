import React from 'react';
import {
    IoStar
} from "./Icons.jsx";
import { PUBLIC_URL } from "../config/api.config.js";

function HomeProductCard({imgUrl="", name="", brand="", rating="", discount="", price="", sellingPrice="" }) {
    return (
    <>
    <div className="w-60 bg-slate-00 rounded-md bg-white shadow-sm hover:shadow-md cursor-pointer transition-all relative group select-none">
        <div className="hover:text-blue-600 group">

            <div className="w-full h-52 py-2 overflow-hidden">
                <img 
                src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + (imgUrl || 'productImages/sampleImage.jpg')}
                alt={name}
                className="w-full h-full object-contain rounded-md hover:scale-110 transition-all delay-75"
                />
            </div>
            <div className="p-4 flex flex-col gap-1">
                <h3 className="text-lg text-gray-800 font-semibold truncate group-hover:text-blue-600">
                    {name}
                </h3>
                <h5 className="text-gray-400 uppercase font-medium group-hover:text-blue-600">
                    {brand}
                </h5>


                <p className="bg-green-500 text-sm text-white font-semibold w-fit px-2 py-0 rounded-md flex items-center gap-1">
                    {rating} <IoStar />
                </p>

                <p className="text-sm tracking-wider">
                    <span className="font-extrabold italic font-serif text-green-500">
                    {discount}% off
                    </span>
                    <span className="font-semibold not-italic text-gray-700"> on this Product</span>
                </p>

                <p className="text-xs bg-orange-500 text-white font-mono italic w-fit px-2 py-0.5 rounded-full">
                    <span className="text-sm font-extrabold">Sk</span> Assured Product
                </p>

                <p className="flex items-center gap-2 mt-2 tracking-wider">
                    <span className="flex items-center text-lg font-bold">
                        ₹{sellingPrice}
                    </span>
                    <span className="flex items-center text-gray-700 text-sm line-through">
                        ₹{price}
                    </span>
                </p>

                <p className="text-sm text-green-500">
                    Save extra with combo offers
                </p>
            </div>

        </div>
    </div>
    </>
    )
}

export default HomeProductCard;