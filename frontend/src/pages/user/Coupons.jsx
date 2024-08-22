import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { toast } from "react-toastify";
import { getActiveCoupons } from '../../actions/requestProduct.actions.js';
import { MetaData } from "../../components/index.jsx";

function UserCoupons() {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchCoupons = async () => {
        setLoading(true);
        const response = await getActiveCoupons();
        if (response?.success) {
            setCoupons(response?.coupons);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCoupons();
    }, []);

    const { cartItems } = useSelector((state) => state.cart);
    const [noOfItemsReq, setNoOfItemsReq] = useState("");
    const handleApplyCoupon = () => {
        if (noOfItemsReq >= cartItems?.length) {
            console.log(noOfItemsReq)
            toast.error("You need to add more items in your cart to apply this coupon.");
            return;
        }
    }


    return (
    <>
    <MetaData title="Dashboard - My Coupons" />
    <div>
        <h2 className="text-xl font-semibold my-2">Available Coupons</h2>

        {
            loading ? (
                <div className="mt-2 flex flex-col gap-4">
                <p className="p-6 rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[80%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[80%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[60%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[30%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[40%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[70%] rounded-md bg-slate-200 animate-pulse"></p>
                <p className="p-4 w-[50%] rounded-md bg-slate-200 animate-pulse"></p>
            </div>
            ) : (
            <div>
            {
                (coupons?.length === 0) ? (
                    <p className="p-4 mt-4 text-lg font-semibold rounded-md bg-slate-200">No coupon found.</p>
                ) : (
                <ul className="flex flex-col gap-3 mt-2 max-h-[400px] overflow-y-auto hiddenScrollBar">
                    {
                    coupons?.map((coupon, index) => (
                        <li key={uuidv4()} className="group flex flex-col gap-2 bg-slate-50 rounded-md px-4 py-2 hover:bg-slate-100">
                            <p className="flex items-center justify-between">
                                <span className="text-lg font-semibold font-serif italic group-hover:text-blue-500">{coupon?.code}</span>
                                <span className="text-sm font-medium text-gray-500">Valid till {moment(coupon?.expiryDate).format("ll")}</span>
                            </p>
                            <p className="flex items-center justify-between">
                                <span className="text-green-500 font-medium">
                                    Get extra {coupon?.discountValue}% off on {coupon?.noOfItems} item(s) (price inclusive of cashback/coupon)
                                </span>
                                <span>
                                    <button
                                    // onClick={() => ( handleApplyCoupon(), setNoOfItemsReq(coupon?.noOfItems))}
                                    onClick={() => navigate(`/cart?coupon=${coupon?.code}&items=${coupon?.noOfItems}&discount=${coupon?.discountValue}`)}
                                    className="text-white bg-orange-500 hover:bg-orange-600 text-sm font-medium px-4 py-1 rounded-full"
                                    >Apply Coupon</button>
                                </span>
                            </p>
                        </li>
                    ))
                    }
                </ul>
                )
            }
            </div>
            )
        }
    </div>
    </>
    );
}

export default UserCoupons;