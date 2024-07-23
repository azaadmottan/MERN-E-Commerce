import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { PUBLIC_URL } from "../../config/api.config.js";
import {
    IoIosAdd,
    IoClose,
    BsThreeDotsVertical
} from "../../components/Icons.jsx";
import {
    Modal,
    MiniLoading,
    AdminProductCard,
} from "../../components/index.jsx";
import {
    addNewProduct,
    loadProducts,
} from "../../actions/product.actions.js";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

function Product() {
    const dispatch = useDispatch();
    const { category } = useSelector((state) => state.category);
    const { products, loading: productLoading, pageNo, totalPages, error } = useSelector((state) => state.products);

    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [countInStock, setCountInStock] = useState("");

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prevImages) => [...prevImages, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));

        setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    useEffect(() => {
        const discountAmount = price - sellingPrice;

        const discountPercent = (discountAmount / price) * 100;

        setDiscount(Math.round(discountPercent));
    }, [price, sellingPrice]);

    const [addProductFormSubmit, setAddProductFormSubmit] = useState(false);
    const submitAddProductForm = async (e) => {
        e.preventDefault();

        if (!name || !brand || !categoryName || !description || !price || !sellingPrice || !discount || !countInStock) {
            toast.error("All fields must be provided");
            return;
        }

        if (images.length === 0) {
            toast.error("Product images must be provided");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('category', categoryName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('sellingPrice', sellingPrice);
        formData.append('discount', discount);
        formData.append('countInStock', countInStock);
    
        images.forEach((image) => {
            formData.append('productImages', image);
        });

        dispatch(addNewProduct(formData));

        setAddProductFormSubmit(true);
    }
    
    useEffect(() => {
        if (addProductFormSubmit && !error) {
            toast.success("Product added successfully");
            setShowAddProductModal(false);
            setName("");
            setBrand("");
            setCategoryName("");
            setDescription("");
            setPrice("");
            setSellingPrice("");
            setDiscount("");
            setCountInStock("");
            setImages([]);
            setImagePreviews([]);
            setAddProductFormSubmit(false);
        }
    
        if (error) {
            toast.error(error);
            setAddProductFormSubmit(false);
            return;
        }
    }, [products, dispatch, productLoading]);

    const handlePageChange = (page) => {
        dispatch(loadProducts(page));
    }

    return (
    <>
    <div>
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <button
            className="flex items-center gap-2 text-white rounded-md p-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddProductModal(true)}
            >
                <IoIosAdd className="text-xl text-white" />
                Add New Product
            </button>
        </div>

        <div className="border border-slate-200 bg-slate-50 rounded-md p-6 mt-4 flex flex-wrap items-center justify-between gap-4 ">
            {
                productLoading ? (
                    <div className="w-full flex items-center justify-center">
                        <MiniLoading />
                    </div>
                ) : (
                    products.map((product, index) => (
                        <AdminProductCard 
                            _id={product?._id}
                            imgUrl={product?.images[0]} 
                            name={product?.name} 
                            brand={product?.brand} 
                            discount={product?.discount} 
                            price={product?.price} 
                            sellingPrice={product?.sellingPrice} 
                            rating={product?.rating || "2.4"}
                            key={uuidv4()} 
                        />
                    ))
                )
            }
        </div>

        <div className="bg-slate-300 p-2 mt-4 flex items-center justify-center gap-2 rounded-md">
            <button
                disabled={pageNo === 1}
                onClick={() => handlePageChange(pageNo - 1)}
                className={`${pageNo === 1 ? "bg-gray-500" : "bg-gray-800 hover:bg-gray-950"} text-white p-2 rounded-md flex items-center text-2xl`}
            >
                <MdOutlineKeyboardDoubleArrowLeft />
            </button>
            
            {[...Array(totalPages).keys()].map((page) => (
                <button
                    key={page + 1}
                    className={`${pageNo === page + 1 ? 'bg-blue-600 text-white' : 'bg-white text-black hover:text-white hover:bg-blue-600'} rounded-md px-4 py-2 font-bold transition-all ease-in-out duration-75 delay-75`}
                    onClick={() => handlePageChange(page + 1)}
                >
                    {page + 1}
                </button>
            ))}

            <button
                disabled={pageNo === totalPages}
                onClick={() => handlePageChange(pageNo + 1)}
                className={`${pageNo === totalPages ? "bg-gray-500" : "bg-gray-800 hover:bg-gray-950"} text-white p-2 rounded-md flex items-center text-2xl`}
            >
                <MdOutlineKeyboardDoubleArrowRight />
            </button>
        </div>


        {/* add new product modal */}
        <Modal isOpen={showAddProductModal} title="Add New Product" onClose={() => setShowAddProductModal(false)}>
            <form onSubmit={submitAddProductForm}
            className="grid gap-2" encType="multipart/form-data">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name='name'
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter category name" />

                <label htmlFor="brand">Brand</label>
                <input type="text" id="brand" name='brand'
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter brand name" />

                <label htmlFor="category">Category</label>
                <select id="category" name='category'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                >
                    
                    {
                        category?.map((cat, index) => (
                            <option key={cat?._id} value={cat.name}>{cat.name}</option>
                        ))
                    }
                </select>

                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name='description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter description here"></textarea>

                <label htmlFor="price">Price</label>
                <input type="number" id="price" name='price'
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter product price" />

                <label htmlFor="sellingPrice">Selling Price</label>
                <input type="number" id="sellingPrice" name='sellingPrice'
                value={sellingPrice} 
                onChange={(e) => setSellingPrice(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter product selling price" />

                <label htmlFor="discount">Discount in %</label>
                <input type="number" id="discount" name='discount'
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter discount"
                readOnly={true}/>

                <label htmlFor="countInStock">Count In Stock</label>
                <input type="number" id="countInStock" name='countInStock'
                value={countInStock} 
                onChange={(e) => setCountInStock(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter total product in stock" />

                <label htmlFor="categoryImage">Category Image</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple={true}
                    onChange={handleImageChange}
                    className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                />
                <div className="bg-slate-100 rounded-md p-2 flex flex-wrap justify-between gap-1">
                {
                    imagePreviews.length == 0 ? (
                        <h3 className="text-center w-full">
                            Product Image Must Be Provided !
                        </h3>
                    ) : (
                        imagePreviews.map((preview, index) => (
                            <div key={index} className="bg-white rounded-lg relative group">
                                <img
                                    src={preview}
                                    alt={`preview-${index}`}
                                    className="w-[150px] h-[150px] object-cover rounded-md"
                                />
                                <span
                                    onClick={() => handleRemoveImage(index)}
                                    className="text-xl absolute top-1 right-1 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer hidden group-hover:block"
                                >
                                    <IoClose />
                                </span>
                            </div>
                        ))
                    )
                }
                </div>

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Add Product
                </button>
            </form>
        </Modal>

    </div>
    </>
    )
}

export default Product;
