"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Eye, ChevronDown, Bookmark, MapPin, Star, Bed, Users, Maximize2, Sparkles, Image as ImageIcon, Video, MessageSquare, Box, Key, DollarSign } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { Room, RoomType } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import ErrorState from "@/components/ui/ErrorState";
import PhysicalRoomList from "@/components/rooms/PhysicalRoomList";
import PricingRulesList from "@/components/rooms/PricingRulesList";

type RoomDetailTab = "pictures" | "videos" | "reviews" | "3d-tour" | "units" | "pricing";

interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  avgRate: number | null;
}

const PAGE_SIZE = 12;

export default function RoomsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomStats, setRoomStats] = useState<RoomStats>({ total: 0, available: 0, occupied: 0, avgRate: null });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<RoomType | "all">("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("newly_added");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<RoomDetailTab>("pictures");
  const [error, setError] = useState<string | null>(null);

  // Fetch room stats from dashboard endpoint (single call, no room cards needed)
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await hotelService.getDashboardStats();
      if (stats.room_stats) {
        setRoomStats({
          total: stats.room_stats.total,
          available: stats.room_stats.available,
          occupied: stats.room_stats.occupied,
          avgRate: stats.performance?.adr || null,
        });
      }
    } catch (err) {
      console.error("Error fetching room stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [filterType, currentPage]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = { page: currentPage, page_size: PAGE_SIZE };
      if (filterType !== "all") filters.room_type = filterType;

      const response = await hotelService.getRooms(filters);
      const results = response.results || [];
      setRooms(results);
      setTotalCount(response.count ?? 0);

      // Update average rate from loaded page
      if (results.length > 0) {
        const validRates = results
          .map(r => parseFloat(r.base_price))
          .filter(p => !isNaN(p));

        if (validRates.length > 0) {
          const avg = Math.round(validRates.reduce((sum, p) => sum + p, 0) / validRates.length);
          setRoomStats(prev => ({ ...prev, avgRate: avg }));
        }
      }
    } catch (err: any) {
      console.error("Error fetching rooms:", err);
      setError(err.message || "Failed to fetch rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (!searchTerm) return true;
    return (
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading rooms..." />
      </div>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-white">
        <ErrorState
          title="Couldn't load rooms"
          message={error}
          onRetry={fetchRooms}
        />
      </div>
    );
  }

  if (selectedRoom) {
    const roomIndex = rooms.findIndex(r => r.id === selectedRoom.id);
    const roomNumber = `10${roomIndex + 1}`;

    return (
      <div className="h-full bg-white overflow-y-auto scrollbar-hide">
        <div className="h-full bg-[#F9FAFB] px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedRoom(null)}
              className="flex items-center gap-2 text-[#0F75BD] hover:text-[#0050C8] font-medium mb-4"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
              Back to Rooms
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">Room Details</h1>
              <p className="text-gray-500 text-sm">View and manage room information</p>
            </div>

            {/* Room Hero Section */}
            <div className="bg-white rounded-2xl border border-[#D3D9DD] overflow-hidden">
              <div className="bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-6xl">🏨</span>
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                          <span className="text-2xl font-bold text-white">Room {roomNumber}</span>
                        </div>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-3">{selectedRoom.title}</h2>
                      <p className="text-white/90 text-lg max-w-3xl">{selectedRoom.description}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-semibold ${selectedRoom.is_available
                      ? "bg-[#ECFDF5] text-green-700"
                      : "bg-[#FEE2E2] text-red-700"
                      }`}>
                      {selectedRoom.is_available ? "Available" : "Occupied"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-xl">
                      <Sparkles className="w-4 h-4" />
                      {selectedRoom.room_type?.toUpperCase() || "N/A"}
                    </span>
                    <div className="text-white">
                      <span className="text-3xl font-bold">₦{selectedRoom.base_price}</span>
                      <span className="text-white/80 ml-2">/night</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-[#E5E7EB] bg-white">
                <div className="flex gap-1 px-8 overflow-x-auto scrollbar-hide">
                  {[
                    { id: "pictures" as RoomDetailTab, label: "Pictures", icon: ImageIcon },
                    { id: "videos" as RoomDetailTab, label: "Videos", icon: Video },
                    { id: "reviews" as RoomDetailTab, label: "Reviews", icon: MessageSquare },
                    { id: "3d-tour" as RoomDetailTab, label: "3D Tour", icon: Box },
                    { id: "units" as RoomDetailTab, label: "Units (Physical Rooms)", icon: Key },
                    { id: "pricing" as RoomDetailTab, label: "Pricing Rules", icon: DollarSign },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${activeTab === tab.id
                          ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                          : "text-[#5C5B59] hover:text-[#0F75BD]"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-[#D3D9DD] p-8">
              {activeTab === "pictures" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Pictures</h3>
                    <p className="text-sm text-gray-500 mb-6">View and manage room images</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="relative h-64 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl overflow-hidden group cursor-pointer hover:border-[#0F75BD] transition-all">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-[#0F75BD]/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="font-semibold">Room View {i}</p>
                            <p className="text-sm text-white/80">Click to enlarge</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-[#0F75BD] font-semibold transition-all">
                    <Plus className="w-5 h-5" />
                    Upload More Pictures
                  </button>
                </div>
              )}

              {activeTab === "videos" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Videos</h3>
                    <p className="text-sm text-gray-500 mb-6">View and manage room tour videos</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative h-72 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl overflow-hidden group cursor-pointer hover:border-[#0F75BD] transition-all">
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Video className="w-16 h-16 text-[#0F75BD]/30" />
                          <div className="text-center">
                            <p className="font-semibold text-gray-800">Room Tour Video {i}</p>
                            <p className="text-sm text-gray-500">2:30 duration</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-[#0F75BD] font-semibold transition-all">
                    <Plus className="w-5 h-5" />
                    Upload Room Video
                  </button>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Reviews</h3>
                    <p className="text-sm text-gray-500 mb-6">View feedback from guests who stayed in this room</p>
                  </div>
                  <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">4.8</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-5 h-5 ${star <= 4 ? "fill-[#FBB81F] text-[#FBB81F]" : "text-gray-300"}`} />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">Based on 124 reviews</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: "John Doe", rating: 5, comment: "Amazing room! The view was spectacular and the amenities were top-notch.", date: "2 days ago" },
                        { name: "Sarah Johnson", rating: 4, comment: "Very comfortable stay. The bed was incredibly comfortable and staff was friendly.", date: "1 week ago" },
                        { name: "Michael Brown", rating: 5, comment: "Best room I've ever stayed in. Everything was perfect from start to finish.", date: "2 weeks ago" },
                      ].map((review, i) => (
                        <div key={i} className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#0F75BD] rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{review.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{review.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-[#FBB81F] text-[#FBB81F]" : "text-gray-300"}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-500">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "3d-tour" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">3D Virtual Tour</h3>
                    <p className="text-sm text-gray-500 mb-6">Experience the room in 360° virtual reality</p>
                  </div>
                  <div className="bg-[#F9FAFB] border-2 border-dashed border-[#D3D9DD] rounded-xl p-12 text-center">
                    <Box className="w-20 h-20 text-[#0F75BD] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive 3D Experience</h3>
                    <p className="text-gray-500 mb-6">Launch or upload a virtual tour for this room</p>
                    <div className="space-y-3 max-w-md mx-auto">
                      <button className="w-full px-6 py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors">
                        Launch 3D Tour
                      </button>
                      <button className="w-full px-6 py-3 bg-white border border-[#D3D9DD] text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                        Upload 3D Tour Link
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-6">Supported platforms: Matterport, Kuula, 360Cities</p>
                  </div>
                </div>
              )}

              {activeTab === "units" && (
                <PhysicalRoomList roomId={selectedRoom.id} />
              )}

              {activeTab === "pricing" && (
                <PricingRulesList roomTypeId={selectedRoom.id} />
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-8">
              {/* Basic Info */}
              <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                    <Bed className="w-6 h-6 text-[#0F75BD]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Room Details</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                    <span className="text-gray-500 text-sm font-medium">Bed Type</span>
                    <span className="font-semibold text-gray-800 capitalize">{selectedRoom.bed_type || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                    <span className="text-gray-500 text-sm font-medium">Room Size</span>
                    <span className="font-semibold text-gray-800">{selectedRoom.room_size} ft²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-medium">Max Occupancy</span>
                    <span className="font-semibold text-gray-800">{selectedRoom.max_occupancy} guests</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#F5F3FF] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#0F75BD]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
                </div>
                <div className="space-y-3">
                  {selectedRoom.has_sea_view && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl">
                      <div className="w-2 h-2 bg-[#0F75BD] rounded-full"></div>
                      <span className="text-sm font-medium text-[#0F75BD]">Sea View</span>
                    </div>
                  )}
                  {selectedRoom.has_city_view && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F3FF] border border-[#E9D5FF] rounded-xl">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">City View</span>
                    </div>
                  )}
                  {selectedRoom.has_balcony && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Balcony</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-700">Free WiFi</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0F75BD]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full py-3.5 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-all hover:shadow-lg flex items-center justify-center gap-2">
                    <span>Book Now</span>
                  </button>
                  <button className="w-full py-3.5 bg-white border border-[#D3D9DD] text-gray-800 font-semibold rounded-xl hover:bg-gray-50 hover:border-[#0F75BD] transition-all flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit Room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Rooms</h1>
            <p className="text-[#5C5B59] mt-1">Manage your hotel rooms and availability</p>
          </div>
          <button
            onClick={() => router.push("/rooms/create")}
            className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-regular rounded-2xl hover:bg-[#0050C8] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Room
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search rooms by name or description..."
              className="w-full pl-10 pr-3 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-[#D3D9DD] rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Image src="/icons/filter-search.svg" alt="Filter" width={20} height={20} />
              <span className="text-sm font-medium text-gray-800">Sort By</span>
              <ChevronDown className="w-4 h-4 text-[#8F8E8D]" />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl z-10 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-[#5C5B59] uppercase">
                  Sort Options
                </div>
                {[
                  { value: "newly_added", label: "Newly Added" },
                  { value: "price_high_low", label: "Price: High - Low" },
                  { value: "price_low_high", label: "Price: Low - High" },
                  { value: "available_now", label: "Available Now" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center px-4 py-2.5 hover:bg-[#FAFAFB] cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === option.value}
                      onChange={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className="mr-3 text-[#0F75BD] focus:ring-[#0F75BD]"
                    />
                    <span className="text-sm text-[#1A1A1A]">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Room Type Filters */}
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Filter by Room Type</h3>
          <div className="flex gap-3 flex-wrap overflow-x-auto scrollbar-hide pb-2">
            {[
              { value: "all", label: "All Rooms" },
              { value: "standard", label: "Standard" },
              { value: "deluxe", label: "Deluxe" },
              { value: "suite", label: "Suite" },
              { value: "presidential", label: "Presidential" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value as RoomType | "all")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filterType === type.value
                  ? "bg-[#0F75BD] text-white"
                  : "bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#E5E7EB]"
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Rooms", value: statsLoading ? "—" : roomStats.total, bg: "bg-[#F5F5F5]" },
            { label: "Available", value: statsLoading ? "—" : roomStats.available, bg: "bg-[#F0F9FF]" },
            { label: "Occupied", value: statsLoading ? "—" : roomStats.occupied, bg: "bg-[#FEF3C7]" },
            { label: "Average Rate", value: roomStats.avgRate != null ? `₦${roomStats.avgRate}` : "—", bg: "bg-[#F5F3FF]" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-2xl p-5`}>
              <p className="text-[#5C5B59] text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-16 text-center">
            <div className="w-20 h-20 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-[#0F75BD]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No rooms found</h3>
            <p className="text-[#5C5B59] mb-6">Start by adding your first room to the system</p>
            <button
              onClick={() => router.push("/rooms/create")}
              className="px-6 py-3 bg-[#0F75BD] text-white font-medium rounded-xl hover:bg-[#0050C8] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Room
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => {
                const roomNumber = `10${index + 1}`;

                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-[22px] overflow-hidden border border-[#E5E7EB] hover:border-[#0F75BD] transition-all group"
                  >
                    {/* Room Image */}
                    <div className="relative h-40 bg-[#E8F4F8] flex items-center justify-center overflow-hidden">
                      <span className="text-6xl">🏨</span>

                      {/* Room Number */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-[#0F75BD]">{roomNumber}</span>
                      </div>

                      {/* Room Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#0F75BD] text-xs font-medium rounded-lg">
                          <Sparkles className="w-3 h-3" />
                          {room.room_type.toUpperCase()}
                        </span>
                      </div>

                      {/* Availability Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${room.is_available
                            ? "bg-[#ECFDF5] text-green-700"
                            : "bg-[#FEE2E2] text-red-700"
                            }`}
                        >
                          {room.is_available ? "Available" : "Occupied"}
                        </span>
                      </div>
                    </div>

                    {/* Room Content */}
                    <div className="p-5">
                      {/* Room Title */}
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0F75BD] transition-colors">
                        {room.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[#5C5B59] mb-3 line-clamp-2">
                        {room.description}
                      </p>

                      {/* Room Details */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Bed className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A] capitalize">{room.bed_type}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Users className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">{room.max_occupancy}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Maximize2 className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">{room.room_size} ft²</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#E5E7EB] my-3"></div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#5C5B59] mb-0.5">Starting from</p>
                          <p className="text-xl font-bold text-[#0F75BD]">
                            ₦{room.base_price}
                            <span className="text-xs font-normal text-[#5C5B59]">/night</span>
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedRoom(room)}
                          className="px-4 py-2 bg-[#0F75BD] text-white text-sm font-medium rounded-xl hover:bg-[#0050C8] transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 m-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 rotate-90 text-[#5C5B59]" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${currentPage === page
                        ? "bg-[#0F75BD] text-white"
                        : "hover:bg-[#FAFAFB] text-[#1A1A1A]"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90 text-[#5C5B59]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
