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
} from "../pages/index.jsx";
import {
    Profile,
    Category,
    Comment,
    Coupon,
    Order,
    Payment,
    Product,
    Review,
    Setting,
    User,
    EditProduct,
} from "../pages/admin/index.jsx";
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
                path: "/user/dashboard",
                element: (
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                )
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
