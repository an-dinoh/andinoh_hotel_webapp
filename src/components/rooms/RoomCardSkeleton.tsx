"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function RoomCardSkeleton() {
    return (
        <div className="bg-white rounded-[22px] overflow-hidden border border-[#E5E7EB]">
            {/* Room Image Skeleton */}
            <div className="relative h-40 bg-[#FAFAFB]">
                <Skeleton variant="rect" className="w-full h-full" />

                {/* Unit Count Badge Skeleton */}
                <div className="absolute top-4 right-4 h-12 w-20 bg-white/50 backdrop-blur-sm rounded-xl" />

                {/* Room Type Badge Skeleton */}
                <div className="absolute top-4 left-4 h-7 w-24 bg-white/50 backdrop-blur-sm rounded-lg" />
            </div>

            {/* Room Content Skeleton */}
            <div className="p-5">
                {/* Room Title */}
                <Skeleton variant="text" className="w-3/4 h-6 mb-3" />

                {/* Description */}
                <div className="space-y-2 mb-4">
                    <Skeleton variant="text" className="w-full h-4" />
                    <Skeleton variant="text" className="w-5/6 h-4" />
                </div>

                {/* Room Details Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <Skeleton variant="rect" className="h-16 rounded-lg" />
                    <Skeleton variant="rect" className="h-16 rounded-lg" />
                    <Skeleton variant="rect" className="h-16 rounded-lg" />
                </div>

                {/* Divider */}
                <div className="border-t border-[#E5E7EB] my-4"></div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton variant="text" className="w-20 h-3" />
                        <Skeleton variant="text" className="w-24 h-7" />
                    </div>
                    <Skeleton variant="rect" className="w-24 h-10 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
