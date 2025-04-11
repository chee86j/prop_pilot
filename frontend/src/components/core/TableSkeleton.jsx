/*
This file is a loading placeholder for tables to provide visual feedback during data loading operations
 */
import PropTypes from "prop-types";

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse w-full overflow-hidden">
      {/* Header row */}
      <div className="flex border-b border-gray-200 pb-2 mb-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={`header-${colIndex}`} className="px-3 py-3 flex-1">
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          </div>
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex border-b border-gray-100 py-2"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="px-3 py-2 flex-1"
            >
              <div
                className={`h-4 bg-gray-100 rounded ${
                  colIndex === 0 ? "w-1/2" : "w-3/4"
                }`}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};

export default TableSkeleton;
