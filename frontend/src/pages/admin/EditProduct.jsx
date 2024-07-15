import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    IoIosAdd,
    IoClose,
} from "../../components/Icons.jsx";
import { PUBLIC_URL } from "../../config/api.config.js";



function EditProduct() {
    const { id } = useParams();
    const product = useSelector((state) => state?.products?.products?.find(p => p._id === id));

    const [name, setName] = useState(product?.name);
    const [category, setCategory] = useState(product?.category);
    const [brand, setBrand] = useState(product?.brand);
    const [description, setDescription] = useState(product?.description);
    const [price, setPrice] = useState(product?.price);
    const [sellingPrice, setSellingPrice] = useState(product?.sellingPrice);
    const [discount, setDiscount] = useState(product?.discount);
    const [inStock, setInStock] = useState(product?.countInStock);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
    
        if (product?.images) {
            const databaseImagePreviews = product?.images.map(image => ({
                url: `${PUBLIC_URL.PUBLIC_STATIC_URL}/${image}`,
                fromDatabase: true,
            }));

            setImagePreviews(databaseImagePreviews);
            setImages(product?.images.map(image => ({
                file: null,
                // url: image,
                url: `${PUBLIC_URL.PUBLIC_STATIC_URL}/${image}`,
                fromDatabase: true,
            })));

            if (databaseImagePreviews.length > 0) {
                setMainImage(databaseImagePreviews[0].url);
            }
        }
    }, [])
    

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            fromDatabase: false,
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);

        const filePreviews = newImages.map(image => ({
            url: image.url,
            fromDatabase: false,
        }));

        setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);

        if (!mainImage && filePreviews.length > 0) {
            setMainImage(filePreviews[0].url);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setImages(newImages);
        setImagePreviews(newPreviews);

        if (mainImage === imagePreviews[index].url) {
            setMainImage(newPreviews.length > 0 ? newPreviews[0].url : null);
        }
    };


    return (
    <>
    <div>
        <h2 className="text-xl font-semibold">Edit Product</h2>

        {
            !product ? (
            <>
                <h2>No Product Found !</h2>
            </>
            ) : (
            <>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-6 mt-4">
                    <form>
                    <div className='flex flex-col gap-6'>

                        <div className="flex flex-wrap gap-4 justify-between text-lg">
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="categoryName">Category Name</label>
                                <input 
                                type="text"
                                id="categoryName"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder='Enter category name'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="productName">Product Name</label>
                                <input 
                                type="text"
                                id="productName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter product name'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="brandName">Brand Name</label>
                                <input 
                                type="text"
                                id="brandName"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder='Enter brand name'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 h-[420px] bg-white rounded-md border p-2">
                            <div className='w-[20%] h-[100%] overflow-y-auto bg-slate-50 rounded-md'>
                                <div className="flex flex-col items-center justify-center gap-2 py-2">

                                    {
                                        imagePreviews.map((preview, index) => (
                                            <div key={index} className="bg-white rounded-lg relative group w-24 h-24">
                                                <img
                                                    src={preview.url}
                                                    alt={`preview-${index}`}
                                                    className="w-full h-full object-contain rounded-md"
                                                    onClick={() => setMainImage(preview.url)}
                                                />
                                                <span
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="text-xl absolute top-1 right-1 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer hidden group-hover:block"
                                                >
                                                    <IoClose />
                                                </span>
                                            </div>
                                        ))
                                    }

                                    <label htmlFor='productImage' className="flex items-center justify-center rounded-md w-24 h-16 cursor-pointer bg-slate-200 hover:bg-slate-300" title="Add product image">
                                        <IoIosAdd className="text-4xl text-slate-800" />
                                    </label>
                                    <input
                                        id='productImage'
                                        type="file"
                                        accept="image/*"
                                        multiple={true}
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                </div>
                            </div>
                            <div className='w-[80%] h-[100%] flex items-center justify-center'>
                                <div className='w-[350px] h-[350px]'>
                                {
                                    mainImage && (
                                        <img src={mainImage} alt={mainImage} className='w-full h-full object-contain rounded-md' />
                                    )
                                }
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-between text-lg">
                            <div className='w-full'>
                                <label htmlFor="description">Description</label>
                                <textarea 
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Enter product description'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500 block w-full"
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="price">Original Price</label>
                                <input 
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder='Enter product price'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="sellingPrice">Selling Price</label>
                                <input 
                                type="number"
                                id="sellingPrice"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                placeholder='Enter product price'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="discount">Discount</label>
                                <input 
                                type="number"
                                id="discount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder='Enter discount amount'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="inStock">Product In Stock</label>
                                <input 
                                type="number"
                                id="inStock"
                                value={inStock}
                                onChange={(e) => setInStock(e.target.value)}
                                placeholder='Enter product stock amount'
                                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md">Update Product</button>
                        </div>
                    </div>
                    </form>
                </div>
            </>
            )
        }
    </div>
    </>
    )
}

export default EditProduct;