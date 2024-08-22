import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IoIosAdd,
    BsThreeDotsVertical,
    MdEdit,
    MdDelete,
} from "../../components/Icons.jsx";
import {
    MetaData,
    Modal,
    MiniLoading,
} from "../../components/index.jsx";
import { toast } from 'react-toastify';
import {
    PUBLIC_URL
} from "../../config/api.config.js"
import {
    addNewCategory,
    updateCategory,
    deleteCategory,
    clearErrors,
} from '../../actions/product.actions.js';

function Category() {
    const dispatch = useDispatch();
    const { category, loading, success, error } = useSelector((state) => state.category);

    const [showEditMenu, setShowEditMenu] = useState({});
    const toggleEditMenu = (id) => {
        setShowEditMenu(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState("true");
    const [categoryImage, setCategoryImage] = useState("");

    const submitAddCategoryForm = async (e) => {
        e.preventDefault();

        if (!name || !description || !isActive || !categoryImage) {
            toast.error("All fields must be provided");
            return;
        }

        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (!allowedImageTypes.includes(categoryImage?.type)) {
            toast.error("Invalid image format !");
            return;
        }

        const addCategoryFormData = {
            name,
            description,
            isActive,
            categoryImage,
        }

        // const response = await addCategory(addCategoryFormData);

        dispatch(addNewCategory(addCategoryFormData));

        if (category && !error) {
            toast.success("Category added successfully");
            setShowAddCategoryModal(false);
            setName("");
            setDescription("");
            setIsActive("true");
            setCategoryImage("");
        }

        if (error) {
            toast.error(error);
            return;
        }
    }

    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
    const [_id, set_id] = useState("");
    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedIsActive, setUpdatedIsActive] = useState("");
    const [updatedCategoryImage, setUpdatedCategoryImage] = useState("");

    // const [updateCategoryFormData, setUpdateAddressFormData] = useState({});

    const submitEditCategoryForm = async (e) => {
        e.preventDefault();

        if (!updatedName ||!updatedDescription ||!updatedIsActive ||!updatedCategoryImage) {
            toast.error("All fields must be provided");
            return;
        }

        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        // if (!allowedImageTypes.includes(updatedCategoryImage?.type)) {
        //     toast.error("Invalid image format!");
        //     return;
        // }

        const updateCategoryFormData = {
            _id,
            name: updatedName,
            description: updatedDescription,
            isActive: updatedIsActive,
            categoryImage: updatedCategoryImage,
        }

        dispatch(updateCategory(updateCategoryFormData));

        if (category && !error) {
            toast.success("Category updated successfully");
            setShowEditCategoryModal(false);
        }

        if (error) {
            toast.error(error);
            return;
        }
    }

    const [deleteCategoryId, setDeleteCategoryId] = useState("");
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [deleteCategoryStatus, setDeleteCategoryStatus] = useState(false);

    const handleDeleteCategory = async () => {
        dispatch(deleteCategory(deleteCategoryId));

        setDeleteCategoryStatus(true);
    }
    
    useEffect(() => {
        if (success && deleteCategoryStatus) {
            toast.success("Category deleted successfully");
            setShowDeleteCategoryModal(false);
            setDeleteCategoryId("");
            setDeleteCategoryStatus(false);
        }
    
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
            setDeleteCategoryStatus(false);
        }
    }, [category, dispatch, loading])
    

    return (
    <>
    <MetaData title="Admin Dashboard - Category" />
    <div>
        <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Category Information</h2>
        <button
        className="flex items-center gap-2 text-white rounded-md p-2 bg-blue-600 hover:bg-blue-700"
        onClick={() => setShowAddCategoryModal(true)}
        >
            <IoIosAdd className="text-xl text-white" />
            Add New Category
        </button>
        </div>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            {
                loading ? (
                    <MiniLoading />
                ) : (
                    category.map((category, index) => (
                        <div key={category._id} className="flex items-center gap-4 p-2">
                            <div className="w-52 h-48 border rounded-md overflow-hidden">
                                <img
                                src={`${PUBLIC_URL.PUBLIC_STATIC_URL}/` + (category?.categoryImage || 'productImages/sampleImage.jpg')}
                                alt={category.name}
                                className=" w-full h-full object-center rounded-md shadow-md hover:scale-110 transition-all"
                                />
                            </div>

                            <div className="w-3/4 h-48">
                                <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    {category.name}
                                    <span className="text-sm text-gray-500 bg-slate-100 hover:bg-slate-200 cursor-default rounded-md px-2 py-1">
                                        {category.isActive ? "Active" : "Disabled"}
                                    </span>
                                </h2>
                                
                                <span 
                                className="text-lg cursor-pointer p-2 hover:bg-slate-100 rounded-full relative"
                                onClick={() => toggleEditMenu(index)}>
                                    <BsThreeDotsVertical />
                                    {
                                        showEditMenu[index] && (
                                            <div className="absolute -left-24 bg-white shadow-md text-nowrap rounded-md overflow-hidden">
                                                <p className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100" title="Edit category"
                                                onClick={() => (
                                                    set_id(category._id),
                                                    setUpdatedName(category?.name),
                                                    setUpdatedDescription(category?.description),
                                                    setUpdatedIsActive(category?.isActive?.toString()),
                                                    setUpdatedCategoryImage(category?.categoryImage),
                                                    setShowEditCategoryModal(true)
                                                )}
                                                >
                                                    <MdEdit />Edit
                                                </p>
                                                <p className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100" title="Delete category"
                                                onClick={() => (
                                                    setDeleteCategoryId(category?._id),
                                                    setShowDeleteCategoryModal(true)
                                                )}>
                                                    <MdDelete />Delete
                                                </p>
                                            </div>
                                        )
                                    }
                                </span>
                                </div>
                                <p className="text-sm py-2 text-gray-500 text-ellipsis overflow-y-auto mt-4 h-32">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    ))
                )
            }
        </div>

        {/* add new category modal  */}
        <Modal isOpen={showAddCategoryModal} title="Add New Category" onClose={() => setShowAddCategoryModal(false)}>
            <form onSubmit={submitAddCategoryForm}
            className="grid gap-2">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name='name'
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter category name" />

                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name='description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter description here"></textarea>

                <label htmlFor="isActive">Is Active</label>
                <select id="isActive" name='isActive'
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <label htmlFor="categoryImage">Category Image</label>
                <input type="file" id="categoryImage" name='categoryImage' 
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Add Category
                </button>
            </form>
        </Modal>
        
        {/* edit category modal */}
        <Modal isOpen={showEditCategoryModal} title="Update Category" onClose={() => setShowEditCategoryModal(false)}>
            <form onSubmit={submitEditCategoryForm}
            className="grid gap-2">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name='name'
                value={updatedName} 
                onChange={(e) => setUpdatedName(e.target.value)} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter category name" />

                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name='description' 
                value={updatedDescription} 
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter description here"></textarea>

                <label htmlFor="isActive">Is Active</label>
                <select id="isActive" name='isActive'
                value={updatedIsActive}
                onChange={(e) => setUpdatedIsActive(e.target.value)}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <label htmlFor="categoryImage">Category Image</label>
                <input type="file" id="categoryImage" name='categoryImage' 
                // value={}
                onChange={(e) => setUpdatedCategoryImage(e.target.files[0])}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Update Category
                </button>
            </form>
        </Modal>

        {/* delete category modal */}
        <Modal isOpen={showDeleteCategoryModal} title="Delete Category" onClose={() => setShowDeleteCategoryModal(false)}>
            <div className="grid gap-2">
                <p className="my-3">Are you sure you want to delete this category ?</p>

                <button
                onClick={() => handleDeleteCategory()}
                className="text-white p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Confirm Delete
                </button>
            </div>
        </Modal>
    </div>
    </>
    )
}

export default Category;