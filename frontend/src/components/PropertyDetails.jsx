import React, { useState } from 'react';

const PropertyDetails = ({ propertyData, handleChange, handleSave }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        handleSave(); // This function should be passed down from the parent component
        setIsEditing(false);
    };

    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-1 w-11/12 md:w-full mx-auto">
            <div className="propLocation bg-gray-50 p-4 shadow-sm rounded-md w-11/12">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">Owner: {propertyData.ownership}</h1>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>

                <label className="block">
                    <span className="text-gray-700">Property Name:</span>
                    <input 
                        type="text" 
                        name="propertyName" 
                        value={propertyData.propertyName} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Address:</span>
                    <input 
                        type="text" 
                        name="address" 
                        value={propertyData.address} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">City:</span>
                    <input 
                        type="text" 
                        name="city" 
                        value={propertyData.city} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">State:</span>
                    <input 
                        type="text" 
                        name="state" 
                        value={propertyData.state} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Zip Code:</span>
                    <input 
                        type="text" 
                        name="zipCode" 
                        value={propertyData.zipCode} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">County:</span>
                    <input 
                        type="text" 
                        name="county" 
                        value={propertyData.county} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>
            </div>

            <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md w-11/12">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Departments</h2>

                <label className="block">
                    <span className="text-gray-700">Municipal Building Address:</span>
                    <input 
                        type="text" 
                        name="municipalBuildingAddress" 
                        value={propertyData.municipalBuildingAddress} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Building Dept:</span>
                    <input 
                        type="text" 
                        name="buildingDepartmentContact" 
                        value={propertyData.buildingDepartmentContact} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Electric Dept:</span>
                    <input 
                        type="text" 
                        name="electricDepartmentContact" 
                        value={propertyData.electricDepartmentContact} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Plumbing Dept:</span>
                    <input 
                        type="text" 
                        name="plumbingDepartmentContact" 
                        value={propertyData.plumbingDepartmentContact} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Fire Dept:</span>
                    <input 
                        type="text" 
                        name="fireDepartmentContact" 
                        value={propertyData.fireDepartmentContact} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Environmental Dept:</span>
                    <input 
                        type="text" 
                        name="environmentalDepartmentContact" 
                        value={propertyData.environmentalDepartmentContact} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </label>

                <div className="flex justify-between mt-4">
                    {!isEditing ? (
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleEdit}>
                            Edit
                        </button>
                    ) : (
                        <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSaveClick}>
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
