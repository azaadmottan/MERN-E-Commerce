import React from 'react';
import { useParams } from 'react-router-dom';

function CategoryPage() {
    const { category } = useParams();

    return (
    <>
        {category}
    </>
    )
}

export default CategoryPage;