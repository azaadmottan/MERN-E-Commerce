import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import cartImage from "../../assets/cart-image.png";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { MdGppGood } from "react-icons/md";
import { PiTrendUpThin } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa6";
import {
    loadUserCartProducts,
    removeProductFromCart,
    updateProductQuantity,
} from '../../actions/cart.actions.js';
import { PUBLIC_URL } from "../../config/api.config.js";
import convertNumberToINR from "../../handler/NumberToINR.js";
import {
    Modal,
} from "../../components/index.jsx"
import { placeOrder } from '../../actions/requestProduct.actions.js';


function Cart() {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { cartItems, loading, success, error } = useSelector((state) => state.cart);
    const { address } = useSelector((state) => state.address);

    // useEffect(() => {
    //     dispatch(loadUserCartProducts());
    // }, [user]);

    const formatUrl = (name) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const [remove, setRemove] = useState(false);
    const RemoveProductFromCart = () => {
        if(itemId) {
            dispatch(removeProductFromCart(itemId));
            setRemove(true);
        }
        setItemId("");
        setShowRemoveItemModal(false);
    }
    
    useEffect(() => {
        if (success && remove) {
            toast.success("Product removed from cart");
            setRemove(false);
        }
        if(remove && error) {
            toast.error(error);
            setRemove(false);
        }
    }, [cartItems]);

    const [quantities, setQuantities] = useState(
        cartItems.reduce((acc, item) => {
            acc[item?.product?._id] = item.quantity || 1; // Default quantity to 1 if not provided
            return acc;
        }, {})
    );

    const handleIncrease = (productId) => {
        const newQuantity = quantities[productId] + 1;
        if (newQuantity > 5) {
            toast.warn("Reached maximum product quantity");
            return;
        }
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
        dispatch(updateProductQuantity(productId, newQuantity));
        toast.success("Product quantity increased to " + newQuantity);
    };

    const handleDecrease = (productId) => {
        if (!(quantities[productId] > 1)) return; 
        const newQuantity = quantities[productId] > 1 ? quantities[productId] - 1 : 1;
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
        dispatch(updateProductQuantity(productId, newQuantity));
        toast.success("Product quantity decreased to " + newQuantity);
    };

    const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
    const [addressId, setAddressId] = useState(null);

    const handleAddressSelection = (id) => {
        setAddressId(id);
    }

    const confirmOrder = async (e) => {
        if (!addressId) {
            toast.error("Please select delivery address !");
            return;
        }

        const orderData = {
            shippingAddress: addressId,
            orderItems: cartItems,
        }

        const response = await placeOrder(orderData);

        if (response?.success) {
            toast.success("Order placed successfully");
            setShowPlaceOrderModal(false);
            setAddressId(null);
            // dispatch(loadUserCartProducts());
        }

        if (response?.error) {
            toast.error("Something went wrong while placing order");
            return;
        }
    }

    return (
    <>
    <div className="container h-[85vh] p-4 mx-auto my-2 rounded-md">
        {
            !user ? (
            <>
                <div className="h-[80vh] bg-white rounded-md flex flex-col items-center justify-center gap-6 select-none">
                    <img
                    src={cartImage}
                    className="w-64"
                    alt="Cart Image" />

                    <h2 className="text-2xl hover:text-orange-500">Missing Your Cart Items ?</h2>

                    <p className="text-gray-500">Please login to see your items, you added previously in your cart !</p>

                    <button
                    onClick={() => navigate("/login")}
                    className="text-lg font-bold px-10 py-2 rounded-md text-white bg-orange-500 hover:bg-opacity-90 flex items-center gap-2">
                        <PiTrendUpThin className="text-2xl font-bold" />
                        Login Now
                    </button>
                </div>
            </>
            ) : (
            <>
            {
                loading ? (
                    <div className="flex gap-4">
                        <div
                        className="w-[70%] h-[80vh] rounded-md border-2 px-6 py-4 overflow-y-auto hiddenScrollBar flex flex-col gap-4 bg-white">
                            <div className="bg-slate-200 p-6 animate-pulse rounded-md">
                            </div>

                            <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                            <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                            <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                            <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                            <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                        </div>
                        <div className="w-[30%] h-fit border-2 px-6 py-4 rounded-md bg-white"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-200 p-8 rounded-md animate-pulse">
                                </div>

                                <div className="bg-slate-200 p-3 rounded-md animate-pulse">
                                </div>
                                <div className="bg-slate-200 p-3 rounded-md animate-pulse">
                                </div>
                                <div className="bg-slate-200 p-3 rounded-md animate-pulse">
                                </div>

                            </div>

                            <div className="bg-slate-200 rounded-md p-4 mt-6 animate-pulse">
                            </div>
                        </div>
                    </div>
                ) : (
                    cartItems.length > 0 ? (
                        <div className="flex gap-4">
                            <div
                            className="w-[70%] h-[80vh] rounded-md border-2 px-6 py-4 overflow-y-auto hiddenScrollBar bg-white"
                            >
                                <div className="">
    
                                {/* <div className="flex items-center justify-between my-2">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        From Saved Addresses
                                    </h2>
    
                                    <select
                                    className="px-8 py-1 border-2 outline-none focus-within:border-blue-500 rounded-md"
                                    >
                                        <option value="" selected={true}>Select Address</option>
                                        <option value="1">Address 1</option>
                                        <option value="2">Address 2</option>
                                    </select>
                                </div> */}

                                <div className="flex items-center justify-between my-2">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        Your Cart Items
                                    </h2>
                                </div>
    
                                <div className="my-4 flex flex-col gap-6">
                                {
                                    loading ? (
                                    <>
                                        <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                                        <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                                        <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                                        <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                                        <div className="p-10 bg-slate-200 animate-pulse rounded-sm"></div>
                                    </>
                                    ) : (
                                        cartItems?.map((item, index) => (
                                            <div
                                            key={index}
                                            className="card-body px-2 py-4 bg-slate-50 rounded-md flex items-center gap-2 hover:shadow-md">
                                                <div className="w-[20%] h-36">
                                                    <img
                                                    className="w-full h-full object-contain"
                                                    src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/${item?.product?.images[0]}`} 
                                                    alt="" />
                                                </div>
                                                <div className="w-[80%] px-4 py-2 flex flex-col gap-2">
                                                    <h2
                                                    onClick={() => navigate(`/product/${formatUrl(item?.product?.name)}/${item?.product?._id}`)}
                                                    className="text-xl font-semibold cursor-pointer hover:text-blue-500 w-fit tracking-wider text-ellipsis line-clamp-1">
                                                        {
                                                            item?.product?.name
                                                        }
                                                    </h2>
                                                    <h4 className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                                                        {
                                                            item?.product?.brand
                                                        }
                                                    </h4>
    
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-medium tracking-wider">
                                                            {
                                                                convertNumberToINR(item?.product?.sellingPrice)
                                                            }
                                                        </span>
                                                        <span className="font-semibold text-gray-500 line-through tracking-wider">
                                                            {
                                                                convertNumberToINR(item?.product?.price)
                                                            }
                                                        </span>
                                                        <span className="font-bold text-green-500 italic font-serif tracking-wide">
                                                            {item?.product?.discount}% off
                                                        </span>
                                                    </div>
    
                                                    <div className="flex items-center gap-10">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-700">
                                                                Product quantity: 
                                                            </span>
                                                            <button
                                                            onClick={() => handleDecrease(item?.product?._id)}
                                                            className="text-3xl font-medium bg-white rounded-full">
                                                                <CiCircleMinus
                                                                className="hover:text-blue-600"
                                                                title="Decrease Product Quantity"/>
                                                            </button>
                                                            <span className="text-lg font-semibold border px-3 rounded-md tracking-wider bg-white">
                                                                {
                                                                    quantities[item?.product?._id]
                                                                }
                                                            </span>
                                                            <button
                                                            onClick={() => handleIncrease(item?.product?._id)}
                                                            className="text-3xl font-bold bg-white rounded-full">
                                                                <CiCirclePlus className="hover:text-blue-500"
                                                                title="Increase Product Quantity" />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button
                                                            onClick={() => (
                                                                setShowRemoveItemModal(true),
                                                                setItemId(item?.product?._id)
                                                            )}
                                                            className="uppercase font-semibold hover:text-blue-500 tracking-wider bg-white rounded-md px-4 py-0.5 border border-blue-500"
                                                            title="Remove Product From Cart">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                </div>
                                </div>
    
                                
    
                            </div>
    
                            <div className="w-[30%] h-fit border-2 px-6 py-4 rounded-md bg-white"
                            >
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-xl font-medium text-gray-700 tracking-wider uppercase">
                                        Price Details
                                    </h2>
    
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>
                                            Price ({cartItems?.length} items)
                                        </span>
                                        <span>
                                            {
                                                convertNumberToINR( cartItems?.reduce((sum, item) => sum + (item?.product?.price * item?.quantity), 0) )
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>
                                            Discount
                                        </span>
                                        <span className="text-green-500">
                                            {
                                                convertNumberToINR( 
                                                    cartItems?.reduce((sum, item) => sum + (item?.product?.sellingPrice * item?.quantity), 0) - cartItems?.reduce((sum, item) => sum + (item?.product?.price * item?.quantity), 0)
                                                )
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>
                                            Delivery Charges
                                        </span>
                                        {
                                            cartItems?.reduce((sum, item) => sum + (item?.product?.sellingPrice * item?.quantity), 0) > 500 ? (
                                                <p className="flex gap-1">
                                                <span className="line-through">
                                                    ₹80
                                                </span>
                                                <span className="text-green-500">
                                                    Free
                                                </span>
                                                </p>
                                            ) : (
                                                <p className="flex gap-1">
                                                <span>
                                                    ₹80 
                                                </span>
                                                </p>
                                            )
                                        }
                                    </div>
    
                                    <h2 className="flex justify-between text-lg text-gray-600 font-bold">
                                        <span>
                                            Total Amount
                                        </span>
                                        <span>
                                        {
                                            convertNumberToINR( cartItems?.reduce((sum, item) => sum + (item?.product?.sellingPrice * item?.quantity), 0) )
                                        }
                                        </span>
                                    </h2>
    
                                    <p className="text-green-500 font-medium">
                                        You will save <span className="italic tracking-wider">
                                        {
                                            convertNumberToINR( 
                                                cartItems?.reduce((sum, item) => sum + (item?.product?.price * item?.quantity), 0) - cartItems.reduce((sum, item) => sum + (item?.product?.sellingPrice * item?.quantity), 0)
                                            )
                                        }
                                        </span> on this order
                                    </p>
                                </div>
    
                                <div className="bg-slate-100 rounded-md p-2 mt-4">
                                    <p className="flex items-center gap-2 text-gray-800">
                                        <span className="text-4xl">
                                            <MdGppGood />
                                        </span>
                                        <span className="font-medium">
                                            Safe and Secure Payments.Easy returns. 100% Authentic products.
                                        </span>
                                    </p>
                                </div>

                                <button
                                onClick={() => setShowPlaceOrderModal(true)}
                                className="text-lg font-medium text-white bg-orange-500 hover:bg-opacity-90 px-4 py-2 mt-6 rounded-md uppercase flex items-center gap-2">
                                    <SiTicktick />
                                    Place Order
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[80vh] bg-white rounded-md flex flex-col items-center justify-center gap-6 select-none">
                            <img
                            src={cartImage}
                            className="w-64"
                            alt="Cart Image" />
    
                            <h2 className="text-2xl hover:text-orange-500">Your Cart is Empty !</h2>
    
                            <p className="text-gray-500">Add items to it now</p>
    
                            <button
                            onClick={() => navigate("/")}
                            className="text-lg font-bold px-10 py-2 rounded-md text-white bg-blue-600 hover:bg-opacity-90 flex items-center gap-2">
                                <FaCartArrowDown className="text-2xl font-bold" />
                                Shop Now
                            </button>
                        </div>
                    )
                )
            }
            </>
            )
        }

    </div>

    {/* remove product modal */}
    <Modal isOpen={showRemoveItemModal} title="Remove Product From Cart" onClose={() => setShowRemoveItemModal(false)}>
        <div className="grid gap-2">
            <p className="my-3">Are you sure you want to remove this product ?</p>

            <button
            onClick={() => RemoveProductFromCart()}
            className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Confirm Remove
            </button>
        </div>
    </Modal>

    
    {/* place order modal */}
    <Modal isOpen={showPlaceOrderModal} title="Place Order Confirmation" onClose={() => setShowPlaceOrderModal(false)}>
        <div className="grid gap-2">
            <p className="my-2 text-lg">Are you sure you want place this order ?</p>

            <p className="font-bold">
                Total Amount: <span className="text-green-600 tracking-wider">
                    {convertNumberToINR( cartItems?.reduce((sum, item) => sum + (item?.product?.sellingPrice * item?.quantity), 0) )}
                </span>
            </p>

            <p className="font-bold">
                With total <span className="text-blue-600">"{cartItems?.length}"</span> items.
            </p>

            <div>
                <span className="font-bold text-gray-800">
                    Choose Delivery Address:
                </span>
                <div className="mt-2">
                {
                    address?.map((item, index) => (
                        <p
                        key={uuidv4()}
                        onClick={() => handleAddressSelection(item?._id)}
                        className="flex items-center gap-2">
                            <input type="radio"
                            id={`address-${index}`} 
                            name="address"
                            checked={addressId === item?._id}
                            onChange={() => handleAddressSelection(item?._id)} 
                            />
                            <label htmlFor={index} className="cursor-pointer text-gray-600 font-bold hover:text-gray-800" >
                                <span className="">
                                    {item?.country} ({item?.state},
                                    {item?.city},
                                    {item?.postalCode}),
                                    {item?.address}.
                                </span>
                                <span className="inline-block">
                                    {item?.phone},
                                </span>
                            </label>

                        </p>
                    ))
                }
                </div>
            </div>

            <button
            onClick={() => confirmOrder()}
            className="text-white p-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Confirm Order
            </button>
        </div>
    </Modal>
    </>
    )
}

export default Cart;