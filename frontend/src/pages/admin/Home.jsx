import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto'
import { Doughnut, Line, Pie, Bar } from "react-chartjs-2";
import {
    getAdminCategories,
    getAdminProducts,
    getAllOrders,
    getAllUsers
} from "../../actions/requestProduct.actions.js";
import convertNumberToINR from "../../handler/NumberToINR.js";
import { MetaData } from "../../components/index.jsx";

function Home() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        const productResponse = await getAdminProducts();
        if (productResponse?.success) {
            setProducts(productResponse?.products);
        }
        const orderResponse = await getAllOrders();
        if (orderResponse?.success) {
            setOrders(orderResponse?.orders);
        }
        const categoryResponse = await getAdminCategories();
        if (categoryResponse?.success) {
            setCategories(categoryResponse?.categories);
        }
        const userResponse = await getAllUsers();
        if (userResponse?.success) {
            setUsers(userResponse?.users);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    let outOfStock = 0;
    products?.forEach((item) => {
        if (item?.countInStock === 0) {
            outOfStock += 1;
        }
    });

    let noOfOrders = 0;
    orders?.map((order) => (
        !order?.isCancelled && (noOfOrders += 1)
    ))

    let totalAmount = orders?.reduce((total, order) => !order?.isCancelled ? (total + order.totalPrice) : total, 0);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const date = new Date();
    const lineState = {
        labels: months,
        datasets: [
            {
                label: `Sales in ${date.getFullYear() - 2}`,
                borderColor: '#8A39E1',
                backgroundColor: '#8A39E1',
                data: months.map((m, i) => orders?.filter((od) => !od?.isCancelled && new Date(od?.createdAt).getMonth() === i && new Date(od?.createdAt).getFullYear() === date.getFullYear() - 2).reduce((total, od) => total + od?.totalPrice, 0)),
            },
            {
                label: `Sales in ${date.getFullYear() - 1}`,
                borderColor: 'orange',
                backgroundColor: 'orange',
                data: months.map((m, i) => orders?.filter((od) => !od?.isCancelled && new Date(od?.createdAt).getMonth() === i && new Date(od?.createdAt).getFullYear() === date.getFullYear() - 1).reduce((total, od) => total + od?.totalPrice, 0)),
            },
            {
                label: `Sales in ${date.getFullYear()}`,
                borderColor: '#00ff00',
                backgroundColor: '#00ff24',
                data: months.map((m, i) => orders?.filter((od) => !od?.isCancelled && new Date(od?.createdAt).getMonth() === i && new Date(od?.createdAt).getFullYear() === date.getFullYear()).reduce((total, od) => total + od?.totalPrice, 0)),
            },
        ],
    };

    const userLineState = {
        labels: months,
        datasets: [
            {
                label: `Users in ${date.getFullYear() - 2}`,
                borderColor: '#9333ea',
                backgroundColor: '#9333ea',
                data: months.map((m, i) => users?.filter((user) => new Date(user?.createdAt).getMonth() === i && new Date(user?.createdAt).getFullYear() === date.getFullYear() - 2).length),
            },
            {
                label: `Users in ${date.getFullYear() - 1}`,
                borderColor: '#facc15',
                backgroundColor: '#facc15',
                data: months.map((m, i) => users?.filter((user) => new Date(user?.createdAt).getMonth() === i && new Date(user?.createdAt).getFullYear() === date.getFullYear() - 1).length),
            },
            {
                label: `Users in ${date.getFullYear()}`,
                borderColor: '#00ff00',
                backgroundColor: '#00ff24',
                data: months.map((m, i) => users?.filter((user) => new Date(user?.createdAt).getMonth() === i && new Date(user?.createdAt).getFullYear() === date.getFullYear()).length),
            }
        ],
    }

    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const pieState = {
        labels: statuses,
        datasets: [
            {
                backgroundColor: ['#0000ff', '#ff0066', '#ffff00', '#00ff00',  '#ff3300'],
                hoverBackgroundColor: ['#0033cc', '#e6005c', '#e6e600', '#00cc00', '#e62e00'],
                data: statuses.map((status) => orders?.filter((item) => item?.status === status).length),
            },
        ],
    };

    const doughnutState = {
        labels: ['Out of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['#ff3300', '#33ff33'],
                hoverBackgroundColor: ['#dc2600', '#00e600'],
                data: [outOfStock, products.length - outOfStock],
            },
        ],
    };

    const barState = {
        labels: categories?.map((cat) => cat?.name),
        datasets: [
            {
                label: "Products",
                borderColor: '#9333ea',
                borderRadius: 4,
                backgroundColor: '#9333ea',
                hoverBackgroundColor: '#6b21a8',
                data: categories.map((cat) => products?.filter((item) => item?.category === cat?.name).length),
            },
        ],
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateMonthlyData = (year) => {
        return months.map((m, i) => {
            const daysInMonth = getDaysInMonth(i, year);
            return Array.from({ length: daysInMonth }, (_, day) => {
                const dayOrders = orders?.filter((od) => 
                    !od?.isCancelled &&
                    new Date(od?.createdAt).getFullYear() === year &&
                    new Date(od?.createdAt).getMonth() === i &&
                    new Date(od?.createdAt).getDate() === day + 1
                );
                const totalSales = dayOrders?.reduce((total, od) => total + od?.totalPrice, 0);
                return totalSales || 0;
            });
        }).flat();
    };

    const dailySalesLineState = {
        labels: Array.from({ length: 12 }, (_, i) => 
            Array.from({ length: getDaysInMonth(i, date.getFullYear()) }, (_, day) => `${months[i]} ${day + 1}`)
        ).flat(),
        datasets: [
            {
                label: `Sales in ${date.getFullYear() - 2}`,
                borderColor: '#8A39E1',
                backgroundColor: '#8A39E1',
                data: generateMonthlyData(date.getFullYear() - 2),
            },
            {
                label: `Sales in ${date.getFullYear() - 1}`,
                borderColor: 'orange',
                backgroundColor: 'orange',
                data: generateMonthlyData(date.getFullYear() - 1),
            },
            {
                label: `Sales in ${date.getFullYear()}`,
                borderColor: '#00ff00',
                backgroundColor: '#00ff24',
                data: generateMonthlyData(date.getFullYear()),
            },
        ],
    };

    return (
    <>
    <MetaData title="Admin Dashboard | Shopkart | India" />
    <h2 className="text-lg lg:text-xl font-semibold my-2">
        Revenue, Order, Products, Categories & User Details
    </h2>
    <div className="mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            <div className="flex flex-col bg-purple-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl px-4 py-6 lg:p-6">
                <h4 className="text-sm lg:text-base text-gray-100 font-medium">Total Sales Amount</h4>
                <h2 className="text-lg lg:text-2xl text-wrap font-bold tracking-wide">
                {
                    convertNumberToINR(totalAmount)
                }
                </h2>
            </div>
            <div className="flex flex-col bg-red-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl px-4 py-6 lg:p-6">
                <h4 className="text-sm lg:text-base text-gray-100 font-medium">Total Orders</h4>
                <h2 className="text-lg lg:text-2xl font-bold">
                {
                    noOfOrders
                }
                </h2>
            </div>
            <div className="flex flex-col bg-yellow-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl px-4 py-6 lg:p-6">
                <h4 className="text-sm lg:text-base text-gray-100 font-medium">Total Products</h4>
                <h2 className="text-lg lg:text-2xl font-bold">
                {
                    products?.length
                }
                </h2>
            </div>
            <div className="flex flex-col bg-green-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl px-4 py-6 lg:p-6">
                <h4 className="text-sm lg:text-base text-gray-100 font-medium">Total Users</h4>
                <h2 className="text-lg lg:text-2xl font-bold">
                {
                    users?.length
                }
                </h2>
            </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row justify-between gap-3 lg:gap-8 min-w-full">
            <div className="bg-white rounded-xl h-auto w-full shadow-md p-2 hover:shadow-lg">
                <Line 
                data={lineState}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Monthly Revenue & Cost",
                            align: "start",
                            cursor: "crosshair",
                            font: { size: 18, weight: "bold" }
                        }
                    }
                }}
                />
            </div>
            <div className="h-[18rem] lg:h-auto">
                <div className="bg-white rounded-xl h-full w-full flex flex-row lg:flex-col shadow-md p-4 text-center hover:shadow-lg">
                    <span className="font-medium uppercase text-gray-800">Order Status</span>
                    <Pie data={pieState} />
                </div>
            </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row justify-between gap-3 lg:gap-8 min-w-full">
            <div className="bg-white rounded-xl h-auto w-full shadow-md p-2 hover:shadow-lg">
                <Bar
                data={barState}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Resource Quantity",
                            align: "start",
                            font: { size: 18, weight: "bold" }
                        }
                    }
                }}
                />
            </div>
            <div className="h-[18rem] lg:h-auto">
                <div className="bg-white rounded-xl h-full w-full flex flex-row lg:flex-col shadow-md p-4 text-center hover:shadow-lg">
                    <span className="font-medium uppercase text-gray-800">Stock Status</span>
                    <Doughnut data={doughnutState} />
                </div>
            </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row justify-between gap-3 lg:gap-8 min-w-full">
            <div className="bg-white rounded-xl h-full w-full shadow-lg p-2 hover:shadow-xl">
                <Line 
                data={userLineState}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Monthly Registered Users",
                            align: "start",
                            font: { size: 18, weight: "bold" }
                        }
                    }
                }}
                />
            </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row justify-between gap-3 lg:gap-8 min-w-full">
            <div className="bg-white rounded-xl h-full w-full shadow-lg p-2 hover:shadow-xl">
                <Line 
                    data={dailySalesLineState}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Daily Sales Over the Last 3 Years',
                                align: 'start',
                                font: { size: 18, weight: 'bold' }
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                            legend: {
                                position: 'top',
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Total Sales (₹)',
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </div>
    </div>
    </>
    );
}

export default Home;