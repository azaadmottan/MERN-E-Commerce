import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { categoryProducts, getCategory } from "../../actions/requestProduct.actions.js";
import { MetaData, HomeProductCard } from "../../components/index.jsx";
import { PUBLIC_URL } from '../../config/api.config.js';

function CategoryPage() {
    const { category, id } = useParams();
    const navigate = useNavigate();

    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const [sortOrder, setSortOrder] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const getUniqueBrands = (products) => {
        const brands = products.map(product => product.brand.toLowerCase());
        return [...new Set(brands)];
    };

    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState("");
    const [products, setProducts] = useState([]);
    const getCategoryInfo = async () => {
        if (id) {
            setLoading(true);
            const response1 = await getCategory(id)
            const response2 = await categoryProducts(category.toLowerCase());

            if (response1?.success) {
                setCategoryData(response1?.category);
            }
            if (response2?.success) {
                setProducts(response2?.products);
                setUniqueBrands(getUniqueBrands(response2?.products));
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategoryInfo();
    }, [category]);

    const sortAndFilterProducts = () => {
        let sortedProducts = [...products];

        // Filter by selected brands
        if (selectedBrands.length > 0) {
            sortedProducts = sortedProducts.filter(product => selectedBrands.includes(product.brand.toLowerCase()));
        }

        // Sort products
        if (sortOrder === 'asc') {
            sortedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (sortOrder === 'dsc') {
            sortedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
        }

        setFilteredProducts(sortedProducts);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedBrands(prev => [...prev, value]);
        } else {
            setSelectedBrands(prev => prev.filter(brand => brand !== value));
        }
    };

    useEffect(() => {
        sortAndFilterProducts();
    }, [sortOrder, selectedBrands, products]);

    const loadingElements = Array(12).fill(null);

    return (
    <>
    <div className="container mx-auto p-2 md:p-4">
    {
        loading ? (
        <>
        <div className="flex flex-col md:flex-row gap-2">
            <div className="md:w-[20%] md:h-[85vh] p-2 flex flex-col gap-2 bg-white border rounded-md">
                <div className="flex flex-col gap-2">
                    <h2 className="p-4 bg-slate-200 animate-pulse rounded-md"></h2>
                    <div className="flex flex-col gap-2 p-2 font-semibold text-gray-600">
                        <p className="p-2 bg-slate-200 rounded-sm animate-pulse"></p>
                        <p className="p-2 bg-slate-200 rounded-sm animate-pulse"></p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="p-4 bg-slate-200 animate-pulse rounded-md"></h2>
                    <div className="flex flex-col gap-2 p-2 font-semibold text-gray-600">
                        <p className="p-2 bg-slate-200 rounded-sm animate-pulse"></p>
                        <p className="p-2 bg-slate-200 rounded-sm animate-pulse"></p>
                    </div>
                </div>
            </div>

            <div className="md:w-[80%] md:h-[85vh] flex flex-col gap-2 p-2 md:p-4 overflow-y-auto hiddenScrollBar border rounded-md">
                <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
                    <div className="w-80 p-6 rounded-md bg-slate-200 animate-pulse"></div>
                    <div className="w-full p-10 rounded-md bg-slate-200 animate-pulse">
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-around gap-4">
                {
                    loadingElements.map(() => (
                        <div
                        key={uuidv4()}
                        className="md:w-60 bg-slate-00 rounded-md bg-white shadow-sm hover:shadow-md transition-all relative group select-none">
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
            </div>
        </div>
        </>
        ) : (
        <>
        <MetaData title={`${categoryData?.name} @ Shopkart | India`} />
        <div className="flex flex-col md:flex-row gap-2">
            <div className="md:w-[20%] md:h-[85vh] p-2 mb-2 md:mb-0 bg-white border rounded-md">

                <div className="flex flex-col gap-2 mb-2">
                    <h2 className="text-base lg:text-xl text-gray-800 font-semibold uppercase border-b-2 lg:p-2">Sort By Price</h2>
                    <div className="flex flex-wrap md:flex-col justify-between gap-2 py-1 lg:p-2 font-semibold text-gray-500">
                        <p className="flex gap-2 text-sm lg:text-base">
                            <input type="radio" id="asc" name="sort-order" value="asc" onChange={handleSortOrderChange} /> 
                            <label htmlFor="asc" className="cursor-pointer">
                                Price - Low to High
                            </label>
                        </p>
                        <p className="flex gap-2 text-sm lg:text-base">
                            <input type="radio" id="dsc" name="sort-order" value="dsc" onChange={handleSortOrderChange} />
                            <label htmlFor="dsc" className="cursor-pointer">
                                Price - High to Low
                            </label>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-base lg:text-xl text-gray-800 font-semibold uppercase border-b-2 lg:p-2">Sort By Brand</h2>
                    <div className="flex flex-wrap md:flex-col justify-between gap-2 py-1 lg:p-2 font-semibold text-gray-600">
                    {
                        uniqueBrands.map((brand, index) => (
                            <p key={index} className="flex gap-2 text-sm lg:text-base">
                                <input 
                                type="checkbox"
                                name="brand"
                                className="hover:text-orange-500"
                                id={brand}
                                value={brand}
                                onChange={handleBrandChange} />
                                <label htmlFor={brand} className="cursor-pointer uppercase text-gray-500">
                                    {brand}
                                </label>
                            </p>
                        ))
                    }
                    </div>
                </div>
            </div>

            <div className="md:w-[80%] md:h-[85vh] flex flex-col gap-2 p-0 md:p-2 lg:p-4 overflow-y-auto hiddenScrollBar border rounded-md">
                <div className="bg-white rounded-md px-2 md:px-4 lg:px-8 py-3 lg:py-6">
                    <h1 className="text-lg lg:text-2xl font-bold py-0.5 lg:my-2 text-gray-900">{categoryData?.name}</h1>
                    <p className="text-gray-700">{categoryData?.description}</p>
                </div>

                <div className="my-4 px-2 md:px-0 text-[13px] sm:text-base text-gray-400 font-semibold italic tracking-wider">
                    {filteredProducts?.length} product has been found in this category
                </div>

                <div className="flex flex-wrap md:items-center justify-around md:gap-4">
                    {
                        filteredProducts.map((product) => (
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
            </div>
        </div>
        </>
        )
    }
    </div>
    </>
    )
}

export default CategoryPage;