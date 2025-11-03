import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { assets, facilityIcons } from "../assets/assets";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };

      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType)
    );
  };

  const MatchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;

    return selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split(" to ").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  let filteredRooms = rooms.filter(
    (room) => matchesRoomType(room) && MatchesPriceRange(room)
  );

  if (selectedSort === "Price Low to High") {
    filteredRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (selectedSort === "Price High to Low") {
    filteredRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (selectedSort === "Newest First") {
    filteredRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="pt-28 md:pt-30 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Title Section */}
      <div className="mb-8">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2">
            Take advantage of our limited-time offers and special packages.
          </p>
        </div>
      </div>

      {/* Small screen filters */}
      <div className="lg:hidden bg-white border border-gray-300 text-gray-600 mb-8">
        <div className="flex items-center justify-between px-5 py-2.5 border-b">
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <span
            onClick={() => setOpenFilters(!openFilters)}
            className="text-xs cursor-pointer"
          >
            {openFilters ? "HIDE" : "SHOW"}
          </span>
        </div>

        {openFilters && (
          <div className="px-5">
            <p className="font-medium mt-4">Popular filters</p>
            {roomTypes.map((room) => (
              <CheckBox
                key={room}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomType")
                }
              />
            ))}

            <p className="font-medium mt-4">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={range}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}

            <p className="font-medium mt-4">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Rooms List */}
        <div className="flex-1">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b"
            >
              <img
                onClick={() => navigate(`/rooms/${room._id}`)}
                src={room.images[0]}
                alt="hotel"
                className="max-h-65 md:w rounded-xl shadow-lg object-cover cursor-pointer"
              />

              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel.city}</p>
                <p
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                  onClick={() => navigate(`/rooms/${room._id}`)}
                >
                  {room.hotel.name}
                </p>

                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>

                <p className="text-gray-500 flex items-center gap-1">
                  <img src={assets.locationIcon} alt="icon" />
                  {room.hotel.address}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 mb-6">
                  {room.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xl font-medium text-gray-700">
                  {currency} {room.pricePerNight} /night
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block bg-white w-80 border border-gray-300 h-fit mt-[-110px]">
          <div className="flex items-center justify-between px-5 py-2.5 border-b">
            <p className="text-base font-medium text-gray-800">FILTERS</p>
            <span className="text-xs cursor-pointer">CLEAR</span>
          </div>

          <div className="px-5 py-4">
            <p className="font-medium">Popular filters</p>
            {roomTypes.map((room) => (
              <CheckBox
                key={room}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomType")
                }
              />
            ))}

            <p className="font-medium mt-4">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={range}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}

            <p className="font-medium mt-4">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
