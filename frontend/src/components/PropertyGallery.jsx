/* eslint-disable react/prop-types */
/* Insert Real Property Examples When Needed */
import LogoIcon from "../assets/icons/logo.svg";

const Property = ({ name, description, image }) => {
  return (
    <div className="property bg-white border border-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center">
      <img src={image} alt={name} className="mb-3 w-16 h-16" />
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const PropertyGallery = () => {
  const properties = [
    {
      name: "Modern Apartment",
      description: "City Center, 3BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Cozy Cottage",
      description: "Suburban Retreat, 2BR/1.5BA",
      image: LogoIcon,
    },
    {
      name: "Beachfront Villa",
      description: "Ocean View, 5BR/3BA",
      image: LogoIcon,
    },
    {
      name: "Urban Loft",
      description: "Downtown Living, 2BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Mountain Chalet",
      description: "Alpine Escape, 4BR/2BA",
      image: LogoIcon,
    },
    {
      name: "Rustic Cabin",
      description: "Secluded Hideaway, 2BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Luxury Penthouse",
      description: "City Skyline Views, 5BR/2.5BA",
      image: LogoIcon,
    },
    {
      name: "Lakefront Retreat",
      description: "Tranquil Waterside Living, 4BR/3BA",
      image: LogoIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <Property key={index} {...property} />
      ))}
    </div>
  );
};

export default PropertyGallery;
