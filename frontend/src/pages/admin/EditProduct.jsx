import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    IoIosAdd,
    IoClose,
} from "../../components/Icons.jsx";
import {
    MiniLoading,
    Modal,
    BackButton,
    BreadCrumb,
} from "../../components/index.jsx";
import { PUBLIC_URL } from "../../config/api.config.js";
import {
    addNewProductImages,
    updateProduct,
    removeProductImage,
    addAdditionalProductInfo
} from "../../actions/product.actions.js";


function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { product, loading, error, success } = useSelector((state) => {
        const productsState = state.products;
        // state?.products?.products?.find(p => p._id === id)
        return {
            product: productsState?.products?.find((p) => p._id === id),
            // loading: productsState.loading,
            // error: productsState.error,
            // success: productsState.success,
        };
    });

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

    useEffect(() => {
        const discountAmount = price - sellingPrice;

        const discountPercent = (discountAmount / price) * 100;

        setDiscount(Math.round(discountPercent));
    }, [price, sellingPrice]);

    const [submitUpdateForm, setSubmitUpdateForm] = useState(false);
    const submitUpdateProductInfo = async (e) => {
        e.preventDefault();

        if (!name || !brand || !category || !description || !price || !sellingPrice || !discount || !inStock) {
            toast.error("All fields must be provided");
            return;
        }

        // if (images.length === 0) {
        //     toast.error("Product images must be provided");
        //     return;
        // }

        const formData = {
            "name": name,
            "brand": brand,
            "category": category,
            "description": description,
            "price": price,
            "sellingPrice": sellingPrice,
            "discount": discount,
            "countInStock": inStock,
        }
    
        // images.forEach((image) => {
        //     let simplifiedPath = image;
        //     if (image?.name.includes("productImages")) {
        //         simplifiedPath = image.name.replace(/^.*productImages\//, '');
        //     }
        //     formData.append('productImages', simplifiedPath);
        // });

        dispatch(updateProduct(product?._id, formData));

        setSubmitUpdateForm(true);
        navigate(-1);
    }
    
    // useEffect(() => {
    //     if (submitUpdateForm && success) {
    //         toast.success("Product information updated successfully");
            
    //         setSubmitUpdateForm(false);
    //     }
    //     if (submitUpdateForm && error) {
    //         toast.error(error);
    //         setSubmitUpdateForm(false);
    //         return;
    //     }
    // }, [submitUpdateForm]);

    const addNewImage = () => {
        const newImages = images.filter(image => !image?.fromDatabase)

        if (newImages.length === 0) {
            toast.error("New image file must be provided");
            return;
        }

        const formData = new FormData();

        newImages.forEach((image) => {
            formData.append('productImages', image.file);
        });

        dispatch(addNewProductImages(product?._id, formData));

        navigate(-1);
    }

    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
    const removeImage = () => {
        const image = mainImage;

        const isDbImage = images.some(img => img.url === image && img.fromDatabase);

        if (!isDbImage) {
            toast.warn("This image is temporarily display here !");
            return;
        }

        const imageUrl = image.replace("http://localhost:8000/","");

        const imagePath = {
            "imagePath": imageUrl,
        }

        dispatch(removeProductImage(product?._id, imagePath));

        navigate(-1);
    }

    const [additionalData, setAdditionalData] = useState("");
    useEffect(() => {
        if (product?.attributes) {
            setAdditionalData(JSON.stringify(product.attributes, null, 2));
        }
    }, [product]);

    const addAdditionalProductInformation = (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(additionalData);

            if (typeof data !== 'object' || Array.isArray(data)) {
                toast.error("Invalid data format. Data must be in the form of JSON / object.");
                return;
            }
            const productData = {
                "data": data
            }
            dispatch(addAdditionalProductInfo(product?._id, productData));
            navigate(-1);
        } catch (error) {
            toast.error("Invalid data format. Data must be in the form of object {'key': 'value'}.");
            return;
        }
    }

    return (
    <>
    <div>
        <h2 className="text-xl font-semibold mt-2">Edit Product</h2>

        {
            loading ? (
                <div className="w-full flex items-center justify-center">
                    <MiniLoading />
                </div>
            ) : (

                !product ? (
                <>
                    <h2 className="mt-4 text-lg font-semibold text-gray-600">Product Not Found ! !</h2>
                    <p className="text-gray-400">Invalid product id !</p>
                </>
                ) : (
                <>
                    <div className="border border-slate-200 bg-slate-50 rounded-md p-6 mt-4">
                        <div className='flex flex-col gap-6'>
                        
                            <div className="flex items-center gap-2 h-[420px] bg-white rounded-md border p-2">
                                <div className='w-[20%] h-[100%] overflow-y-auto bg-slate-50 rounded-md'>
                                    <div className="flex flex-col items-center justify-center gap-2 py-2">
    
                                        {
                                            imagePreviews.map((preview, index) => (
                                                <div key={index} className="bg-white rounded-lg relative group w-24 h-24 p-1 border-2 cursor-pointer hover:border-blue-500"
                                                title="Preview image"
                                                >
                                                    <img
                                                        src={preview.url}
                                                        alt={`preview-${index}`}
                                                        className="w-full h-full object-contain rounded-md"
                                                        onClick={() => setMainImage(preview.url)}
                                                    />
                                                    <span
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="text-xl absolute top-0 right-0 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer hidden group-hover:block"
                                                        title="Remove image"
                                                    >
                                                        <IoClose />
                                                    </span>
                                                </div>
                                            ))
                                        }
    
                                        <label htmlFor='productImage' className="flex items-center justify-center rounded-md w-24 h-16 cursor-pointer border-2 hover:border-blue-500 bg-slate-200 hover:bg-slate-300" title="Add product image">
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

                            <div className="flex items-center gap-4">
                                <button 
                                className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md"
                                onClick={() => addNewImage()}
                                >Add New Images</button>

                                <button 
                                className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md"
                                onClick={() => setShowDeleteImageModal(true)}
                                >Remove Image</button>
                            </div>
                        </div>
    
                        <form
                        onSubmit={submitUpdateProductInfo}
                        >
                        <div className='flex flex-col gap-6 mt-4'>

                            <h2 className="text-xl font-semibold">Product Main Information</h2>
    
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
                                    <label htmlFor="discount">Discount in %</label>
                                    <input 
                                    type="number"
                                    id="discount"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder='Enter discount amount'
                                    readOnly={true}
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
                                <button 
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md">Update Product Information</button>
                            </div>
                        </div>
                        </form>

                        <form
                        onSubmit={addAdditionalProductInformation}
                        >
                        <div className="flex flex-col gap-6 mt-4">
                            <h2 className="text-xl font-semibold">Product Additional Information</h2>

                            <div className='w-full text-lg'>
                                <label htmlFor="additional-info">Additional Fields</label>
                                <small className="text-red-500 block"> Note: Data must be in the form of /* key: value */ JSON form</small>
                                <textarea 
                                type="text"
                                id="additional-info"
                                value={additionalData}
                                onChange={(e) => setAdditionalData(e.target.value)}
                                placeholder='Enter product description'
                                className="outline-none h-72 px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500 block w-full"
                                />
                            </div>

                            <div>
                                <button 
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md">Add Additional Information</button>
                            </div>
                        </div>
                        </form>
                    </div>
                </>
                )
            )
        }

        {/* remove product image modal */}
        <Modal isOpen={showDeleteImageModal} title="Delete Product Image" onClose={() => setShowDeleteImageModal(false)}>
            <div className="grid gap-2">
                <p className="my-3">Are you sure you want to delete this image ?</p>

                <button
                onClick={() => removeImage()}
                className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Confirm Delete
                </button>
            </div>
        </Modal>
    </div>
    </>
    )
}

export default EditProduct;