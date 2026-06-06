"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiSearch,
    FiCalendar,
    FiMap,
    FiCreditCard,
    FiShield,
    FiGlobe,
    FiSmartphone,
    FiStar,
    FiUsers,
    FiTrendingUp,
    FiDollarSign,
    FiAward,
    FiMapPin,
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiLock,
    FiCheckCircle,
} from "react-icons/fi";
import { MdHotel, /* MdFlight, MdEvent, */ MdExplore } from "react-icons/md";
import { HiOutlineUserGroup, HiOutlineThumbUp } from "react-icons/hi";
import { RiSmartphoneLine } from "react-icons/ri";
import { BiWorld } from "react-icons/bi";

const baseFeatures = [
    { icon: FiSearch, name: "Smart Search" },
    { icon: FiMap, name: "Africa Coverage" },
    { icon: FiCreditCard, name: "Mobile Money" },
    { icon: FiShield, name: "Verified Listings" },
    { icon: FiGlobe, name: "Multi-language" },
    { icon: FiSmartphone, name: "Mobile-First" },
    { icon: FiStar, name: "Reviews" },
    { icon: FiUsers, name: "24/7 Support" },
    { icon: FiMapPin, name: "Local Experiences" },
    { icon: FiTrendingUp, name: "Best Prices" },
    { icon: FiDollarSign, name: "Multi-Currency" },
    { icon: FiAward, name: "Trusted Partners" },
    { icon: FiPhone, name: "Instant Booking" },
    { icon: FiMail, name: "Email Confirmation" },
    { icon: FiMessageCircle, name: "Live Chat" },
    { icon: FiCalendar, name: "Easy Planning" },
    { icon: MdExplore, name: "Discover" },
    { icon: BiWorld, name: "Destinations" },
    { icon: FiLock, name: "Secure Payment" },
    { icon: HiOutlineUserGroup, name: "Group Bookings" },
    { icon: HiOutlineThumbUp, name: "Top Rated" },
    { icon: FiCheckCircle, name: "Flexible Payment" },
    { icon: FiMap, name: "Authentic Africa" },
    { icon: RiSmartphoneLine, name: "Mobile App" },
    { icon: FiTrendingUp, name: "Price Match" },
    { icon: MdHotel, name: "Hotels & Stays", size: "large" },
    // { icon: MdFlight, name: "Flight Booking", size: "large" },
    // { icon: MdEvent, name: "Events & Venues", size: "large" },
];

// Grid configuration
const GRID_SIZE = 12;
const TOTAL_ITEMS = GRID_SIZE * GRID_SIZE;

const expandedFeatures = Array.from({ length: TOTAL_ITEMS }).map((_, i) => {
    // Sprinkle some specific patterns for large items to look balanced
    const isLargeCandidate = (i === 54 || i === 58 || i === 82) && (i % GRID_SIZE) < GRID_SIZE - 1 && i < TOTAL_ITEMS - GRID_SIZE;
    const isEmpty = i % 11 === 0 && !isLargeCandidate;
    const baseFeature = baseFeatures[i % baseFeatures.length];

    return {
        ...baseFeature,
        id: i,
        empty: isEmpty,
        size: isLargeCandidate ? "large" : "small",
    };
});

export default function FeaturesGrid() {
    // Scale constants - MATCHING THE "PERFECT" IMAGE
    // Boxes need to be big enough to show the icon and label clearly
    const CELL_SIZE = "280px";
    const GRID_WIDTH = "3360px"; // 12 * 280px

    return (
        <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden">
            <motion.div
                drag
                dragElastic={0.05}
                dragConstraints={{
                    left: -1800,
                    right: 1800,
                    top: -1200,
                    bottom: 1200,
                }}
                className="grid grid-cols-12 gap-0"
                style={{ width: GRID_WIDTH }}
            >
                {expandedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    const isLarge = feature.size === "large";
                    const isEmpty = feature.empty;

                    return (
                        <div
                            key={index}
                            className={`relative flex flex-col items-center justify-center aspect-square bg-white border-[#E5E7EB] border-[0.5px]
                ${isLarge ? "col-span-2 row-span-2" : "col-span-1"}
                ${!isEmpty ? "group" : "opacity-5"}
              `}
                            style={{
                                height: isLarge ? "560px" : CELL_SIZE,
                                width: isLarge ? "560px" : CELL_SIZE,
                                boxShadow: "none"
                            }}
                        >
                            {!isEmpty && Icon && (
                                <div className="flex flex-col items-center">
                                    <Icon
                                        className={`${isLarge
                                            ? "w-24 h-24 mb-8"
                                            : "w-10 h-10 mb-6"
                                            } text-[#1A1A1A]`}
                                    />
                                    <span
                                        className={`${isLarge ? "text-2xl font-bold" : "text-sm font-medium"
                                            } text-center text-[#1A1A1A] px-6 capitalize`}
                                    >
                                        {feature.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </motion.div>

            {/* Fade Overlays adapted for white grid */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-[#0F75BD] via-[#0F75BD]/40 to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-[#0F75BD] via-[#0F75BD]/40 to-transparent"></div>
                <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#0F75BD] via-[#0F75BD]/40 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#0F75BD] via-[#0F75BD]/40 to-transparent"></div>
            </div>

            {/* Interactive hint */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#0F75BD]/10 backdrop-blur-xl rounded-full border border-[#0F75BD]/20 text-[#0F75BD] font-semibold text-lg pointer-events-none z-50">
                Click and Drag to Explore
            </div>
        </div>
    );
}
