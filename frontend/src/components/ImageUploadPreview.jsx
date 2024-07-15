import React from 'react';
import {
    IoClose,
} from "./Icons.jsx";

function ImageUploadPreview() {
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prevImages) => [...prevImages, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));

        setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    return (
    <>
        <div>
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleImageChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
            />
            <div className="flex flex-wrap mt-5">
                {
                    imagePreviews.map((preview, index) => (
                        <div key={index} className="relative mt-5">
                            <img
                                src={preview}
                                alt={`preview-${index}`}
                                className="w-[100px] h-[100px] object-cover rounded-md"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
                            >
                                <IoClose />
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
    )
}

export default ImageUploadPreview;