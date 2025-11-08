"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, Bookmark, MapPin, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import { hotelService } from "@/services/hotel.service";
import { Room, RoomType, BedType } from "@/types/hotel.types";

export default function RoomsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<RoomType | "all">("all");
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("newly_added");

  useEffect(() => {
    fetchRooms();
  }, [filterType]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const filters = filterType !== "all" ? { room_type: filterType } : {};
      const data = await hotelService.getRooms(filters);
      console.log('✅ Rooms response:', data);
      console.log('✅ Rooms type:', typeof data);
      console.log('✅ Is array?', Array.isArray(data));

      // Ensure data is an array
      const roomsArray = Array.isArray(data) ? data : [];
      setRooms(roomsArray);
    } catch (error) {
      console.error("Error fetching rooms:", error);

      // FOR UI DEVELOPMENT: Use mock data when API fails
      const mockRooms: Room[] = [
        {
          id: "1",
          title: "Deluxe Ocean View",
          description: "Skilled Front End Developer with 7 years of experience in crafting responsive and interactive user interfaces.",
          room_type: "deluxe",
          bed_type: "king",
          room_size: 450,
          max_occupancy: 2,
          max_adults: 2,
          max_children: 0,
          base_price: "500",
          is_available: true,
          has_balcony: true,
          has_sea_view: true,
          has_city_view: false,
          total_rooms: 5,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Presidential Suite",
          description: "Luxury suite with panoramic views and premium amenities for the discerning traveler.",
          room_type: "presidential",
          bed_type: "king",
          room_size: 800,
          max_occupancy: 4,
          max_adults: 3,
          max_children: 1,
          base_price: "1200",
          is_available: true,
          has_balcony: true,
          has_sea_view: true,
          has_city_view: true,
          total_rooms: 2,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Standard Room",
          description: "Comfortable and affordable accommodation perfect for business or leisure travelers.",
          room_type: "standard",
          bed_type: "queen",
          room_size: 300,
          max_occupancy: 2,
          max_adults: 2,
          max_children: 0,
          base_price: "200",
          is_available: false,
          has_balcony: false,
          has_sea_view: false,
          has_city_view: true,
          total_rooms: 10,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setRooms(mockRooms);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await hotelService.deleteRoom(id);
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading rooms..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#0B0A07]">Rooms</h1>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="relative flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort By</span>
            <ChevronDown size={16} className="text-gray-600" />

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Select Multiple Option
                </div>
                <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "newly_added"}
                    onChange={() => setSortBy("newly_added")}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Newly Added</span>
                </label>
                <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "highest_ratings"}
                    onChange={() => setSortBy("highest_ratings")}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Highest Ratings</span>
                </label>
                <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "available_now"}
                    onChange={() => setSortBy("available_now")}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Available Now</span>
                </label>
                <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price_high_low"}
                    onChange={() => setSortBy("price_high_low")}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Price: High - Low</span>
                </label>
                <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price_low_high"}
                    onChange={() => setSortBy("price_low_high")}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Price: Low - High</span>
                </label>
                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Advanced Filter →
                  </button>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
              activeTab === "saved"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Saved Rooms (0)
          </button>
        </div>

        {/* Room Type Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Services</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("standard")}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === "standard"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setFilterType("deluxe")}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === "deluxe"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Deluxe
            </button>
            <button
              onClick={() => setFilterType("suite")}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === "suite"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Suite
            </button>
            <button
              onClick={() => setFilterType("presidential")}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === "presidential"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Presidential
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">No rooms found</p>
            <button
              onClick={() => router.push("/rooms/create")}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Room
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Room Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                    <span className="text-6xl">🏨</span>
                    {/* Bookmark Icon */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <Bookmark size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Room Content */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-3">
                      {room.room_type}
                    </span>

                    {/* Room Title */}
                    <h3 className="text-lg font-bold text-[#0B0A07] mb-2">
                      {room.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Price & Availability */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Rate: </span>
                        <span className="text-xl font-bold text-green-600">
                          ${room.base_price}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          room.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.is_available ? "Available Now" : "Booked"}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-4"></div>

                    {/* About Creator (Hotel Info) */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">About Room</p>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🛏️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#0B0A07] truncate">
                              {room.bed_type}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-orange-400 fill-orange-400" />
                              <span className="text-sm font-semibold text-[#0B0A07]">
                                4.5
                              </span>
                              <span className="text-xs text-gray-500">(50+)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 mt-1">
                            <MapPin size={12} />
                            <span className="text-xs truncate">
                              Max {room.max_occupancy} guests, {room.room_size} sq ft
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronDown size={20} className="rotate-90 text-gray-600" />
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors">
                3
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors">
                4
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors">
                24
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronDown size={20} className="-rotate-90 text-gray-600" />
              </button>
            </div>

            {/* Showing count */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing 1-{Math.min(10, filteredRooms.length)} of {filteredRooms.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
