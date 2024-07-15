import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loading } from '../components';

const ProtectedRoute = ({ children, isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    return (
    <>
        {
            loading === true && (
                <Loading />
            )
        }
        {
            loading === false && (
                (isAuthenticated === false) ? ( navigate("/login") ) : ( (isAdmin) ? ( (!user.isAdmin) ? (navigate("/login")) : (children) ) : (children) )
            )
        }
    </>
    );

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
