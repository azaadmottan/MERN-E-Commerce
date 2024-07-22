import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import {
    MiniLoading,
    HomeProductCard,
} from "../index.jsx";

function Product() {
    const navigate = useNavigate();
    const { products, loading, error, success }  = useSelector((state) => state.products);
    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };
    
    const loadingElements = new Array(13).fill(null);

    return (
    <>
    <div className="bg-slate rounded-md">
        <h2 className="my-4 text-xl font-semibold">Most Common Products</h2>
        {
            loading ? (
                <div className="flex flex-wrap items-center justify-around gap-4">
                {
                    loadingElements.map(() => (
                        <div
                        key={uuidv4()}
                        className="w-60 bg-slate-00 rounded-md bg-white shadow-sm hover:shadow-md transition-all relative group select-none">
                            <div className="group">
                                <div className="w-full h-52 p-2">
                                    <div className="animate-pulse w-full h-full bg-slate-200 rounded-md">
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className="bg-slate-200 animate-pulse p-2 rounded-sm">
                                    </h3>
                                    <h5 className="bg-slate-200 animate-pulse p-2 w-32 rounded-sm">
                                    </h5>
                                    <p className="bg-slate-200 animate-pulse p-2 w-20 rounded-sm">
                                    </p>
                                    <p className="bg-slate-200 animate-pulse p-2 rounded-sm">
                                    </p>
                                    <p className="bg-slate-200 animate-pulse p-2 rounded-sm">
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-around gap-4">
                    {
                        products.map((product) => (
                            <div
                                key={uuidv4()}
                                onClick={() => navigate(`/product/${formatUrl(product?.name)}/${product?._id}`)}
                            >
                                <HomeProductCard 
                                    imgUrl={product?.images[0]}
                                    name={product?.name}
                                    brand={product?.brand}
                                    rating={product?.rating}
                                    price={product?.price}
                                    sellingPrice={product?.sellingPrice}
                                    discount={product?.discount}
                                />
                            </div>
                        ))
                    }
                </div>
            )
        }
    </div>
    </>
    );
}

export default Product;