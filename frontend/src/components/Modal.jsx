import React from 'react'
import {
    IoClose,
} from "./Icons.jsx";
function Modal({ isOpen, title, children, onClose }) {
    if (!isOpen) {
        return;
    }

    return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-4 py-3 rounded-md shadow-lg max-w-lg w-full">

            <div className="text-2xl flex justify-between items-center py-2 mb-2 border-b-2">
                <h2 className="font-semibold">{title}</h2>
                <button onClick={onClose} className="font-bold text-gray-600 hover:text-black" title="Close Modal">
                    <IoClose />
                </button>
            </div>

            <div className="modal-content py-2 max-h-[70vh] overflow-y-auto hiddenScrollBar">
                {children}
            </div>
        </div>
    </div>
    </>
    );
}

export default Modal;