import React from 'react';

function Loading() {
    return (
    <>
    <div className=" min-h-[85vh] flex items-center justify-center">
        <span
            className=" h-20 w-20 mr-4 border-2 border-orange-600 rounded-full animate-spin border-t-transparent"
            viewBox="0 0 24 24"
        ></span>
    </div>
    </>
    );
}

export default Loading;