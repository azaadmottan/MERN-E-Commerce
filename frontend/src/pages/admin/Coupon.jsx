import React, { useEffect, useState } from 'react';
import { IoIosAdd } from "react-icons/io";
import { toast } from 'react-toastify';
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../components/index.jsx";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from '../../actions/requestProduct.actions.js';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete, MdEdit } from 'react-icons/md';


function Coupon() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchCoupons = async () => {
        setLoading(true);
        const response = await getAllCoupons();
        if (response?.success) {
            setCoupons(response?.coupons);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCoupons();
    }, []);

    const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [discountType, setDiscountType] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [noOfItems, setNoOfItems] = useState("");
    const [couponStatus, setCouponStatus] = useState("");
    const [expDate, setExpDate] = useState("");

    const handleCouponFormSubmit = async (e) => {
        e.preventDefault();

        if (!couponCode || !discountType || (discountType === 'none') || !discountValue || !noOfItems || !expDate) {
            toast.error("Please enter all the required fields !");
            return;
        }

        const response = await createCoupon(couponCode, discountType, discountValue, noOfItems, expDate);

        if (response?.success) {
            toast.success("Coupon created successfully");
            setShowCreateCouponModal(false);
            setCouponCode("");
            setDiscountType("");
            setDiscountValue("");
            setExpDate("");
            fetchCoupons();
        }
        if (response?.error) {
            toast.error("Something went wrong while creating coupon");
        }
    }

    const [showEditMenu, setShowEditMenu] = useState({});
    const toggleEditMenu = (e, id) => {
        e.stopPropagation();
        e.preventDefault();
        setShowEditMenu(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const [showEditCouponModal, setShowEditCouponModal] = useState(false);
    const [editCouponId, setEditCouponId] = useState("");
    const updateCouponDetails = async (e) => {
        e.preventDefault();

        if (!editCouponId) {
            toast.error("Coupon Id not found");
            return;
        }

        if (!couponCode || !discountType || (discountType === 'none') || !discountValue || !couponStatus || (couponStatus === 'none') || !expDate) {
            toast.error("Please enter all the required fields !");
            return;
        }

        const response = await updateCoupon(editCouponId, couponCode, discountType, discountValue, expDate, couponStatus);

        if (response?.success) {
            toast.success("Coupon updated successfully");
            setShowEditCouponModal(false);
            setEditCouponId("");
            setCouponCode("");
            setDiscountType("");
            setDiscountValue("");
            setExpDate("");
            fetchCoupons();
        }
        if (response?.error) {
            toast.error(response?.message);
        }
    }

    const [showDeleteCouponModal, setShowDeleteCouponModal] = useState(false);
    const [deleteCouponId, setDeleteCouponId] = useState("");
    const handleDeleteCoupon = async () => {
        if (!deleteCouponId) {
            toast.error("Coupon Id not found");
            return;
        }

        const response = await deleteCoupon(deleteCouponId);
        if (response?.success) {
            toast.success("Coupon deleted successfully");
            setDeleteCouponId("");
            fetchCoupons();
            setShowDeleteCouponModal(false);
        }
        if (response?.error) {
            toast.error(response?.message);
        }
    }

    return (
    <>
    <div>
        <h2 className="text-xl font-semibold my-2">Coupons</h2>

        {
            loading ? (
            <>
                <div className="p-8 my-6 rounded-md bg-slate-200 animate-pulse"></div>
                <p className="p-4 mt-4 rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[50%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[50%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[80%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[70%] bg-slate-200 animate-pulse"></p>
                <p className="p-4 mt-4 rounded-md w-[90%] bg-slate-200 animate-pulse"></p>
            </>
            ) : (
            <>
                <div>
                    <h4 className="flex items-center justify-between">
                        <span className="text-lg font-medium">
                            Create New Coupon
                        </span>
                        <button
                        onClick={() => setShowCreateCouponModal(true)}
                        className="text-white bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 rounded-md flex items-center gap-2">
                            <IoIosAdd className="text-xl text-white" /> 
                            Create Coupon
                        </button>
                    </h4>

                    <h4 className="text-lg font-medium">All Coupons</h4>
                    <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-scroll hiddenScrollBar py-2">
                    {
                        (coupons.length === 0) ? (
                            <p className="text-center text-lg bg-slate-50 p-2 rounded-md">No coupon found !</p>
                        ) : (
                            coupons.map((coupon) => (
                                <div key={uuidv4()} className="p-4 flex flex-col gap-2 bg-slate-100 rounded-md hover:shadow-md group relative">
                                    <span 
                                        className="text-lg cursor-pointer p-2 bg-slate-50 hover:bg-white rounded-full absolute top-2 right-2 hidden group-hover:block"
                                        onClick={(e) => toggleEditMenu(e, coupon?._id)}
                                        >
                                        <BsThreeDotsVertical className="relative" />
                                        {
                                            showEditMenu[coupon?._id] && (
                                                <div className="bg-white shadow-md text-nowrap rounded-md overflow-hidden absolute right-0 ">
                                                    <button 
                                                    onClick={() => (
                                                        setShowEditCouponModal(true),
                                                        setEditCouponId(coupon?._id),
                                                        setCouponCode(coupon?.code),
                                                        // setDiscountType(coupon?.discountType),
                                                        setDiscountValue(coupon?.discountValue),
                                                        setNoOfItems(coupon?.noOfItems),
                                                        setExpDate(new Date(coupon?.expiryDate).toISOString().split('T')[0])
                                                    )}
                                                        className="px-4 py-2 w-full flex items-center gap-2 hover:bg-slate-100" title="Edit Coupon Details"
                                                    >
                                                        <MdEdit />Edit
                                                    </button>
                                                    <button 
                                                    onClick={() => (setDeleteCouponId(coupon?._id), setShowDeleteCouponModal(true))}
                                                    className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100" title="Delete Coupon"
                                                    >
                                                        <MdDelete />Delete
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </span>

                                    <h3 className="text-lg font-semibold italic font-serif tracking-wider group-hover:text-blue-600">
                                        {coupon.code}
                                    </h3>
                                    <div className="flex items-center gap-10">
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 font-semibold">Discount Type</span>
                                            <span className="font-semibold uppercase">'{coupon.discountType}'</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 font-semibold">Discount Value:</span>
                                            <span className="font-semibold">{coupon.discountValue}</span>
                                            <span className="text-gray-500 font-semibold">No Of Items:</span>
                                            <span className="font-semibold">{coupon?.noOfItems}</span>
                                            <span className="text-gray-500 font-semibold">Coupon Status:</span>
                                            <span className={`font-semibold ${coupon?.isActive ? 'text-green-500' : 'text-red-500'}`}>{coupon?.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 font-semibold">Coupon Expiry Date</span>
                                        <span className="text-sm font-medium flex gap-4">
                                            {moment(coupon.expiryDate).format("LLLL")}
                                            {
                                                (new Date() > new Date(coupon?.expiryDate)) ? (
                                                    <span className="text-red-500">Coupon has been expired !
                                                    </span>
                                                ) : (
                                                    <span>
                                                        <span className="text-green-500">Coupon is still valid</span>
                                                    </span>
                                                )
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))
                        )
                    }
                    </div>
                </div>
            </>
            )
        }

        {/* add new coupon modal */}
        <Modal isOpen={showCreateCouponModal} title="Create New Coupon" onClose={() => setShowCreateCouponModal(false)}>
            <form onSubmit={handleCouponFormSubmit}
            className="grid gap-2">
                <label htmlFor="code">Coupon Code</label>
                <input type="text" id="code" name='code'
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter coupon code" />

                <label htmlFor="disType">Discount Type</label>
                <select type="text" id="disType" name='disType'
                value={discountType} 
                onChange={(e) => setDiscountType(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500">
                    <option value="none">Select discount type</option>
                    <option value="Amount">Amount</option>
                    <option value="Percentage">Percentage</option>
                </select>

                <label htmlFor="disValue">Discount Value</label>
                <input type="text" id="disValue" name='disValue'
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter discount value" />

                <label htmlFor="noOfItems">No. of Items</label>
                <input type="text" id="noOfItems" name='noOfItems'
                value={noOfItems} 
                onChange={(e) => setNoOfItems(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter no. of items" />

                <label htmlFor="expDate">Code Expiry Date</label>
                <input type="date" id="expDate" name='expDate'
                value={expDate} 
                onChange={(e) => setExpDate(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter code expiry date" />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Add Code
                </button>
            </form>
        </Modal>

        {/* edit coupon modal  */}
        <Modal isOpen={showEditCouponModal} title="Edit Coupon Details"
        onClose={() => (setShowEditCouponModal(false), setCouponCode(""), setDiscountType(""), setDiscountValue(""), setNoOfItems(""), setExpDate(""))}>
            <form onSubmit={updateCouponDetails}
            className="grid gap-2">
                <label htmlFor="code">Coupon Code</label>
                <input type="text" id="code" name='code'
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter coupon code" />

                <label htmlFor="disType">Discount Type</label>
                <select type="text" id="disType" name='disType'
                value={discountType} 
                onChange={(e) => setDiscountType(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500">
                    <option value="none">Select discount type</option>
                    <option value="Amount">Amount</option>
                    <option value="Percentage">Percentage</option>
                </select>

                <label htmlFor="disValue">Discount Value</label>
                <input type="text" id="disValue" name='disValue'
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter discount value" />

                <label htmlFor="disValue">No. of Items</label>
                <input type="text" id="disValue" name='disValue'
                value={noOfItems} 
                onChange={(e) => setNoOfItems(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter no. of items" />

                <label htmlFor="coupStatus">Coupon Status</label>
                <select type="text" id="coupStatus" name='coupStatus'
                value={couponStatus} 
                onChange={(e) => setCouponStatus(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500">
                    <option value="none">Select coupon status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <label htmlFor="expDate">Code Expiry Date</label>
                <input type="date" id="expDate" name='expDate'
                value={expDate} 
                onChange={(e) => setExpDate(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border-2 focus-within:border-blue-500"
                placeholder="Enter code expiry date" />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Update
                </button>
            </form>
        </Modal>

        {/* delete coupon modal */}
        <Modal isOpen={showDeleteCouponModal} title="Confirm Delete Coupon" onClose={() => setShowDeleteCouponModal(false)}>
            <div className="grid gap-2">
                <p className="my-3">Are you sure you want to delete this coupon ?</p>

                <button
                onClick={() => handleDeleteCoupon()}
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

export default Coupon;