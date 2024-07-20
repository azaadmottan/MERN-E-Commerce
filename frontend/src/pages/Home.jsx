import React, { useState, useEffect } from 'react';
import {
    Banner,
    Category,
    Product,
    HorizontalCardSlider,
    VerticalCardSlider,
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

        {/* sliders */}
        <HorizontalCardSlider category={"watch"} heading={"Top Smart Watches"} />

        <HorizontalCardSlider category={"earphone"} heading={"Popular Earphones"} />

        <HorizontalCardSlider category={"camera"} heading={"High Quality Cameras"} />

        <HorizontalCardSlider category={"airpode"} heading={"Popular Airpodes"} />

        <VerticalCardSlider category={"mobile"} heading={"Best Selling Mobile Phones"} />

        <VerticalCardSlider category={"tv"} heading={"High Quality Tv's & LED's"} />

        <VerticalCardSlider category={"processor"} heading={"High Performance System CPU's"} />

        <VerticalCardSlider category={"mouse"} heading={"Productive Mouse"} />
    </div>
    </>
    )
}

export default Home;