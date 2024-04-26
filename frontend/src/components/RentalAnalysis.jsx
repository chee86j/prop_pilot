const RentalAnalysis = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold leading-tight">Rental Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div>
          {/* COSTS */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">COSTS</h2>
            <div className="mb-2">
              <strong>Purchase Price:</strong> $450,000
            </div>
            <div className="mb-2">
              <strong>After repair value:</strong> $450,000
            </div>
            <div className="mb-2">
              <strong>Purchase closing costs:</strong> $26,000
            </div>
            <div>
              <strong>Repair cost:</strong> $0
            </div>
          </div>

          {/* FINANCING */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">FINANCING</h2>
            <div className="mb-2">
              <strong>Down payment %:</strong> 15.00%
            </div>
            <div className="mb-2">
              <strong>Loan interest rate %:</strong> 7.10%
            </div>
            <div className="mb-2">
              <strong>PMI %:</strong> 0.00%
            </div>
            <div className="mb-2">
              <strong>Mortgage (years):</strong> 30
            </div>
            <div className="mb-2">
              <strong>Lender points amount:</strong> $0.00
            </div>
            <div>
              <strong>Other fees:</strong> $0.00
            </div>
          </div>

          {/* REVENUE ASSUMPTIONS */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">REVENUE ASSUMPTIONS</h2>
            <div className="mb-2">
              <strong>Rent per unit:</strong> $2,900
            </div>
            <div className="mb-2">
              <strong>Num units:</strong> 1
            </div>
            <div className="mb-2">
              <strong>Vacancy rate %:</strong> 10.00%
            </div>
            <div className="mb-2">
              <strong>Avg Tenant stay (years):</strong> 2
            </div>
            <div>
              <strong>Other monthly income:</strong> $0
            </div>
          </div>

          {/* EXPENSES PER MONTH */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">EXPENSES PER MONTH</h2>
            <div className="mb-2">
              <strong>P&I (with PMI):</strong> $2,571
            </div>
            <div className="mb-2">
              <strong>Property taxes:</strong> $308
            </div>
            <div className="mb-2">
              <strong>Insurance:</strong> $95
            </div>
            <div className="mb-2">
              <strong>Capital expenditure %:</strong> 0.00%
            </div>
            <div className="mb-2">
              <strong>Property management %:</strong> 0%
            </div>
            <div className="mb-2">
              <strong>Sewer:</strong> $20
            </div>
            <div className="mb-2">
              <strong>Water:</strong> $20
            </div>
            <div className="mb-2">
              <strong>Lawn:</strong> $0
            </div>
            <div>
              <strong>Garbage:</strong> $80
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          {/* MONTHLY INCOME */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">MONTHLY INCOME</h2>
            <div>$2,900.00</div>
          </div>

          {/* MONTHLY EXPENSES */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">MONTHLY EXPENSES</h2>
            <div>$3,504.36</div>
          </div>

          {/* CASH FLOW */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">CASH FLOW</h2>
            <div className="text-red-500">-$604.36</div>
          </div>

          {/* CASH ROI */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">CASH ROI</h2>
            <div className="text-red-500">-7.76%</div>
          </div>

          {/* DOWN PAYMENT CASH OUTLAY */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">DOWN PAYMENT CASH OUTLAY</h2>
            <div>$93,500</div>
          </div>

          {/* NET OPERATING INCOME */}
          <div className="mb-6 border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">NET OPERATING INCOME</h2>
            <div>$23,594</div>
          </div>

          {/* COMPUTED VALUES */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">COMPUTED VALUES</h2>
            <div className="mb-2">
              <strong>Land Value:</strong> $112,500
            </div>
            <div className="mb-2">
              <strong>Building Value:</strong> $337,500
            </div>
            <div>
              <strong>Pro Forma Cap Rate:</strong> 7.73%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAnalysis;
