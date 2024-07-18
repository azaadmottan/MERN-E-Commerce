import React, { useState, useEffect } from 'react';
import {
    Banner,
    Category,
    Product
} from '../components/home/index.jsx';

function Home() {

    return (
    <>
    <div className="container mx-auto px-2 py-4 flex flex-col gap-4">

        {/* categories */}
        <Category />

        {/* banner */}
        <Banner />

        {/* products */}
        <Product />

    </div>
    </>
    )
}

export default Home;