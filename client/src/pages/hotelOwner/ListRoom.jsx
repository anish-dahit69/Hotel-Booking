import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const { axios, getToken, user, currency } = useAppContext();

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchRooms();
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4 max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-center">Price / night</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item) => (
              <tr key={item._id}>
                <td className="py-3 px-4 border-t">{item.roomType}</td>

                <td className="py-3 px-4 border-t max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>

                <td className="py-3 px-4 border-t text-center">
                  {currency}
                  {item.pricePerNight}
                </td>

                <td className="py-3 px-4 border-t text-center">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item._id)}
                    />

                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition">
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
