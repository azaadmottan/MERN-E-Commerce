import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import {
    IoIosAdd,
    BsThreeDotsVertical,
    MdEdit,
    MdDelete,
    FaRegAddressCard,
} from "../../components/Icons.jsx";
import {
    MetaData,
    Modal,
    MiniLoading,
} from "../../components/index.jsx";
import moment from "moment";
import {
    addNewUserAddress,
    clearErrors,
    deleteUserAddress,
    updateUserAddress,
} from "../../actions/user.actions.js";

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address)

    const [showEditMenu, setShowEditMenu] = useState({});
    const toggleEditMenu = (id) => {
        setShowEditMenu(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false);
    const [updateAddressFormData, setUpdateAddressFormData] = useState({});

    const handleUpdateAddressOnChange = (e) => {
        setUpdateAddressFormData({
            ...updateAddressFormData,
            [e.target.name]: e.target.value,
        });
    }

    const submitUpdateAddressForm = async (e) => {
        e.preventDefault();

        if (!updateAddressFormData.phone || !updateAddressFormData.country || !updateAddressFormData.address || !updateAddressFormData.state || !updateAddressFormData.city || !updateAddressFormData.postalCode) {
            toast.error("All fields must be provided.");
            return;
        }

        dispatch(updateUserAddress(updateAddressFormData));

        if (address) {
            toast.success("Address updated successfully");
            setShowUpdateAddressModal(false);
            setUpdateAddressFormData({});
        }
        if (addressError) {
            toast.error(addressError);
            dispatch(clearErrors());
            return;
        }
    }

    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [addressFormData, setAddressFormData] = useState({});

    const handleAddressOnChange = (e) => {
        setAddressFormData({
            ...addressFormData,
            [e.target.name]: e.target.value,
        });
    }

    const submitAddAddressForm = async (e) => {
        e.preventDefault();

        if (!addressFormData.phone || !addressFormData.country || !addressFormData.address || !addressFormData.state || !addressFormData.city || !addressFormData.postalCode) {
            toast.error("All fields must be provided.");
            return;
        }

        dispatch(addNewUserAddress(addressFormData));

        if (address) {
            toast.success("New address added successfully");
            setShowAddAddressModal(false);
            setAddressFormData({});
        }

        if (addressError) {
            toast.error(addressError);
            dispatch(clearErrors());
            return;
        }
    }

    const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);
    const [deleteAddressId, setDeleteAddressId] = useState("");

    const handleDeleteAddress = async () => {
        dispatch(deleteUserAddress(deleteAddressId));

        if (address) {
            toast.success("Address deleted successfully");
            setShowDeleteAddressModal(false);
            setDeleteAddressId("");
        }
        if (addressError) {
            toast.error(addressError);
            setDeleteAddressId("");
            dispatch(clearErrors());
            return;
        }
    }

    return (
    <>
    <MetaData title="Admin Dashboard - My Profile" />
    <div>
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-6">
            <div className="flex items-center justify-between">
                <div className="text-xl flex gap-3 items-center">
                    <span className="">
                        Full Name:
                    </span>
                    <span className="font-semibold ">
                        {user?.fullName || user?.fullName}
                    </span> 
                </div>
                <div className="text-xl flex gap-3 items-center">
                    <span>
                        Username:
                    </span>
                    <span className="font-semibold">
                        {user?.userName || user?.userName}
                    </span>
                </div>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Email Address:
                </span>
                <span className="font-semibold">
                    {user?.email || user?.email}
                </span>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Profile Last Updated:
                </span>
                <span className="font-semibold">
                    {moment(user?.updatedAt).format('LLLL') || moment(user?.updatedAt).format('LLLL')}
                </span>
            </div>
            <div className="text-xl flex gap-3 items-center">
                <span className="">
                    Account Created At:
                </span>
                <span className="font-semibold">
                    {moment(user?.createdAt).format('LLLL') || moment(user?.createdAt).format('LLLL')}
                </span>
            </div>
        </div>

        <h2 className="text-xl font-semibold mt-4">Address</h2>

        <div className="border border-slate-200 rounded-md p-6 mt-4 grid gap-2">
            {
                addressLoading ? (
                    <MiniLoading />
                ) : (
                    address?.map((address, index) => (
                        <div key={uuidv4()} className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <h3 className='flex items-center gap-2'>
                                    <FaRegAddressCard />
                                    Address {index + 1}
                                </h3>
                                <span 
                                className="text-lg cursor-pointer p-2 hover:bg-slate-100 rounded-full relative"
                                onClick={() => toggleEditMenu(index)}>
                                    <BsThreeDotsVertical />
                                    {
                                        showEditMenu[index] && (
                                            <div className="absolute -left-24 bg-white shadow-md text-nowrap rounded-md">
                                                <p className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100 overflow-hidden" title="Edit your address"
                                                onClick={() => (
                                                    setUpdateAddressFormData(address),
                                                    setShowUpdateAddressModal(true)
                                                )}
                                                >
                                                    <MdEdit />Edit
                                                </p>
                                                <p className="px-4 py-2 flex items-center gap-2 hover:bg-slate-100" title="Delete address"
                                                onClick={() => (
                                                    setDeleteAddressId(address?._id),
                                                    setShowDeleteAddressModal(true)
                                                )}>
                                                    <MdDelete />Delete
                                                </p>
                                            </div>
                                        )
                                    }
                                </span>
                            </div>

                            <div className="text-xl md:flex justify-between">
                                <p className="w-[50%] flex gap-2">
                                    <span>
                                        Phone: 
                                    </span>
                                    <span className="font-semibold">
                                        {address?.phone}
                                    </span> 
                                </p>
                                <p className="w-[50%] flex gap-2">
                                <span className="">
                                    Country: 
                                </span>
                                <span className="font-semibold">
                                    {address?.country}
                                </span> 
                                </p>
                            </div>

                            <div className="text-xl md:flex justify-between">
                                <p className="w-[50%] flex gap-2">
                                    <span className="">
                                        State: 
                                    </span>
                                    <span className="font-semibold">
                                        {address?.state}
                                    </span> 
                                </p>
                                <p className="w-[50%] flex gap-2">
                                    <span className="">
                                        City: 
                                    </span>
                                    <span className="font-semibold">
                                        {address?.city}
                                    </span> 
                                </p>
                            </div>

                            <div className="text-xl md:flex gap-2">
                                <span className="">
                                    Address: 
                                </span>
                                <span className="font-semibold">
                                    {address?.address}
                                </span> 
                            </div>

                            <div className="text-xl md:flex gap-2">
                                <span className="">
                                    Postal Code: 
                                </span>
                                <span className="font-semibold">
                                    {address?.postalCode}
                                </span> 
                            </div>

                            <span className=" my-2 border-b-2" />
                        </div>
                    ))
                )
            }

            <div className="mt-2">
                <button
                className="flex items-center gap-2 px-4 py-1 text-lg rounded-md text-white bg-blue-600 hover:bg-blue-700 "
                onClick={() => setShowAddAddressModal(true)}
                >
                    <IoIosAdd className="text-xl text-white" /> Add New Address
                </button>
            </div>
        </div>

        {/* add new address modal */}
        <Modal isOpen={showAddAddressModal} title="Add New Address" onClose={() => setShowAddAddressModal(false)}>
            <form onSubmit={submitAddAddressForm}
            className="grid gap-2">
                <label htmlFor="phone">Phone number</label>
                <input type="text" id="phone" name='phone'
                value={addressFormData.phone} 
                onChange={handleAddressOnChange} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter phone number" />

                <label htmlFor="country">Country</label>
                <input type="text" id="country" name='country' 
                value={addressFormData.country} 
                onChange={handleAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your country" />

                <label htmlFor="address">Address</label>
                <input type="text" id="address" name='address' 
                value={addressFormData.address} 
                onChange={handleAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your address" />

                <label htmlFor="state">State</label>
                <input type="text" id="state" name='state' 
                value={addressFormData.state} 
                onChange={handleAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your state" />

                <label htmlFor="city">City</label>
                <input type="text" id="city" name='city' 
                value={addressFormData.city} 
                onChange={handleAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your city" />

                <label htmlFor="pin">Postal Code</label>
                <input type="text" id="pin" name='postalCode' 
                value={addressFormData.postalCode} 
                onChange={handleAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your postal code" />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Add Address
                </button>
            </form>
        </Modal>
        
        {/* edit address modal */}
        <Modal isOpen={showUpdateAddressModal} title="Update Address" onClose={() => setShowUpdateAddressModal(false)}>
            <form onSubmit={submitUpdateAddressForm}
            className="grid gap-2">
                <label htmlFor="phone">Phone number</label>
                <input type="text" id="phone" name='phone'
                value={updateAddressFormData.phone} 
                onChange={handleUpdateAddressOnChange} 
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter phone number" />

                <label htmlFor="country">Country</label>
                <input type="text" id="country" name='country' 
                value={updateAddressFormData.country} 
                onChange={handleUpdateAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your country" />

                <label htmlFor="address">Address</label>
                <input type="text" id="address" name='address' 
                value={updateAddressFormData.address} 
                onChange={handleUpdateAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your address" />

                <label htmlFor="state">State</label>
                <input type="text" id="state" name='state' 
                value={updateAddressFormData.state} 
                onChange={handleUpdateAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your state" />

                <label htmlFor="city">City</label>
                <input type="text" id="city" name='city' 
                value={updateAddressFormData.city} 
                onChange={handleUpdateAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your city" />

                <label htmlFor="pin">Postal Code</label>
                <input type="text" id="pin" name='postalCode' 
                value={updateAddressFormData.postalCode} 
                onChange={handleUpdateAddressOnChange}
                className="outline-none px-2 py-1 bg-slate-100 rounded-md border focus-within:border-blue-500"
                placeholder="Enter your postal code" />

                <button
                type='submit'
                className="text-white p-2 rounded-md mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    Update Address
                </button>
            </form>
        </Modal>

        {/* delete address modal */}
        <Modal isOpen={showDeleteAddressModal} title="Delete Address" onClose={() => setShowDeleteAddressModal(false)}>
            <div className="grid gap-2">
                <p className="my-3">Are you sure you want to delete this address ?</p>

                <button
                onClick={() => handleDeleteAddress()}
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

export default Profile;