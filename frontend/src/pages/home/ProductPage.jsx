import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
// import ReactImageMagnify from "react-image-magnify";
import { PUBLIC_URL } from '../../config/api.config';
import {
    MiniLoading,
} from '../../components/index.jsx';
import {
    VerticalCardSlider
} from "../../components/home/index.jsx";
import {
    FaCartShopping,
    AiFillThunderbolt,
    IoStar,
    BsCurrencyRupee,
    MdOutlineLocalOffer,
    CgDetailsMore,
    MdVerified,
    ImSpinner9,
} from "../../components/Icons.jsx"
import {
    createProductReview,
    getProductById,
    getProductReview
} from '../../actions/requestProduct.actions.js';
import { addProductToCart } from '../../actions/cart.actions.js';
// import { AddProductToCart } from "../../handler/AddProductToCart.js";

function ProductPage() {
    const { productId } = useParams();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.user);
    // const { product, loading, error, success } = useSelector((state) => {
    //     const productsState = state.products;
    //     // state?.products?.products?.find(p => p._id === id)
    //     return {
    //         product: productsState?.products?.find((p) => p._id === productId),
    //         loading: productsState.loading,
    //         error: productsState.error,
    //         success: productsState.success,
    //     };
    // });

    const [product, setProduct] = useState([]);
    const [isProductLoading, setIsProductLoading] = useState(true);
    const getProduct = async () => {
        const response = await getProductById(productId);
        
        if (response?.success) {
            setProduct(response?.product);
        }
    }
    
    useEffect(() => {
        setIsProductLoading(true);
        getProduct();
        setIsProductLoading(false);
    }, [productId]);

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
                url: `${PUBLIC_URL.PUBLIC_STATIC_URL}/${image}`,
                fromDatabase: true,
            })));

            if (databaseImagePreviews.length > 0) {
                setMainImage(databaseImagePreviews[0].url);
            }
        }
    }, [product])

    // image magnifier

    const offers = [
        {key: "Bank Offer", value: "Bank Offer5% Cashback on Shopkart Axis Bank Card"},
        {key: "Bank Offer", value: "₹4000 Off On ICICI Bank Credit Non EMI, Credit and Debit Card EMI Transactions"},
        {key: "Bank Offer", value: "₹4000 Off On SBI Bank Credit Card Transactions"},
        {key: "Special Price", value: "Get extra ₹6901 off (price inclusive of cashback/coupon)"},
        {key: "Freebie", value: "Flat ₹1000 off on Cleartrip hotels booking along with 300 supercoins on booking"},
        {key: "Partner Offer", value: "Sign-up for Shopkart Pay Later & get free Times Prime Benefits worth ₹20,000*"},
        {key: "No cost EMI", value: "₹11,834/month. Standard EMI also available"},
        {key: "Bank Offer", value: "₹700 off on Shopkart UPI"},
        {key: "Partner Offer", value: "Make a purchase and enjoy a surprise cashback/ coupon that you can redeem later!"},
        {key: "Extra Offer", value: "Extra ₹500 off on Combo PurchaseT&C",}
    ]

    const [productReviews, setProductReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // get product reviews
    const getReviews = async () => {
        if (product?._id) {
            setIsLoading(true);
            const response = await getProductReview(product?._id);
            if (response?.success) {
                setProductReviews(response?.reviews);
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getReviews();
    }, [product])
    

    const [rateProductBtn, setRateProductBtn] = useState(false);
    const [ratingState, setRatingState] = useState(0);

    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDescription, setReviewDescription] = useState("");

    const submitReviewForm = async (e) => {
        e.preventDefault();

        if (ratingState === 0) {
            toast.error("Please rate the product");
            return;
        }
        if (!reviewTitle.trim()) {
            toast.error("Review title must be provided");
            return;
        }
        if (!reviewDescription.trim()) {
            toast.error("Review description is also required");
            return;
        }

        const data = {
            rating: ratingState,
            title: reviewTitle,
            description: reviewDescription,
        }
        const response = await createProductReview(product?._id, data);

        if (response?.success) {
            toast.success("Review submitted successfully");
            setRatingState(0);
            setReviewTitle("");
            setReviewDescription("");

            getReviews();
        }
        if (!response?.success) {
            toast.error(response?.message);
            return;
        }

    }

    const AddProductToCart = (id) => {
        dispatch(addProductToCart(productId));
        toast.success("Product added to cart");
    }

    return (
    <>
    <div className="p-2">
        {
            isLoading ? (
                <>
                    <div className="flex items-center gap-2">
                        <div className=" w-[40%] h-[85vh] bg-white rounded-md border">
                            <div className="flex items-center gap-2 p-2">
                                <div className='w-[30%] h-[70vh] overflow-y-auto bg-slate-50 rounded-md'>
                                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                                        <p className="w-32 h-24 p-2 rounded-sm bg-slate-200 animate-pulse"></p>
                                        <p className="w-32 h-24 p-2 rounded-sm bg-slate-200 animate-pulse"></p>
                                        <p className="w-32 h-24 p-2 rounded-sm bg-slate-200 animate-pulse"></p>
                                        <p className="w-32 h-24 p-2 rounded-sm bg-slate-200 animate-pulse"></p>
                                        
                                    </div>
                                </div>
                                <div className='w-[70%] h-[70vh] flex items-center justify-center relative'>
                                    <div className='w-[350px] h-[350px] flex items-center justify-center'>
                                    <div className='w-full h-full bg-slate-200 rounded-md animate-pulse'>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-[60%] h-[85vh] bg-white rounded-md border overflow-y-auto hiddenScrollBar">
                            <div className="px-8 py-6 flex flex-col gap-3">
                                <h2 className="font-semibold bg-slate-200 rounded-sm animate-pulse p-6">
                                </h2>

                                <h3 className="bg-slate-200 rounded-sm animate-pulse p-4 w-80">
                                </h3>

                                <p className="bg-slate-200 rounded-sm animate-pulse p-3 w-52">
                                </p>

                                <p className="bg-slate-200 rounded-sm animate-pulse p-4 w-96">
                                </p>

                                <p className="bg-slate-200 rounded-sm animate-pulse p-3">
                                </p>
                                <p className="bg-slate-200 rounded-sm animate-pulse p-3">
                                </p>
                                <p className="bg-slate-200 rounded-sm animate-pulse p-4">
                                </p>

                                <div>
                                    <ul className="flex flex-col gap-6 mt-2">
                                        {
                                        offers.map((element, index) => (
                                            <li 
                                            key={index}
                                            className="bg-slate-200 rounded-sm animate-pulse p-2"> 
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                                
                                <div>
                                    
                                </div>

                                <div>
                                    
                                </div>

                                <div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            ) : (
                product ? (
                    <>
                    <div className="flex items-center gap-2">
                        <div className=" w-[40%] h-[85vh] bg-white rounded-md border">
                            <div className="flex items-center gap-2 p-2">
                                <div className='w-[30%] h-[70vh] overflow-y-auto bg-slate-50 rounded-md'>
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
                                                    
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='w-[70%] h-[70vh] flex items-center justify-center relative'>
                                    <div className='w-[350px] h-[350px] p-2 flex items-center justify-center'>
                                    <div className='w-full h-full'>
                                        {
                                            mainImage && (
                                                <img 
                                                src={mainImage}
                                                alt={mainImage} 
                                                className='w-full h-full object-contain rounded-md' 
                                                
                                                />

                                                // <ReactImageMagnify {...{
                                                //     smallImage: {
                                                //         alt: mainImage,
                                                //         isFluidWidth: true,
                                                //         src: mainImage,
                                                //     },
                                                //     largeImage: {
                                                //         src: mainImage,
                                                //         width: 1000,
                                                //         height: 1000
                                                //     },
                                                //     isHintEnabled: true,
                                                //     enlargedImageContainerDimensions: {width: 800, height:350}
                                                // }} />
                                            )
                                        }
                                    </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            {
                                isAuthenticated && (
                                    <div className='bg-slate-00 p-2 flex items-center justify-around'>
                                        <button
                                        onClick={() => AddProductToCart(productId)}
                                        className="bg-yellow-400 text-xs lg:text-base text-white font-bold rounded-md hover:opacity-85 px-4 py-1 md:px-10 md:py-3 flex items-center gap-2"
                                        >
                                            <FaCartShopping /> ADD TO CART 
                                        </button>

                                        <button
                                        className="bg-orange-500 text-xs lg:text-base text-white font-bold rounded-md hover:opacity-85 px-10 py-3 flex items-center gap-2"
                                        >
                                            <AiFillThunderbolt /> BUY NOW
                                        </button>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-[60%] h-[85vh] bg-white rounded-md border overflow-y-auto hiddenScrollBar">
                            <div className="px-8 py-6 flex flex-col gap-3">
                                <h2 className="text-2xl font-semibold">
                                    {product?.name} <span className="text-lg text-gray-500 font-medium uppercase">({product?.brand})</span>
                                </h2>

                                <h3 className="text-gray-600">
                                    {product?.attributes ? `Product Config: ${product?.attributes?.Color}, ${product?.attributes?.Storage}` : ``}
                                </h3>

                                <p className="flex items-center gap-2 text-gray-600 font-medium">
                                    <span className="bg-green-500 text-white font-semibold w-fit px-2 py-0 rounded-md flex items-center gap-1">
                                        {product?.rating} <IoStar />
                                    </span>
                                    Ratings & Reviews
                                </p>

                                <p className="tracking-wider">
                                    <span className="font-extrabold italic font-serif text-green-500">
                                    {product?.discount}% off
                                    </span>
                                    <span className="font-medium not-italic text-gray-600"> on this Product</span>
                                </p>

                                <p className="text-sm bg-orange-500 text-white font-mono italic w-fit px-2 py-0.5 rounded-full">
                                    <span className="text-sm font-extrabold">Sk</span> Assured Product
                                </p>

                                <p className="flex items-center gap-2 mt-2 tracking-wide">
                                    <span className="flex items-center text-3xl font-bold">
                                        ₹{product?.sellingPrice}
                                    </span>
                                    <span className="flex items-center text-gray-700 text-xl line-through">
                                        ₹{product?.price}
                                    </span>
                                    <span>

                                    </span>
                                </p>

                                <p>
                                    <span className="flex items-center gap-1 text-gray-500">
                                        Save
                                        <span className="text-green-500 font-medium flex items-center gap-1">
                                            ₹{product?.price - product?.sellingPrice}
                                        </span>
                                        on this Product
                                    </span>
                                </p>

                                <div>
                                    <h4 className="text-xl font-semibold">Available Offers</h4>

                                    <ul className="flex flex-col gap-3 mt-2">
                                        {
                                            offers.map((element, index) => (
                                                <li 
                                                key={index}
                                                className="flex items-center gap-2"> 
                                                    <MdOutlineLocalOffer className="text-green-500" />
                                                    <span className="font-medium">
                                                        {element.key}:
                                                    </span>
                                                    <span>
                                                        {element.value}
                                                    </span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                
                                <div>
                                    <h4 className="text-xl font-semibold">Product Description</h4>

                                    <p className="text-justify mt-2">
                                        {product?.description ? product?.description : "---"}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold">
                                        Product Specifications
                                    </h4>
                                    
                                    <div>
                                        <ul className="flex flex-col gap-3 mt-2">
                                        {
                                            product?.attributes ? (

                                                Object.entries(product?.attributes)?.map(([key, value]) => (
                                                    <li className="flex items-center gap-2">
                                                        <span className="text-green-500">
                                                            <CgDetailsMore />
                                                        </span>
                                                        <span className="font-medium w-[30%]">
                                                            {key}: 
                                                        </span>
                                                        <span>
                                                            {value}
                                                        </span>
                                                    </li>
                                                ))
                                            ) : (
                                                "---"
                                            )
                                        }
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold">
                                        Rating & Reviews
                                    </h4>

                                    <div className="flex flex-col gap-3 mt-2">
                                        <h5 className="text-lg">What makes a good review</h5>

                                        <h6>Have you used this product?</h6>
                                        <p className="text-gray-500">Your review should be about your experience with the product.</p>

                                        <h6>Why review a product?</h6>
                                        <p className="text-gray-500">Your valuable feedback will help fellow shoppers decide!</p>

                                        <h6>How will the reviewer feel after reading your review?</h6>
                                        <p className="text-gray-500">The reviewer should feel appreciated and valued.</p>
                                    </div>

                                    <button 
                                    onClick={() => setRateProductBtn((prev) => !prev)}
                                    className="bg-slate-100 hover:bg-slate-200 font-medium px-4 py-2 rounded-md mt-4 flex items-center gap-2">
                                        Rate Product <IoStar />
                                    </button>

                                    {
                                    rateProductBtn && (
                                        isAuthenticated ? (
                                            <div className="mt-4">
                                            <form
                                            onSubmit={submitReviewForm}
                                            >
                                                <h2 className="text-lg font-medium">Rate this product</h2>
                                                <div className="my-2">
                                                    <div className="text-3xl text-slate-400 flex items-center gap-4">
                                                        <div className="group relative">
                                                            <IoStar 
                                                            onClick={() => setRatingState(1)}
                                                            className={`cursor-pointer hover:text-yellow-400 ${ratingState >= 1 ? "text-yellow-400" : ""}`} />
                                                            <span className="text-nowrap bg-black text-white rounded-md text-sm font-medium px-4 py-0.5 bg-opacity-90 hidden group-hover:block absolute -top-8">Very Bad</span>
                                                        </div>
                                                        <div className="group relative">
                                                            <IoStar 
                                                            onClick={() => setRatingState(2)}
                                                            className={`cursor-pointer hover:text-yellow-400 ${ratingState >= 2 ? "text-yellow-400" : ""}`} />
                                                            <span className="text-nowrap bg-black text-white rounded-md text-sm font-medium px-4 py-0.5 bg-opacity-90 hidden group-hover:block absolute -top-8">Bad</span>
                                                        </div>
                                                        <div className="group relative">
                                                            <IoStar 
                                                            onClick={() => setRatingState(3)}
                                                            className={`cursor-pointer hover:text-yellow-400 ${ratingState >= 3 ? "text-yellow-400" : ""}`} />
                                                            <span className="text-nowrap bg-black text-white rounded-md text-sm font-medium px-4 py-0.5 bg-opacity-90 hidden group-hover:block absolute -top-8">Good</span>
                                                        </div>
                                                        <div className="group relative">
                                                            <IoStar 
                                                            onClick={() => setRatingState(4)}
                                                            className={`cursor-pointer hover:text-yellow-400 ${ratingState >= 4 ? "text-yellow-400" : ""}`} />
                                                            <span className="text-nowrap bg-black text-white rounded-md text-sm font-medium px-4 py-0.5 bg-opacity-90 hidden group-hover:block absolute -top-8">Very Good</span>
                                                        </div>
                                                        <div className="group relative">
                                                            <IoStar 
                                                            onClick={() => setRatingState(5)}
                                                            className={`cursor-pointer hover:text-yellow-400 ${ratingState >= 5 ? "text-yellow-400" : ""}`} />
                                                            <span className="text-nowrap bg-black text-white rounded-md text-sm font-medium px-4 py-0.5 bg-opacity-90 hidden group-hover:block absolute -top-8">Excellent</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h2 className="text-lg font-medium">Review this product</h2>
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <label htmlFor="review-title">Review Title</label>
                                                    <input 
                                                    type="text" 
                                                    id="review-title" 
                                                    value={reviewTitle}
                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                    className="text-lg px-2 py-0.5 rounded-md outline-none border-2 focus-within:border-blue-500"
                                                    placeholder="Enter review title" />

                                                    <label htmlFor="review-description">Review Description</label>
                                                    <textarea 
                                                    id="review-description" 
                                                    value={reviewDescription}
                                                    onChange={(e) => setReviewDescription(e.target.value)}
                                                    className="text-lg px-2 py-0.5 h-40 rounded-md outline-none border-2 focus-within:border-blue-500"
                                                    placeholder="Enter review description"></textarea>

                                                    <button className="text-lg text-white bg-orange-500 hover:bg-orange-400 w-fit px-4 py-1 rounded-md">Submit</button>
                                                </div>
                                            </form>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-lg text-center text-gray-600 hover:text-orange-500 cursor-default">Please login to rate the product.</p>
                                            </div>
                                        )
                                    )
                                    }
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold my-3">Product Buyer Reviews</h4>

                                    <div>
                                        {
                                            !isLoading ? (
                                                productReviews?.length > 0 ? (
                                                    <ul className="flex flex-col gap-4">
                                                        {
                                                            productReviews?.map((review) => (
                                                            <>
                                                            <li>
                                                                <p className="flex items-center gap-2">
                                                                    <p
                                                                    className="flex items-center gap-1 px-2 py-0 text-sm font-medium text-white bg-green-500 rounded-md">
                                                                        {review?.rating} <IoStar />
                                                                    </p>
                                                                    <p
                                                                    className="text-lg font-medium"
                                                                    >{review?.title}</p>
                                                                </p>
                                                                <p
                                                                className="mt-2 text-gray-800"
                                                                >
                                                                    {review?.description}
                                                                </p>
                                                                <p className="mt-2 text-gray-400 font-medium flex gap-2 cursor-default">
                                                                    <span className="hover:text-gray-800">
                                                                    {
                                                                        review?.user?.fullName
                                                                    },
                                                                    </span>
                                                                    <span className="flex items-center gap-2 hover:text-gray-800 group">
                                                                        <MdVerified className="text-blue-500 group-hover:text-blue-700" /> Certified Buyer,
                                                                    </span>
                                                                    <span className="font-normal hover:text-gray-800">
                                                                    {
                                                                        moment(review?.createdAt).format("LL")
                                                                    }
                                                                    </span>
                                                                </p>
                                                            </li>
                                                            </>
                                                            ))
                                                        }
                                                    </ul>
                                                ) : (
                                                    <p className="text-lg text-center text-gray-600 hover:text-orange-500 cursor-default">Product not reviewed yet.</p>
                                                )
                                            ) : (
                                                <MiniLoading />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto my-2">
                        {
                            product?.category ? (
                                <VerticalCardSlider category={product?.category} heading={"Recommended Similar Products"} />
                            ) : (
                                <div className="bg-white p-2 my-2 rounded-md">
                                    <h2 className="text-xl font-medium">Recommended Similar Products</h2>
                                    <h4 className="text-center text-lg">
                                        No more similar product found for this category !
                                    </h4>
                                </div>
                            )
                        }
                    </div>
                    </>
                ) : (
                    <div className='w-full h-[75vh] flex items-center justify-center'>
                        <div className="flex flex-col items-center justify-center gap-8">
                            <ImSpinner9 size={60} />
                            <h2 className="text-2xl font-semibold">
                                Requested Product Not Found !
                            </h2>
                            <Link to="/">
                                <a className="text-lg text-blue-600 hover:text-blue-700 hover:underline">
                                    Go Back to Home
                                </a>
                            </Link>
                        </div>
                    </div>
                )
            )
        }
    </div>
    </>
    );
}

export default ProductPage;