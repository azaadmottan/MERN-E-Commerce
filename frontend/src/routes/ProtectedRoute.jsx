import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loading } from '../components';

const ProtectedRoute = ({ children, isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    // return (
    // <>
    //     {
    //         loading === true && (
    //             <Loading />
    //         )
    //     }
    //     {
    //         loading === false && (
    //             (isAuthenticated === false) ? ( navigate("/login") ) : ( (isAdmin) ? ( (!user.isAdmin) ? (navigate("/login")) : (children) ) : (children) )
    //         )
    //     }
    // </>
    // );

    useEffect(() => {
        // If not authenticated, redirect to login page
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }

        // If authenticated but not an admin when an admin is required, redirect to login page
        if (!loading && isAuthenticated && isAdmin && !user?.isAdmin) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, user, isAdmin, navigate]);

    // Render the loading component if loading, or the child components if authenticated
    if (loading) {
        return <Loading />;
    }

    // If user is authenticated and (if required) an admin, render children components
    if (isAuthenticated && (!isAdmin || (isAdmin && user?.isAdmin))) {
        return children;
    }

    // Render null or a fallback UI in case the above conditions don't match (though they should all be handled)
    return null;

    // useEffect(() => {
    //     if (!loading) {
    //         if (!isAuthenticated) {
    //             navigate("/login", { state: { from: location }, replace: true });
    //         } else if (isAdmin && user && !user.isAdmin) {
    //             navigate("/", { replace: true });
    //         }
    //     }
    // }, [loading, isAuthenticated, isAdmin, user, navigate, location]);

    // if (loading) {
    //     return <Loading />;
    // }

    // if (isAuthenticated && (!isAdmin || (isAdmin && user?.isAdmin))) {
    //     return <>{children}</>;
    // }

    // return null;
};

export default ProtectedRoute;
