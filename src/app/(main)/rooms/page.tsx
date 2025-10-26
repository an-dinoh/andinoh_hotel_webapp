"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
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
      setRooms([]); // Set empty array on error
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600 mt-1">Manage your hotel rooms</p>
        </div>
        <Button
          text="Add Room"
          onClick={() => router.push("/rooms/create")}
          size="md"
          fullWidth={false}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002968] focus:border-transparent"
            />
          </div>

          {/* Filter by Type */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as RoomType | "all")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002968] focus:border-transparent appearance-none"
            >
              <option value="all">All Room Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
              <option value="family">Family</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms found</p>
            <Button
              text="Add Your First Room"
              onClick={() => router.push("/rooms/create")}
              size="md"
              fullWidth={false}
              variant="primary"
            />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} hover className="flex flex-col">
              {/* Room Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                <span className="text-4xl">🏨</span>
              </div>

              {/* Room Details */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{room.title}</h3>
                  <Badge variant={room.is_available ? "success" : "danger"}>
                    {room.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
                  {room.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{room.room_type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-medium">Bed:</span>
                    <span className="capitalize">{room.bed_type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-medium">Size:</span>
                    <span>{room.room_size} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-medium">Max:</span>
                    <span>{room.max_occupancy} guests</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#002968]">
                    ${room.base_price}
                  </span>
                  <span className="text-gray-600 text-sm"> / night</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={16} />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button
                    onClick={() => router.push(`/rooms/${room.id}/edit`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
