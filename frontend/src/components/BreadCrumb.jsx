import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaAngleRight
} from "./Icons.jsx";

function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <nav>
            <ul className="text-sm lg:text-base flex items-center gap-2 text-blue-500 cursor-default">
                {
                    pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        return (
                            <li key={to}>
                                <span to={to} className="flex items-center gap-2 hover:text-red-500">
                                    {value}
                                    <FaAngleRight />
                                </span>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
}

export default Breadcrumb;
