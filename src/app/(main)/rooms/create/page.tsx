"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Bed,
  Users,
  DollarSign,
  Wifi,
  Tv,
  Coffee,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Sparkles,
  Info,
  Maximize2,
  Check,
  ChevronRight,
  Layout,
  Layers,
  Umbrella,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hotelService } from "@/services/hotel.service";
import { RoomType, BedType } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";

interface RoomForm {
  room_type: RoomType;
  title: string;
  description: string;
  base_price: string;
  max_occupancy: number;
  max_adults: number;
  max_children: number;
  bed_type: BedType;
  size_sqm: string;
  amenities: string[];
  images: File[];
  is_available: boolean;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_city_view: boolean;
  total_rooms: number;
}

const STEPS = [
  { id: 1, title: 'Concept', description: 'Define the room type and basic details', icon: Layout },
  { id: 2, title: 'Configuration', description: 'Size, pricing, and occupancy', icon: Layers },
  { id: 3, title: 'Experience', description: 'Amenities and view features', icon: Umbrella },
  { id: 4, title: 'Media', description: 'Upload photos and set inventory', icon: ImageIcon },
];

const ROOM_TYPE_DEFAULTS: Record<RoomType, Partial<RoomForm>> = {
  standard: {
    base_price: "45000",
    size_sqm: "25",
    bed_type: "queen",
    max_occupancy: 2,
    max_adults: 2,
    max_children: 1,
  },
  deluxe: {
    base_price: "85000",
    size_sqm: "45",
    bed_type: "king",
    max_occupancy: 2,
    max_adults: 2,
    max_children: 1,
  },
  suite: {
    base_price: "275000",
    size_sqm: "85",
    bed_type: "king",
    max_occupancy: 3,
    max_adults: 2,
    max_children: 1,
  },
  presidential: {
    base_price: "750000",
    size_sqm: "180",
    bed_type: "king",
    max_occupancy: 4,
    max_adults: 2,
    max_children: 2,
  },
  family: {
    base_price: "120000",
    size_sqm: "65",
    bed_type: "queen",
    max_occupancy: 4,
    max_adults: 2,
    max_children: 2,
  },
  twin: {
    base_price: "55000",
    size_sqm: "30",
    bed_type: "twin",
    max_occupancy: 2,
    max_adults: 2,
    max_children: 1,
  },
  single: {
    base_price: "35000",
    size_sqm: "20",
    bed_type: "single",
    max_occupancy: 1,
    max_adults: 1,
    max_children: 0,
  },
  double: {
    base_price: "50000",
    size_sqm: "35",
    bed_type: "double",
    max_occupancy: 2,
    max_adults: 2,
    max_children: 1,
  },
  triple: {
    base_price: "75000",
    size_sqm: "50",
    bed_type: "double",
    max_occupancy: 3,
    max_adults: 2,
    max_children: 1,
  },
  quad: {
    base_price: "95000",
    size_sqm: "60",
    bed_type: "double",
    max_occupancy: 4,
    max_adults: 2,
    max_children: 2,
  },
};

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [hotelId, setHotelId] = useState<string>("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotel = await hotelService.getMyHotel();
        setHotelId(hotel.id);
      } catch (error) {
        console.error("Failed to fetch hotel info:", error);
        setErrors({ submit: "Failed to load hotel information. Please refresh." });
      }
    };
    fetchHotel();
  }, []);

  const [form, setForm] = useState<RoomForm>({
    room_type: "standard",
    title: "",
    description: "",
    base_price: ROOM_TYPE_DEFAULTS.standard.base_price || "",
    max_occupancy: ROOM_TYPE_DEFAULTS.standard.max_occupancy || 2,
    max_adults: ROOM_TYPE_DEFAULTS.standard.max_adults || 2,
    max_children: ROOM_TYPE_DEFAULTS.standard.max_children || 0,
    bed_type: ROOM_TYPE_DEFAULTS.standard.bed_type || "queen",
    size_sqm: ROOM_TYPE_DEFAULTS.standard.size_sqm || "",
    amenities: [],
    images: [],
    is_available: true,
    has_balcony: false,
    has_sea_view: false,
    has_city_view: false,
    total_rooms: 1,
  });

  const roomTypes: { value: RoomType; label: string; description: string }[] = [
    { value: "standard", label: "Standard Room", description: "Essential comfort for all guests" },
    { value: "deluxe", label: "Deluxe Room", description: "Enhanced space with premium features" },
    { value: "suite", label: "Executive Suite", description: "Spacious living area for luxury stays" },
    { value: "presidential", label: "Presidential Suite", description: "Our most exclusive and grand offering" },
  ];

  const bedTypes: { value: BedType; label: string }[] = [
    { value: "single", label: "Single Bed" },
    { value: "double", label: "Double Bed" },
    { value: "twin", label: "Twin Beds" },
    { value: "queen", label: "Queen Bed" },
    { value: "king", label: "King Bed (Extra Large Premium)" },
    { value: "sofa_bed", label: "Sofa Bed" },
  ];

  const availableAmenities = [
    { id: "wifi", label: "Free Wi-Fi", icon: Wifi },
    { id: "tv", label: "Smart TV", icon: Tv },
    { id: "coffee", label: "Coffee Maker", icon: Coffee },
    { id: "minibar", label: "Mini Bar", icon: Coffee },
    { id: "safe", label: "In-room Safe", icon: Bed },
    { id: "ac", label: "Air Conditioning", icon: Bed },
    { id: "balcony", label: "Private Balcony", icon: Bed },
    { id: "bathtub", label: "Bathtub", icon: Bed },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = "Room title is required";
      if (!form.description.trim()) newErrors.description = "Brief description is needed";
    } else if (step === 2) {
      if (!form.base_price || parseFloat(form.base_price) <= 0) newErrors.base_price = "Valid price required";
      if (!form.size_sqm || parseFloat(form.size_sqm) <= 0) newErrors.size_sqm = "Valid size required";
    } else if (step === 4) {
      // No specific validation for step 4 fields, but we can add image validation if needed
      // if (form.images.length === 0) newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      console.log("🚀 Starting Room Creation Process...");

      let createdRoom;
      try {
        createdRoom = await hotelService.createRoom({
          hotel: hotelId,
          room_type: form.room_type,
          title: form.title,
          description: form.description,
          room_size: parseFloat(form.size_sqm),
          bed_type: form.bed_type,
          max_occupancy: form.max_occupancy,
          max_adults: form.max_adults,
          max_children: form.max_children,
          base_price: form.base_price,
          amenities: form.amenities,
          has_balcony: form.has_balcony,
          has_sea_view: form.has_sea_view,
          has_city_view: form.has_city_view,
          total_rooms: form.total_rooms,
        });
        console.log("✅ Room Created Successfully:", createdRoom);
      } catch (roomError: any) {
        console.error("❌ Room Creation FAILED:", roomError);
        throw roomError;
      }

      if (form.images.length > 0) {
        setSuccessMessage(`Room created! Uploading ${form.images.length} images...`);
        console.log(`📸 Starting upload of ${form.images.length} images...`);

        let uploadFailures = 0;
        for (let i = 0; i < form.images.length; i++) {
          const image = form.images[i];
          console.log(`⏳ Uploading image ${i + 1}/${form.images.length}: ${image.name}`);

          const formData = new FormData();
          formData.append('room', createdRoom.id);
          formData.append('image', image);
          formData.append('is_primary', (i === 0).toString());
          formData.append('order', i.toString());

          try {
            await hotelService.uploadRoomImage(formData);
            console.log(`✨ Image ${i + 1} uploaded successfully`);
          } catch (uploadError: any) {
            console.error(`❌ Image ${i + 1} upload FAILED:`, uploadError);
            uploadFailures++;
          }
        }

        if (uploadFailures > 0) {
          setSuccessMessage("");
          setErrors({
            submit: `Room created successfully, but ${uploadFailures} image(s) failed to upload. You can add them later in the edit section.`
          });
          console.warn(`⚠️ Partial Success: Room created but ${uploadFailures} images failed.`);
          return;
        }
      }

      setSuccessMessage("Room created successfully!");
      setErrors({}); // Clear any previous errors on total success
      console.log("🎉 Room creation process completed successfully!");
      setTimeout(() => router.push("/rooms"), 2000);
    } catch (error: any) {
      setSuccessMessage("");
      console.error("🚨 Global Room Creation Error:", error);

      // Attempt to extract detailed error info
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || (error.response?.data && JSON.stringify(error.response.data));

      setErrors({
        submit: errorDetail || error.message || "Failed to create room. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    else if (['max_occupancy', 'max_adults', 'max_children', 'total_rooms'].includes(name)) val = parseInt(value) || 0;

    setForm(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoomTypeSelect = (type: RoomType) => {
    const defaults = ROOM_TYPE_DEFAULTS[type];
    setForm(prev => ({
      ...prev,
      room_type: type,
      ...defaults
    }));
  };

  const toggleAmenity = (id: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Premium Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#C8CFD5]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl border border-[#C8CFD5] bg-white hover:bg-[#FAFAFB] hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Create Room Category</h1>
              <p className="text-sm text-gray-500 font-medium">Step {currentStep} of 4</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#FAFAFB] p-1.5 rounded-2xl border border-[#C8CFD5] relative overflow-hidden">
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-[#E6EFF6] w-full" />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-[#0F75BD]"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${currentStep === step.id
                  ? 'bg-[#E6EFF6] text-[#0F75BD] font-bold'
                  : currentStep > step.id
                    ? 'text-green-600'
                    : 'text-gray-400 opacity-50'
                  }`}
              >
                {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                <span className="text-sm font-bold whitespace-nowrap">{step.title}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-[#FAFAFB] rounded-[40px] p-10 border border-[#C8CFD5]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-[#E6EFF6] rounded-[22px] flex items-center justify-center text-[#0F75BD]">
                    <Layout className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Room Template</h2>
                    <p className="text-[#5C5B59] font-medium">Choose a category and set the stage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {roomTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleRoomTypeSelect(type.value)}
                      className={`text-left p-6 rounded-3xl border transition-all duration-300 ${form.room_type === type.value
                        ? 'border-[#0F75BD] bg-[#E6EFF6] scale-[1.02]'
                        : 'border-[#C8CFD5] bg-white hover:border-[#0F75BD]/50 hover:scale-[1.01]'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${form.room_type === type.value ? 'bg-[#0F75BD] text-white' : 'bg-[#FAFAFB] text-gray-400 border border-[#C8CFD5]'
                        }`}>
                        <Bed className="w-5 h-5" />
                      </div>
                      <h3 className={`font-bold transition-colors ${form.room_type === type.value ? 'text-[#0F75BD]' : 'text-[#1A1A1A]'}`}>
                        {type.label}
                      </h3>
                      <p className="text-xs text-[#5C5B59] mt-1 line-clamp-1">{type.description}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <InputField
                    label="Room Identity Name"
                    name="title"
                    placeholder="e.g., Majestic Royal Palace Suite"
                    value={form.title}
                    onChange={handleInputChange}
                    error={errors.title}
                    required
                  />
                  <div className="relative group">
                    <label className="block text-gray-900 text-sm font-bold mb-2 ml-1">
                      Creative Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full rounded-2xl border px-5 py-4 text-sm text-gray-800 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-gray-400 placeholder:text-sm resize-none ${errors.description ? "border-red-400 ring-4 ring-red-50" : "border-gray-100 focus:border-[#0F75BD]"
                        }`}
                      placeholder="Tell the story of this room. What makes it unforgettable?"
                    />
                    {errors.description && <p className="mt-2 text-xs text-red-500 font-bold px-1">{errors.description}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={nextStep}
                  className="group relative flex items-center gap-3 px-10 py-5 bg-[#0F75BD] text-white font-black rounded-3xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Configure Details</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-[#FAFAFB] rounded-[40px] p-10 border border-[#C8CFD5]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-[#E6EFF6] rounded-[22px] flex items-center justify-center text-[#0F75BD]">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Room Specs</h2>
                    <p className="text-[#5C5B59] font-medium">Fine-tune pricing, beds, and occupancy</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Base Overnight Rate (₦)"
                    name="base_price"
                    type="number"
                    placeholder="0.00"
                    value={form.base_price}
                    onChange={handleInputChange}
                    error={errors.base_price}
                    icon={<DollarSign className="w-4 h-4" />}
                    required
                  />
                  <InputField
                    label="Total Size (sq Meters)"
                    name="size_sqm"
                    type="number"
                    placeholder="e.g., 55"
                    value={form.size_sqm}
                    onChange={handleInputChange}
                    error={errors.size_sqm}
                    icon={<Maximize2 className="w-4 h-4" />}
                    required
                  />

                  <div>
                    <label className="block text-[#1A1A1A] text-sm font-bold mb-2 ml-1">Main Bed Infrastructure</label>
                    <div className="relative">
                      <select
                        name="bed_type"
                        value={form.bed_type}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-[#C8CFD5] bg-white px-5 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0F75BD] transition-all appearance-none cursor-pointer"
                      >
                        {bedTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <InputField
                    label="Max Guest Capacity"
                    name="max_occupancy"
                    type="number"
                    value={form.max_occupancy.toString()}
                    onChange={handleInputChange}
                    icon={<Users className="w-4 h-4" />}
                  />

                  <InputField
                    label="Limit: Adults"
                    name="max_adults"
                    type="number"
                    value={form.max_adults.toString()}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Limit: Children"
                    name="max_children"
                    type="number"
                    value={form.max_children.toString()}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-8 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Concept
                </button>
                <button
                  onClick={nextStep}
                  className="group relative flex items-center gap-3 px-10 py-5 bg-[#0F75BD] text-white font-black rounded-3xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span>Next: Experience</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-[#FAFAFB] rounded-[40px] p-10 border border-[#C8CFD5]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-[#E6EFF6] rounded-[22px] flex items-center justify-center text-[#0F75BD]">
                    <Umbrella className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Experience Highlights</h2>
                    <p className="text-[#5C5B59] font-medium">Select amenities and the room views</p>
                  </div>
                </div>

                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 opacity-40">Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  <label className={`flex items-center gap-4 cursor-pointer p-5 border rounded-3xl transition-all duration-300 ${form.has_balcony ? 'border-[#0F75BD] bg-[#E6EFF6]' : 'border-[#C8CFD5] bg-[#FAFAFB]'} `}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.has_balcony ? 'bg-[#0F75BD] text-white' : 'bg-white text-gray-400 border border-[#C8CFD5]'} `}>
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">Private Balcony</span>
                    <input type="checkbox" name="has_balcony" checked={form.has_balcony} onChange={handleInputChange} className="hidden" />
                  </label>
                  <label className={`flex items-center gap-4 cursor-pointer p-5 border rounded-3xl transition-all duration-300 ${form.has_sea_view ? 'border-[#0F75BD] bg-[#E6EFF6]' : 'border-[#C8CFD5] bg-[#FAFAFB]'} `}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.has_sea_view ? 'bg-[#0F75BD] text-white' : 'bg-white text-gray-400 border border-[#C8CFD5]'} `}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">Majestic Sea View</span>
                    <input type="checkbox" name="has_sea_view" checked={form.has_sea_view} onChange={handleInputChange} className="hidden" />
                  </label>
                  <label className={`flex items-center gap-4 cursor-pointer p-5 border rounded-3xl transition-all duration-300 ${form.has_city_view ? 'border-[#0F75BD] bg-[#E6EFF6]' : 'border-[#C8CFD5] bg-[#FAFAFB]'} `}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.has_city_view ? 'bg-[#0F75BD] text-white' : 'bg-white text-gray-400 border border-[#C8CFD5]'} `}>
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">City Horizon View</span>
                    <input type="checkbox" name="has_city_view" checked={form.has_city_view} onChange={handleInputChange} className="hidden" />
                  </label>
                </div>

                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 opacity-40">Available Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {availableAmenities.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 gap-3 ${form.amenities.includes(amenity.id)
                          ? 'border-[#0F75BD] bg-[#E6EFF6]'
                          : 'border-[#C8CFD5] bg-white hover:border-[#0F75BD]/50'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${form.amenities.includes(amenity.id) ? 'bg-[#0F75BD] text-white' : 'bg-[#FAFAFB] text-gray-400 border border-[#C8CFD5]'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[13px] font-bold text-center leading-tight ${form.amenities.includes(amenity.id) ? 'text-[#0F75BD]' : 'text-gray-500'}`}>
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-8 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Configuration
                </button>
                <button
                  onClick={nextStep}
                  className="group relative flex items-center gap-3 px-10 py-5 bg-[#0F75BD] text-white font-black rounded-3xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span>Next: Media Assets</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-[#FAFAFB] rounded-[40px] p-10 border border-[#C8CFD5]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-[#E6EFF6] rounded-[22px] flex items-center justify-center text-[#0F75BD]">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Finalizing Luxury</h2>
                    <p className="text-[#5C5B59] font-medium">Upload photos and set your inventory status</p>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 opacity-40">Gallery & Content</h3>
                  <ImageUpload
                    images={form.images}
                    onChange={(imgs) => setForm(p => ({ ...p, images: imgs }))}
                    error={errors.images}
                    maxFiles={10}
                  />
                </div>

                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 opacity-40">Global Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Inventory Amount"
                    name="total_rooms"
                    type="number"
                    value={form.total_rooms.toString()}
                    onChange={handleInputChange}
                    helpText="Number of physical rooms belonging to this category"
                    icon={<CheckCircle className="w-4 h-4" />}
                  />

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl border border-[#C8CFD5] bg-white hover:bg-[#E6EFF6] transition-all">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_available"
                          checked={form.is_available}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${form.is_available ? 'bg-[#0F75BD]' : 'bg-[#C8CFD5]'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_available ? 'translate-x-6' : ''}`} />
                      </div>
                      <span className="font-bold text-gray-800">Instantly Bookable</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Final Submission Info */}
              {Object.keys(errors).length > 0 && !errors.submit && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-bold">Please correct the errors in previous steps before submitting.</p>
                </div>
              )}

              {errors.submit && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-bold">{errors.submit}</p>
                </div>
              )}

              {successMessage && (
                <div className="p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 border border-green-100">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm font-bold">{successMessage}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-8 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Experience
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`group relative flex items-center gap-3 px-12 py-5 bg-gray-900 text-white font-black rounded-[28px] hover:scale-105 active:scale-95 transition-all overflow-hidden ${loading ? 'opacity-80' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Crafting Room...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                      <span>Save Room Category</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
