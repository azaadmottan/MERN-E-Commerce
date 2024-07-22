import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
    categoryProducts
} from '../../actions/requestProduct.actions.js';
import {
    addProductToCart,
} from "../../actions/cart.actions.js";
import {
    PUBLIC_URL,
} from "../../config/api.config.js"
import {
    FaAngleLeft,
    FaAngleRight,
} from "../Icons.jsx";
import { toast } from 'react-toastify';

function HorizontalCardSlider({ category, heading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);

    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const AddProductToCart = (e, id) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login to add products to cart");
            return;
        }

        dispatch(addProductToCart(id));
        toast.success("Product added to cart");
    }

    const [loading, setLoading] = useState(false);
    
    const [data, setData] = useState();
    const getCategoryProducts = async () => {
        if (category) {
            setLoading(true);
            const response = await categoryProducts(category);

            if (response?.success) {
                setData(response?.products);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategoryProducts();
    }, [category]);

    const [scroll, setScroll] = useState(0);
    const scrollElement = useRef();

    const scrollLeft = () => {
        // scrollElement.current.scrollLeft -= scrollElement.current.offsetWidth;
        scrollElement.current.scrollLeft -= 300;
    }
    const scrollRight = () => {
        // scrollElement.current.scrollLeft += scrollElement.current.offsetWidth;
        scrollElement.current.scrollLeft += 300;
    }

    const loadingElements = new Array(10).fill(null);
    
    return (
    <>
    <div>
        <h2 className="my-4 text-xl font-semibold">{heading}</h2>

        <div className="bg-white rounded-md relative flex items-center select-none">
            <FaAngleLeft
            onClick={() => scrollLeft()}
            className="w-10 h-10 z-20 absolute left-0 p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200" />
            <FaAngleRight 
            onClick={() => scrollRight()}
            className="w-10 h-10 z-20 absolute right-0 p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200" />

            <div className="overflow-x-auto hiddenScrollBar p-4 flex justify-around transition-all duration-200 delay-300" ref={scrollElement}>
                <div className="flex items-center justify-around gap-4 px-4">
                    {
                        loading ? (
                            loadingElements.map(() => (
                                <div 
                                key={uuidv4()}
                                className="flex items-center justify-around gap-2 min-w-[350px] max-w-[360px] h-48 bg-slate-50 p-2 rounded-md hover:text-blue-500 group">
                                    <div className="min-w-[130px] md:min-w-[40%] h-full flex items-center">
                                        <div className="w-full h-full rounded-md bg-slate-200 animate-pulse"></div>
                                    </div>

                                    <div className="w-[50%] flex flex-col gap-3">
                                        <h2 className="p-2 bg-slate-200 animate-pulse rounded-sm"></h2>
                                        <p className="p-2 bg-slate-200 animate-pulse rounded-sm w-24"></p>
                                        <p className="p-2 bg-slate-200 animate-pulse rounded-sm w-32"></p>
                                        <p className="p-2 bg-slate-200 animate-pulse rounded-sm w-20"></p>
                                        <div className="p-2 bg-slate-200 animate-pulse rounded-sm"></div>
                                        <div className="p-2 bg-slate-200 animate-pulse rounded-sm"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            data?.map((item) => (
                                <div 
                                key={uuidv4()}
                                onClick={() => navigate(`/product/${formatUrl(item?.name)}/${item?._id}`)}
                                className="flex items-center justify-around gap-2 min-w-[350px] max-w-[360px] h-48 bg-slate-50 p-2 rounded-md hover:text-blue-500 group">
                                    <div className="min-w-[130px] md:min-w-[40%] h-full p-2 flex items-center">
                                        <img
                                        src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + (item?.images[0] || 'productImages/sampleImage.jpg')}
                                        alt={item?.name}
                                        className=" object-scale-down h-full rounded-md hover:scale-105 transition-all mix-blend-multiply" />
                                    </div>
    
                                    <div className="w-[50%] flex flex-col gap-1">
                                        <h2 className="text-xl font-medium truncate">
                                            {
                                                item?.name
                                            }
                                        </h2>
                                        <p className="text-slate-500 group-hover:text-blue-500 uppercase font-semibold">
                                            {
                                                item?.brand
                                            }
                                        </p>
                                        <p className="text-green-500 font-bold italic font-serif">
                                            {
                                                item?.discount
                                            }% off
                                        </p>
                                        <div className="flex items-center gap-2 tracking-wider">
                                            <p className="text-lg font-bold">
                                                ₹{ item?.sellingPrice } 
                                            </p>
                                            <p className="line-through text-gray-500">
                                                ₹{ item?.price }
                                            </p>
                                        </div>
                                        <button
                                        onClick={(e) => AddProductToCart(e, item?._id)}
                                        className="text-white bg-orange-500 hover:bg-orange-600 rounded-full">Add to Cart</button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    </div>
    </>
    )
}

export default HorizontalCardSlider;