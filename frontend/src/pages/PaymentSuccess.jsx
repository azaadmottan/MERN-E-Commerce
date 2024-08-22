import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
// import successImage from "../assets/Transaction/success.png";
import successImage from "../assets/Transaction/success-check.gif";
import { MetaData } from "../components/index.jsx";

function PaymentSuccess() {
    const navigate = useNavigate();
    const { orderId, status } = useParams();
    if (!orderId && !status) {
        navigate(-1);
    }

    return (
    <>
    <MetaData title="Shopkart | Payment Success" />
    <div className="flex flex-col gap-2 items-center justify-center sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow rounded p-6 pb-12">
        <img draggable="false" className="w-2/2 h-60 rounded-md bg-slate-200" src={successImage} alt="Transaction Status" />
        <h1 className="text-2xl font-semibold tracking-wider">Transaction Successfull</h1>
        <p className="text-lg text-gray-500 text-center">
            Thank you for your purchase! Your transaction has been completed successfully.
            You can view your order details by clicking on the button below.
        </p>
        <Link to={"/user/dashboard/order"} className="bg-blue-600 hover:bg-blue-700 mt-2 py-2.5 px-6 text-white uppercase shadow hover:shadow-lg rounded-md">go to orders</Link>
    </div>
    </>
    )
}

export default PaymentSuccess;