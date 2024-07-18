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

    return (
    <>
    <div className="bg-slate-50 rounded-md p-4">
        {
            loading ? (
                <MiniLoading />
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-8">
                    {
                        products.map((product) => (
                            <div
                                key={uuidv4()}
                                onClick={() => navigate(`/product/${product?.name?.trim().replace(/\s+/g, "-").toLowerCase()}/${product?._id}`)}
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