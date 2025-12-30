"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Maximize2,
  Ruler,
  Banknote,
} from "lucide-react";
import { EventSpaceType, SetupStyle } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface EventSpaceForm {
  title: string;
  description: string;
  space_type: EventSpaceType;
  space_size: string;
  max_capacity_theater: string;
  max_capacity_banquet: string;
  max_capacity_cocktail: string;
  min_capacity: string;
  base_rate_per_hour: string;
  base_rate_half_day: string;
  base_rate_full_day: string;
  weekend_rate_multiplier: string;
  ceiling_height: string;
  floor_level: string;
  total_spaces: string;
  has_natural_light: boolean;
  has_audio_visual: boolean;
  has_stage: boolean;
  has_dance_floor: boolean;
  has_kitchen_access: boolean;
  has_outdoor_access: boolean;
}

export default function CreateEventSpacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState<EventSpaceForm>({
    title: "",
    description: "",
    space_type: "conference_room",
    space_size: "",
    max_capacity_theater: "",
    max_capacity_banquet: "",
    max_capacity_cocktail: "",
    min_capacity: "",
    base_rate_per_hour: "",
    base_rate_half_day: "",
    base_rate_full_day: "",
    weekend_rate_multiplier: "1.0",
    ceiling_height: "",
    floor_level: "",
    total_spaces: "1",
    has_natural_light: false,
    has_audio_visual: false,
    has_stage: false,
    has_dance_floor: false,
    has_kitchen_access: false,
    has_outdoor_access: false,
  });

  const spaceTypes: { value: EventSpaceType; label: string; description: string }[] = [
    { value: "ballroom", label: "Ballroom", description: "Large elegant space for weddings and galas" },
    { value: "conference_room", label: "Conference Room", description: "Professional meeting space with A/V" },
    { value: "meeting_room", label: "Meeting Room", description: "Small to medium business meetings" },
    { value: "banquet_hall", label: "Banquet Hall", description: "Dining and celebration events" },
    { value: "boardroom", label: "Boardroom", description: "Executive meetings and presentations" },
    { value: "outdoor_venue", label: "Outdoor Venue", description: "Garden or patio events" },
    { value: "rooftop_terrace", label: "Rooftop Terrace", description: "Outdoor space with views" },
    { value: "garden", label: "Garden", description: "Natural outdoor setting" },
    { value: "theater", label: "Theater", description: "Presentation and performance space" },
    { value: "exhibition_hall", label: "Exhibition Hall", description: "Trade shows and exhibitions" },
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) newErrors.title = "Space name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.space_size || parseFloat(form.space_size) <= 0)
      newErrors.space_size = "Valid space size is required";
    if (!form.max_capacity_theater || parseInt(form.max_capacity_theater) <= 0)
      newErrors.max_capacity_theater = "Theater capacity is required";
    if (!form.max_capacity_banquet || parseInt(form.max_capacity_banquet) <= 0)
      newErrors.max_capacity_banquet = "Banquet capacity is required";
    if (!form.max_capacity_cocktail || parseInt(form.max_capacity_cocktail) <= 0)
      newErrors.max_capacity_cocktail = "Cocktail capacity is required";
    if (!form.base_rate_per_hour || parseFloat(form.base_rate_per_hour) <= 0)
      newErrors.base_rate_per_hour = "Hourly rate is required";
    if (!form.base_rate_half_day || parseFloat(form.base_rate_half_day) <= 0)
      newErrors.base_rate_half_day = "Half-day rate is required";
    if (!form.base_rate_full_day || parseFloat(form.base_rate_full_day) <= 0)
      newErrors.base_rate_full_day = "Full-day rate is required";
    if (!form.floor_level.trim()) newErrors.floor_level = "Floor level is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success - redirect to event spaces page
      router.push("/event-spaces");
    } catch (error) {
      console.error("Error creating event space:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#F9FAFB] overflow-y-auto scrollbar-hide">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#0F75BD] hover:text-[#0050C8] font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Event Spaces
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Add New Event Space</h1>
          <p className="text-gray-500 text-sm">Create a new event venue for your hotel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-8 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h2>

            <InputField
              label="Space Name"
              type="text"
              placeholder="e.g., Grand Ballroom, Executive Boardroom"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={errors.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the space, its features, and ideal use cases..."
                rows={4}
                className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Space Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.space_type}
                onChange={(e) => setForm({ ...form, space_type: e.target.value as EventSpaceType })}
                className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
              >
                {spaceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Floor Level"
                type="text"
                placeholder="e.g., Ground Floor, 10th Floor, Rooftop"
                value={form.floor_level}
                onChange={(e) => setForm({ ...form, floor_level: e.target.value })}
                error={errors.floor_level}
                required
              />

              <InputField
                label="Number of Identical Spaces"
                type="number"
                placeholder="1"
                value={form.total_spaces}
                onChange={(e) => setForm({ ...form, total_spaces: e.target.value })}
                min="1"
              />
            </div>
          </div>

          {/* Space Specifications */}
          <div className="bg-white rounded-2xl p-8 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Space Specifications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Space Size (sq ft)"
                type="number"
                placeholder="e.g., 5000"
                value={form.space_size}
                onChange={(e) => setForm({ ...form, space_size: e.target.value })}
                error={errors.space_size}
                required
                icon={<Maximize2 className="w-4 h-4 text-gray-400" />}
              />

              <InputField
                label="Ceiling Height (ft)"
                type="number"
                placeholder="e.g., 12"
                value={form.ceiling_height}
                onChange={(e) => setForm({ ...form, ceiling_height: e.target.value })}
                icon={<Ruler className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Minimum Capacity"
                type="number"
                placeholder="e.g., 10"
                value={form.min_capacity}
                onChange={(e) => setForm({ ...form, min_capacity: e.target.value })}
                icon={<Users className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Maximum Capacity by Setup Style</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField
                  label="Theater Style"
                  type="number"
                  placeholder="e.g., 500"
                  value={form.max_capacity_theater}
                  onChange={(e) => setForm({ ...form, max_capacity_theater: e.target.value })}
                  error={errors.max_capacity_theater}
                  required
                  icon={<Users className="w-4 h-4 text-gray-400" />}
                />

                <InputField
                  label="Banquet Style"
                  type="number"
                  placeholder="e.g., 350"
                  value={form.max_capacity_banquet}
                  onChange={(e) => setForm({ ...form, max_capacity_banquet: e.target.value })}
                  error={errors.max_capacity_banquet}
                  required
                  icon={<Users className="w-4 h-4 text-gray-400" />}
                />

                <InputField
                  label="Cocktail Style"
                  type="number"
                  placeholder="e.g., 600"
                  value={form.max_capacity_cocktail}
                  onChange={(e) => setForm({ ...form, max_capacity_cocktail: e.target.value })}
                  error={errors.max_capacity_cocktail}
                  required
                  icon={<Users className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-8 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                label="Hourly Rate (₦)"
                type="number"
                placeholder="500"
                value={form.base_rate_per_hour}
                onChange={(e) => setForm({ ...form, base_rate_per_hour: e.target.value })}
                error={errors.base_rate_per_hour}
                required
                icon={<Banknote className="w-4 h-4 text-gray-400" />}
              />

              <InputField
                label="Half Day Rate (₦)"
                type="number"
                placeholder="2500"
                value={form.base_rate_half_day}
                onChange={(e) => setForm({ ...form, base_rate_half_day: e.target.value })}
                error={errors.base_rate_half_day}
                required
                icon={<Banknote className="w-4 h-4 text-gray-400" />}
              />

              <InputField
                label="Full Day Rate (₦)"
                type="number"
                placeholder="4500"
                value={form.base_rate_full_day}
                onChange={(e) => setForm({ ...form, base_rate_full_day: e.target.value })}
                error={errors.base_rate_full_day}
                required
                icon={<Banknote className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <InputField
              label="Weekend Rate Multiplier"
              type="number"
              step="0.1"
              placeholder="1.5"
              value={form.weekend_rate_multiplier}
              onChange={(e) => setForm({ ...form, weekend_rate_multiplier: e.target.value })}
              helpText="e.g., 1.5 means 50% increase on weekends"
            />
          </div>

          {/* Features & Amenities */}
          <div className="bg-white rounded-2xl p-8 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Features & Amenities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "has_natural_light", label: "Natural Light", description: "Windows or skylights" },
                { key: "has_audio_visual", label: "A/V Equipment", description: "Projectors, screens, sound system" },
                { key: "has_stage", label: "Stage", description: "Raised platform for presentations" },
                { key: "has_dance_floor", label: "Dance Floor", description: "Dedicated space for dancing" },
                { key: "has_kitchen_access", label: "Kitchen Access", description: "Catering preparation area" },
                { key: "has_outdoor_access", label: "Outdoor Access", description: "Patio, balcony, or garden" },
              ].map((feature) => (
                <label
                  key={feature.key}
                  className="flex items-start gap-3 p-4 border border-[#D3D9DD] rounded-xl cursor-pointer hover:border-[#0F75BD] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form[feature.key as keyof EventSpaceForm] as boolean}
                    onChange={(e) => setForm({ ...form, [feature.key]: e.target.checked })}
                    className="mt-0.5 w-5 h-5 text-[#0F75BD] border-[#D3D9DD] rounded focus:ring-[#0F75BD]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{feature.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              className="w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating Event Space..." : "Create Event Space"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
