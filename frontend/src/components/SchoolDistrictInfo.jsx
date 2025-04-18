import { useState, useEffect } from 'react';
import { School, GraduationCap, MapPin, Users } from 'lucide-react';

const SchoolDistrictInfo = ({ property }) => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/schools/nearby?lat=${property.latitude}&lng=${property.longitude}&radius=2&limit=5`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch school data');
        }

        const data = await response.json();
        setSchools(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (property?.latitude && property?.longitude) {
      fetchSchools();
    }
  }, [property]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-700">
        <p>Unable to load school information: {error}</p>
      </div>
    );
  }

  if (!schools.length) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700">
        <p>No school information available for this location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <School className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Nearby Schools</h3>
      </div>
      
      <div className="grid gap-4">
        {schools.map((school) => (
          <div
            key={school.name}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{school.name}</h4>
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{school.city}, {school.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{school.school_type}</span>
                  </div>
                  {school.student_count && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{school.student_count.toLocaleString()} students</span>
                    </div>
                  )}
                </div>
              </div>
              {school.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-900">
                    {school.rating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(school.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolDistrictInfo; 