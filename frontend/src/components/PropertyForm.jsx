import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyForm = () => {
    const [propertyData, setPropertyData] = useState({
        // Location
        propertyName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        county: '',
        // Departments
        municipalBuildingAddress: '',
        buildingDepartmentContact: '',
        electricDepartmentContact: '',
        plumbingDepartmentContact: '',
        fireDepartmentContact: '',
        environmentalDepartmentContact: '',
        // Total Outlay To Date
        purchaseCost: '',
        refinanceCosts: '',
        totalRehabCost: '',
        kickStartFunds: '',
        lenderConstructionDrawsReceived: '',
        utilitiesCost: '',
        yearlyPropertyTaxes: '',
        mortgagePaid: '',
        homeownersInsurance: '',
        expectedYearlyRent: '',
        rentalIncomeReceived: '',
        vacancyLoss: '',
        managementFees: '',
        maintenanceCosts: '',
        totalEquity: '',
        // Sale Projection
        arvSalePrice: '',
        realtorFees: '',
        propTaxtillEndOfYear: '',
        lenderLoanBalance: '',
        payOffStatement: '',
        attorneyFees: '',
        miscFees: '',
        utilities: '',
        cash2closeFromPurchase: '',
        cash2closeFromRefinance: '',
        totalRehabCosts: '',
        expectedRemainingRentEndToYear: '',
        totalExpenses: '',
        totalConstructionDrawsReceived: '',
        projectNetProfitIfSold: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyData({ ...propertyData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(propertyData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
            <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">Property Details Form</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
                    <label className="block">
                        <span className="text-gray-700">Property Name:</span>
                        <input type="text" name="propertyName" value={propertyData.propertyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Address:</span>
                        <input type="text" name="address" value={propertyData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">City:</span>
                        <input type="text" name="city" value={propertyData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">State:</span>
                        <input type="text" name="state" value={propertyData.state} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Zip Code:</span>
                        <input type="text" name="zipCode" value={propertyData.zipCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">County:</span>
                        <input type="text" name="county" value={propertyData.county} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                </div>

                <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Departments:</h2>
                    <label className="block">
                        <span className="text-gray-700">Municipal Building Address:</span>
                        <input type="text" name="municipalBuildingAddress" value={propertyData.municipalBuildingAddress} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Building Dept:</span>
                        <input type="text" name="buildingDepartmentContact" value={propertyData.buildingDepartmentContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Electric Dept:</span>
                        <input type="text" name="electricDepartmentContact" value={propertyData.electricDepartmentContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Plumbing Dept:</span>
                        <input type="text" name="plumbingDepartmentContact" value={propertyData.plumbingDepartmentContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Fire Dept:</span>
                        <input type="text" name="fireDepartmentContact" value={propertyData.fireDepartmentContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Environmental Dept:</span>
                        <input type="text" name="environmentalDepartmentContact" value={propertyData.environmentalDepartmentContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                </div>

                <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Outlay To Date:</h2>
                    <label className="block">
                        <span className="text-gray-700">Purchase Cost:</span>
                        <input type="number" name="purchaseCost" value={propertyData.purchaseCost} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Refinance Costs:</span>
                        <input type="number" name="refinanceCosts" value={propertyData.refinanceCosts} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Total Rehab Cost:</span>
                        <input type="number" name="totalRehabCost" value={propertyData.totalRehabCost} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Kick Start Funds:</span>
                        <input type="number" name="kickStartFunds" value={propertyData.kickStartFunds} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Lender Construction Draws Received:</span>
                        <input type="number" name="lenderConstructionDrawsReceived" value={propertyData.lenderConstructionDrawsReceived} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Utilities Cost:</span>
                        <input type="number" name="utilitiesCost" value={propertyData.utilitiesCost} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Yearly Property Taxes:</span>
                        <input type="number" name="yearlyPropertyTaxes" value={propertyData.yearlyPropertyTaxes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Mortgage Paid:</span>
                        <input type="number" name="mortgagePaid" value={propertyData.mortgagePaid} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Homeowners Insurance:</span>
                        <input type="number" name="homeownersInsurance" value={propertyData.homeownersInsurance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Expected Yearly Rent:</span>
                        <input type="number" name="expectedYearlyRent" value={propertyData.expectedYearlyRent} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Rental Income Received:</span>
                        <input type="number" name="rentalIncomeReceived" value={propertyData.rentalIncomeReceived} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Vacancy Loss:</span>
                        <input type="number" name="vacancyLoss" value={propertyData.vacancyLoss} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Management Fees:</span>
                        <input type="number" name="managementFees" value={propertyData.managementFees} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Maintenance Costs:</span>
                        <input type="number" name="maintenanceCosts" value={propertyData.maintenanceCosts} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Total Equity:</span>
                        <input type="number" name="totalEquity" value={propertyData.totalEquity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                </div>

                <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Sale Projection</h2>
                    <label className="block">
                        <span className="text-gray-700">ARV Sale Price:</span>
                        <input type="number" name="arvSalePrice" value={propertyData.arvSalePrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Realtor Fees:</span>
                        <input type="number" name="realtorFees" value={propertyData.realtorFees} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Prop Tax till End of Year:</span>
                        <input type="number" name="propTaxtillEndOfYear" value={propertyData.propTaxtillEndOfYear} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Lender Loan Balance:</span>
                        <input type="number" name="lenderLoanBalance" value={propertyData.lenderLoanBalance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Pay Off Statement:</span>
                        <input type="number" name="payOffStatement" value={propertyData.payOffStatement} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Attorney Fees:</span>
                        <input type="number" name="attorneyFees" value={propertyData.attorneyFees} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Misc Fees:</span>
                        <input type="number" name="miscFees" value={propertyData.miscFees} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Utilities:</span>
                        <input type="number" name="utilities" value={propertyData.utilities} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Cash 2 Close from Purchase:</span>
                        <input type="number" name="cash2closeFromPurchase" value={propertyData.cash2closeFromPurchase} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Cash 2 Close from Refinance:</span>
                        <input type="number" name="cash2closeFromRefinance" value={propertyData.cash2closeFromRefinance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    {/* Add Kick Start Field Here */}
                    <label className="block">
                        <span className="text-gray-700">Total Rehab Costs:</span>
                        <input type="number" name="totalRehabCosts" value={propertyData.totalRehabCosts} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    {/* Add HomeOwners Insurance, Rental Income Paid Field Here */}
                    <label className="block">
                        <span className="text-gray-700">Expected Remaining Rent End To Year:</span>
                        <input type="number" name="expectedRemainingRentEndToYear" value={propertyData.expectedRemainingRentEndToYear} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    {/* Add Mortgage Paid Field Here */}
                    {/* Separation Line Here */}
                    <label className="block">
                        <span className="text-gray-700">Total Expenses:</span>
                        <input type="number" name="totalExpenses" value={propertyData.totalExpenses} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Total Construction Draws In:</span>
                        <input type="number" name="totalConstructionDrawsReceived" value={propertyData.totalConstructionDrawsReceived} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Project Net Profit If Sold:</span>
                        <input type="number" name="projectNetProfitIfSold" value={propertyData.projectNetProfitIfSold} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                </div>

                <button type="submit" className="md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Submit Property Details
                </button>
            </form>
        </div>
    );
};

export default PropertyForm;