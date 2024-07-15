import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import {
    PUBLIC_URL
} from "../../config/api.config.js";

function Category() {
    const { category, loading: categoryLoading } = useSelector((state) => state.category);

    // animate the loading components
    const loadingElements = new Array(10).fill(null);
    return (
    <>
    <div className="bg-white p-4 rounded-md overflow-x-scroll hiddenScrollBar">
        <div className="flex items-center justify-around gap-6 ">
        {
            categoryLoading ? (
                loadingElements.map(() => (<div key={uuidv4()} className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden p-1 animate-pulse" />))
            ) : (
                category.map((category, index) => (category.isActive && (
                    <Link to={`/product-category/${category?.name}`} key={uuidv4()} className="rounded-full flex-col items-center justify-center font-semibold hover:text-blue-600">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden">
                            <img 
                            src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + (category?.categoryImage || 'productImages/sampleImage.jpg')} 
                            alt={category?.name}
                            loading="lazy"
                            className="rounded-full w-14 h-14 md:w-full md:h-full object-fill object-center hover:scale-110 transition-all"
                            />
                        </div>
                        <span className="flex items-center justify-center mt-2 capitalize text-sm md:text-base">
                            {
                                category?.name
                            }
                        </span>
                    </Link>)
                ))
            )
        }
        </div>
    </div>    
    </>
    )
}

export default Category;