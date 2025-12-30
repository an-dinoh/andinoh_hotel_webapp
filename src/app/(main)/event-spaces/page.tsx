"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, ChevronDown, Sparkles, Users, Maximize2, Calendar, Banknote, Zap, PartyPopper } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { EventSpace, EventSpaceType } from "@/types/hotel.types";

type EventSpaceDetailTab = "pictures" | "videos" | "reviews" | "3d-tour" | "equipment";

export default function EventSpacesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [eventSpaces, setEventSpaces] = useState<EventSpace[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<EventSpaceType | "all">("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("newly_added");
  const [selectedSpace, setSelectedSpace] = useState<EventSpace | null>(null);
  const [activeTab, setActiveTab] = useState<EventSpaceDetailTab>("pictures");

  useEffect(() => {
    fetchEventSpaces();
  }, [filterType]);

  const fetchEventSpaces = async () => {
    try {
      setLoading(true);

      // Mock data for UI development
      const mockSpaces: EventSpace[] = [
        {
          id: "1",
          title: "Grand Ballroom",
          description: "Elegant ballroom perfect for weddings, galas, and large corporate events. Features crystal chandeliers, high ceilings, and a built-in stage.",
          space_type: "ballroom",
          space_size: 5000,
          max_capacity_theater: 500,
          max_capacity_banquet: 350,
          max_capacity_cocktail: 600,
          min_capacity: 100,
          base_rate_per_hour: "500",
          base_rate_half_day: "2500",
          base_rate_full_day: "4500",
          weekend_rate_multiplier: 1.5,
          has_natural_light: false,
          has_audio_visual: true,
          has_stage: true,
          has_dance_floor: true,
          has_kitchen_access: true,
          has_outdoor_access: false,
          ceiling_height: 20,
          floor_level: "Ground Floor",
          is_available: true,
          total_spaces: 1,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Executive Boardroom",
          description: "Premium boardroom designed for high-level meetings and presentations. Equipped with state-of-the-art technology and comfortable seating.",
          space_type: "boardroom",
          space_size: 800,
          max_capacity_theater: 40,
          max_capacity_banquet: 24,
          max_capacity_cocktail: 50,
          min_capacity: 10,
          base_rate_per_hour: "150",
          base_rate_half_day: "600",
          base_rate_full_day: "1000",
          has_natural_light: true,
          has_audio_visual: true,
          has_stage: false,
          has_dance_floor: false,
          has_kitchen_access: false,
          has_outdoor_access: false,
          ceiling_height: 12,
          floor_level: "10th Floor",
          is_available: true,
          total_spaces: 2,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Rooftop Terrace",
          description: "Stunning outdoor venue with panoramic city views. Ideal for cocktail receptions, product launches, and intimate gatherings.",
          space_type: "rooftop_terrace",
          space_size: 3000,
          max_capacity_theater: 150,
          max_capacity_banquet: 100,
          max_capacity_cocktail: 200,
          min_capacity: 30,
          base_rate_per_hour: "400",
          base_rate_half_day: "2000",
          base_rate_full_day: "3500",
          weekend_rate_multiplier: 1.3,
          has_natural_light: true,
          has_audio_visual: true,
          has_stage: false,
          has_dance_floor: false,
          has_kitchen_access: true,
          has_outdoor_access: true,
          ceiling_height: 0,
          floor_level: "Rooftop",
          is_available: false,
          total_spaces: 1,
          hotel: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setEventSpaces(mockSpaces);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpaces = eventSpaces.filter((space) => {
    const matchesSearch = space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || space.space_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatSpaceType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading event spaces..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Event Spaces</h1>
            <p className="text-[#5C5B59] mt-1">Manage your event venues and availability</p>
          </div>
          <button
            onClick={() => router.push("/event-spaces/create")}
            className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-regular rounded-2xl hover:bg-[#0050C8] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Space
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
              placeholder="Search event spaces by name or description..."
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
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl z-10 py-2 shadow-lg">
                <div className="px-4 py-2 text-xs font-semibold text-[#5C5B59] uppercase">
                  Sort Options
                </div>
                {[
                  { value: "newly_added", label: "Newly Added" },
                  { value: "capacity_high_low", label: "Capacity: High - Low" },
                  { value: "capacity_low_high", label: "Capacity: Low - High" },
                  { value: "rate_high_low", label: "Rate: High - Low" },
                  { value: "rate_low_high", label: "Rate: Low - High" },
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

        {/* Space Type Filters */}
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Filter by Space Type</h3>
          <div className="flex gap-3 flex-wrap overflow-x-auto scrollbar-hide pb-2">
            {[
              { value: "all", label: "All Spaces" },
              { value: "ballroom", label: "Ballroom" },
              { value: "conference_room", label: "Conference Room" },
              { value: "meeting_room", label: "Meeting Room" },
              { value: "banquet_hall", label: "Banquet Hall" },
              { value: "boardroom", label: "Boardroom" },
              { value: "outdoor_venue", label: "Outdoor Venue" },
              { value: "rooftop_terrace", label: "Rooftop Terrace" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value as EventSpaceType | "all")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  filterType === type.value
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
            { label: "Total Spaces", value: eventSpaces.length, bg: "bg-[#F5F5F5]", icon: PartyPopper },
            { label: "Available", value: eventSpaces.filter(s => s.is_available).length, bg: "bg-[#F0F9FF]", icon: Calendar },
            { label: "Booked", value: eventSpaces.filter(s => !s.is_available).length, bg: "bg-[#FEF3C7]", icon: Zap },
            { label: "Avg. Capacity", value: Math.round(eventSpaces.reduce((sum, s) => sum + s.max_capacity_banquet, 0) / eventSpaces.length), bg: "bg-[#F5F3FF]", icon: Users },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bg} rounded-2xl p-5 flex items-center gap-4`}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#0F75BD]" />
                </div>
                <div>
                  <p className="text-[#5C5B59] text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Spaces Grid */}
        {filteredSpaces.length === 0 ? (
          <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8 text-[#0F75BD]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No event spaces found</h3>
            <p className="text-sm text-[#5C5B59] mb-6">Start by adding your first event space to the system</p>
            <button
              onClick={() => router.push("/event-spaces/create")}
              className="px-4 py-3 bg-[#0F75BD] text-white text-sm font-medium rounded-2xl hover:bg-[#0050C8] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Event Space
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space, index) => {
                const spaceNumber = `E-${(index + 1).toString().padStart(3, '0')}`;

                return (
                  <div
                    key={space.id}
                    className="bg-white rounded-[22px] overflow-hidden border border-[#E5E7EB] hover:border-[#0F75BD] transition-all group hover:shadow-lg"
                  >
                    {/* Space Image */}
                    <div className="relative h-48 bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF] flex items-center justify-center overflow-hidden">
                      <span className="text-7xl">🎭</span>

                      {/* Space Number */}
                      <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <span className="text-xs font-bold text-[#0F75BD]">{spaceNumber}</span>
                      </div>

                      {/* Space Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#0F75BD] text-xs font-medium rounded-lg">
                          <Sparkles className="w-3 h-3" />
                          {formatSpaceType(space.space_type)}
                        </span>
                      </div>

                      {/* Availability Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            space.is_available
                              ? "bg-[#ECFDF5] text-green-700"
                              : "bg-[#FEE2E2] text-red-700"
                          }`}
                        >
                          {space.is_available ? "Available" : "Booked"}
                        </span>
                      </div>
                    </div>

                    {/* Space Content */}
                    <div className="p-5">
                      {/* Space Title */}
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0F75BD] transition-colors">
                        {space.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[#5C5B59] mb-4 line-clamp-2">
                        {space.description}
                      </p>

                      {/* Space Details */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Users className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">{space.max_capacity_banquet}</span>
                          <span className="text-[10px] text-[#5C5B59]">Banquet</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Maximize2 className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">{space.space_size}</span>
                          <span className="text-[10px] text-[#5C5B59]">sq ft</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#FAFAFB] rounded-lg">
                          <Banknote className="w-4 h-4 text-[#0F75BD] mb-1" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">₦{space.base_rate_per_hour}</span>
                          <span className="text-[10px] text-[#5C5B59]">/hour</span>
                        </div>
                      </div>

                      {/* Features Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {space.has_audio_visual && (
                          <span className="px-2 py-1 bg-[#F0F9FF] text-[#0F75BD] text-xs font-medium rounded-lg">
                            A/V Equipment
                          </span>
                        )}
                        {space.has_stage && (
                          <span className="px-2 py-1 bg-[#F5F3FF] text-purple-700 text-xs font-medium rounded-lg">
                            Stage
                          </span>
                        )}
                        {space.has_natural_light && (
                          <span className="px-2 py-1 bg-[#FEF3C7] text-orange-700 text-xs font-medium rounded-lg">
                            Natural Light
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#E5E7EB] my-3"></div>

                      {/* Pricing & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#5C5B59] mb-0.5">Full Day Rate</p>
                          <p className="text-xl font-bold text-[#0F75BD]">
                            ₦{space.base_rate_full_day}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedSpace(space)}
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
            <div className="flex items-center justify-center gap-2 m-8">
              <button className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors">
                <ChevronDown className="w-5 h-5 rotate-90 text-[#5C5B59] text-xs" />
              </button>
              <button className="px-2 py-1 bg-[#0F75BD] text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-2 py-1 hover:bg-[#FAFAFB] text-[#1A1A1A] rounded-lg font-regular transition-colors">
                2
              </button>
              <button className="px-2 py-1 hover:bg-[#FAFAFB] text-[#1A1A1A] rounded-lg font-regular transition-colors">
                3
              </button>
              <span className="px-2 text-[#5C5B59]">...</span>
              <button className="px-2 py-1 hover:bg-[#FAFAFB] text-[#1A1A1A] rounded-lg font-regular transition-colors">
                10
              </button>
              <button className="p-2.5 hover:bg-[#FAFAFB] rounded-lg transition-colors">
                <ChevronDown className="w-5 h-5 -rotate-90 text-[#5C5B59]" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
