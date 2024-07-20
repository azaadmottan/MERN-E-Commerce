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

    return (
    <>
    <div className="bg-slate rounded-md">
        <h2 className="my-4 text-xl font-semibold">Most Common Products</h2>
        {
            loading ? (
                <MiniLoading />
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