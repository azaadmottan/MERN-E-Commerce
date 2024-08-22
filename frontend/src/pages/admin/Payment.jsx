import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { getAllPayments } from '../../actions/requestProduct.actions.js';
import covertNumberToINR from "../../handler/NumberToINR.js";
import { MetaData } from "../../components/index.jsx";

function UserPayment() {
    const navigate = useNavigate();
    const [payments, setPayment] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchPayments = async () => {
        setLoading(true);
        const response = await getAllPayments();

        if (response?.success) {
            setPayment(response?.payments);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPayments();
    }, []);

    const loadingElements = new Array(10).fill(null);

    return (
    <div>
        <MetaData title="Admin Dashboard - User Payment" />
        <h1 className="text-xl font-semibold">User Orders</h1>
        <table className="table-fixed w-full mt-4 overflow-x-auto bg-slate-50 rounded-md">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th scope="col" className="p-2">Payment ID</th>
                    <th scope="col" className="p-2">User ID</th>
                    <th scope="col" className="p-2">Amount</th>
                    <th scope="col" className="p-2">Created At</th>
                    <th scope="col" className="p-2">Payment Status</th>
                </tr>
            </thead>
            <tbody>
            {
                loading ? (
                    loadingElements.map((_, index) => (
                        <tr key={index}
                        className="border-b my-4">
                            <td className="p-4"></td>
                        </tr>
                        ))
                ) : (
                    payments.map((payment) => (
                        <tr
                        onClick={() => navigate(`/admin/dashboard/user-payment/${payment?._id}`)}
                        key={uuidv4()} className="text-center text-sm border-b hover:bg-slate-200 cursor-pointer">
                            <td className="truncate p-2">{payment?._id}</td>
                            <td className="truncate p-2">{payment?.user}</td>
                            <td className="p-2 text-green-500 font-bold">{covertNumberToINR(payment?.amount)}</td>
                            <td className="p-2">{moment(payment?.createdAt).format('LLL')}</td>
                            <td className="p-2"><span className="px-4 rounded-full font-medium text-white bg-orange-400 border-2 border-orange-600">{payment?.status}</span></td>
                        </tr>
                    ))
                )
            }
            </tbody>
        </table>
    </div>
    )
}

export default UserPayment;