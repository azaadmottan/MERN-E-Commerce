import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import {
    Home,
    Login,
    SignUp,
    UserDashboard,
    AdminDashboard,
    Payment,
    PaymentSuccess,
} from "../pages/index.jsx";
import {
    Profile,
    Category,
    Comment,
    Coupon,
    Order,
    Product,
    Review,
    Setting,
    User,
    EditProduct,
} from "../pages/admin/index.jsx";
import {
    UserCoupons,
    ManageAddress,
    UserOrder,
    UserSettings,
    UserProfile,
} from "../pages/user/index.jsx";
import {
    Cart,
    CategoryPage,
    ProductPage,
    SearchPage,
} from "../pages/home/index.jsx"


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: (
                    <Home />
                )
            },
            {
                path: "/login",
                element: (
                    <Login />
                ) 
            },
            {
                path: "/signUp",
                element: (
                    <SignUp />
                )
            },
            {
                path: "/category/:category/:id",
                element: (
                    <CategoryPage />
                )
            },
            {
                path: "/product/:productSlug/:productId",
                element: (
                    <ProductPage />
                )
            },
            {
                path: "/search",
                element: (
                    <SearchPage />
                )
            },
            {
                path: "/cart",
                element: (
                    <Cart />
                )
            },
            {
                path: "/payment/shop-pay/:orderId",
                element: (
                    <Payment />
                )
            },
            {
                path: "/payment/success/t/:orderId/:status",
                element: (
                    <PaymentSuccess />
                )
            },
            {
                path: "/user/dashboard",
                element: (
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "/user/dashboard/profile",
                        element: <UserProfile />
                    },
                    {
                        path: "/user/dashboard/manage-address",
                        element: <ManageAddress />
                    },
                    {
                        path: "/user/dashboard/order",
                        element: <UserOrder />
                    },
                    {
                        path: "/user/dashboard/my-coupon",
                        element: <UserCoupons />
                    },
                    {
                        path: "/user/dashboard/setting",
                        element: <UserSettings />
                    }

                ]
            },
            {
                path: "/admin/dashboard",
                element: (
                    <ProtectedRoute isAdmin={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "/admin/dashboard/profile",
                        element: <Profile />
                    },
                    {
                        path: "/admin/dashboard/category",
                        element: <Category />
                    },
                    {
                        path: "/admin/dashboard/comment",
                        element: <Comment />
                    },
                    {
                        path: "/admin/dashboard/coupon",
                        element: <Coupon />
                    },
                    {
                        path: "/admin/dashboard/order",
                        element: <Order />
                    },
                    {
                        path: "/admin/dashboard/payment",
                        element: <Payment />
                    },
                    {
                        path: "/admin/dashboard/product",
                        element: <Product />,
                    },
                    {
                        path: "/admin/dashboard/product/edit/:id",
                        element: <EditProduct />,
                    },
                    {
                        path: "/admin/dashboard/review",
                        element: <Review />
                    },
                    {
                        path: "/admin/dashboard/setting",
                        element: <Setting />
                    },
                    {
                        path: "/admin/dashboard/user",
                        element: <User />
                    }
                ]
            },
            
        ]
    },
]);

const Routes = () => {
    return (
        <RouterProvider router={router} />
    );
}

export default Routes;
