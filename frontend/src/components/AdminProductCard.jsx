import React, { useState } from 'react';
import {
    BsThreeDotsVertical,
    MdEdit,
    MdDelete,
    BsCurrencyRupee,
    IoStar
} from "./Icons.jsx";
import { PUBLIC_URL } from "../config/api.config.js";
import { Link, useNavigate } from 'react-router-dom';
import covertNumberToINR  from "../handler/NumberToINR.js";


function AdminProductCard({ _id="", imgUrl="", name="", brand="", rating="", discount="", price="", sellingPrice="" }) {

    const navigate = useNavigate();
    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const [showEditMenu, setShowEditMenu] = useState({});
    const toggleEditMenu = (e, id) => {
        e.stopPropagation();
        e.preventDefault();
        setShowEditMenu(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
    <>
    <div
    onClick={() => navigate(`/product/${formatUrl(name)}/${_id}`)}
    className="w-44 xx-sm-w x-sm-w sm:w-60 bg-slate-00 rounded-md bg-white shadow-sm hover:shadow-md cursor-pointer transition-all relative group select-none">
        <span 
        className="text-lg cursor-pointer p-2 bg-slate-50 hover:bg-slate-200 rounded-full absolute top-0 right-0 block lg:hidden lg:group-hover:block"
        onClick={(e) => toggleEditMenu(e, _id)}
        >
            <BsThreeDotsVertical className="relative" />
            {
                showEditMenu[_id] && (
                    <div className="bg-white shadow-md text-nowrap rounded-md overflow-hidden absolute right-0 ">
                        <button 
                            className="px-4 py-2 w-full flex items-center gap-2 hover:bg-slate-100" title="Edit product"
                            onClick={() => navigate(`edit/${_id}`)}
                        >
                            <MdEdit />Edit
                        </button>
                        <p className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100" title="Delete product"
                        >
                            <MdDelete />Delete
                        </p>
                    </div>
                )
            }
        </span>

        <div className="hover:text-blue-600 group">

            <div className="w-full h-32 sm:h-52 py-2">
                <img 
                src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + (imgUrl || 'productImages/sampleImage.jpg')}
                alt={name}
                className="w-full h-full object-contain rounded-md"
                />
            </div>
            <div className="px-2 py-4 sm:p-4 flex flex-col gap-1">
                <h3 className="text-sm sm:text-lg text-gray-800 font-semibold truncate group-hover:text-blue-600">
                    {name}
                </h3>
                <h5 className="text-xs sm:text-base text-gray-400 uppercase font-medium group-hover:text-blue-600">
                    {brand}
                </h5>


                <p className="bg-green-500  text-xs sm:text-sm text-white font-semibold w-fit px-2 py-0 rounded-md flex items-center gap-1">
                    {rating} <IoStar />
                </p>

                <p className="text-xs sm:text-sm tracking-wider">
                    <span className="font-extrabold italic font-serif text-green-500">
                    {discount}% off
                    </span>
                    <span className="font-semibold not-italic text-gray-700"> on this Product</span>
                </p>

                <p className="text-xs bg-orange-500 text-white font-mono italic w-fit px-2 py-0.5 rounded-full">
                    <span className="text-sm font-extrabold">Sk</span> Assured Product
                </p>

                <p className="flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:mt-2 tracking-wider">
                    <span className="flex items-center text-lg font-bold">
                        { covertNumberToINR(sellingPrice) }
                    </span>
                    <span className="flex items-center text-gray-700 text-sm line-through">
                        { covertNumberToINR(price) }
                    </span>
                </p>

                <p className="text-xs sm:text-sm text-green-500">
                    Save extra with combo offers
                </p>
            </div>

        </div>
    </div>
    </>
    );
}

export default AdminProductCard;