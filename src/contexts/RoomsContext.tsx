"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { hotelService } from '@/services/hotel.service';
import { Room, RoomType } from '@/types/hotel.types';

interface RoomStats {
    total: number;
    available: number;
    occupied: number;
    avgRate: number | null;
}

interface RoomsContextType {
    // Data
    rooms: Room[];
    totalCount: number;
    roomStats: RoomStats;

    // Loading states
    isLoading: boolean;
    isRefreshing: boolean;
    statsLoading: boolean;
    error: string | null;

    // Filters & Pagination
    currentPage: number;
    searchTerm: string;
    filterType: RoomType | "all";
    sortBy: string;

    // Actions
    setCurrentPage: (page: number) => void;
    setSearchTerm: (term: string) => void;
    setFilterType: (type: RoomType | "all") => void;
    setSortBy: (sort: string) => void;
    fetchRoomsData: (isBackground?: boolean) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

const PAGE_SIZE = 12;

export const RoomsProvider = ({ children }: { children: ReactNode }) => {
    // Data State
    const [rooms, setRooms] = useState<Room[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [roomStats, setRoomStats] = useState<RoomStats>({ total: 0, available: 0, occupied: 0, avgRate: null });

    // Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<RoomType | "all">("all");
    const [sortBy, setSortBy] = useState("newly_added");

    // Loading State
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dataRef = useRef({ rooms, roomStats });
    useEffect(() => {
        dataRef.current = { rooms, roomStats };
    }, [rooms, roomStats]);

    const fetchRoomsData = useCallback(async (isBackground = false) => {
        try {
            const { rooms: currentRooms, roomStats: currentStats } = dataRef.current;

            // Determine if we need to show full loading shimmer
            if (!isBackground && currentRooms.length === 0) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            if (!isBackground && currentStats.total === 0) {
                setStatsLoading(true);
            }

            setError(null);

            // Fetch Stats in parallel if needed, though stats usually only need fetching once, let's fetch them
            const fetchStatsPromise = hotelService.getDashboardStats().catch(() => null);

            // Fetch Rooms
            const filters: any = { page: currentPage, page_size: PAGE_SIZE };
            if (filterType !== "all") filters.room_type = filterType;

            const fetchRoomsPromise = hotelService.getRooms(filters).catch((err) => {
                if (dataRef.current.rooms.length === 0) {
                    setError(err.message || "Failed to fetch rooms");
                }
                return null;
            });

            const [statsData, roomsResponse] = await Promise.all([fetchStatsPromise, fetchRoomsPromise]);

            if (statsData?.room_stats) {
                setRoomStats(prev => ({
                    ...prev,
                    total: statsData.room_stats.total,
                    available: statsData.room_stats.available,
                    occupied: statsData.room_stats.occupied,
                    avgRate: statsData.performance?.adr || prev.avgRate,
                }));
            }

            if (roomsResponse) {
                const results = roomsResponse.results || [];
                setRooms(results);
                setTotalCount(roomsResponse.count ?? 0);

                // Update average rate from loaded page if available
                if (results.length > 0) {
                    const validRates = results
                        .map(r => parseFloat(r.base_price))
                        .filter(p => !isNaN(p));

                    if (validRates.length > 0) {
                        const avg = Math.round(validRates.reduce((sum, p) => sum + p, 0) / validRates.length);
                        setRoomStats(prev => ({ ...prev, avgRate: avg }));
                    }
                }
            }

        } catch (err: any) {
            // Fallback for unexpected context-level errors
            if (dataRef.current.rooms.length === 0) {
                setError("An unexpected error occurred while loading rooms");
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setStatsLoading(false);
        }
    }, [currentPage, filterType]); // Re-fetch when page or filter changes

    // Expose context
    return (
        <RoomsContext.Provider value={{
            rooms,
            totalCount,
            roomStats,
            isLoading,
            isRefreshing,
            statsLoading,
            error,
            currentPage,
            searchTerm,
            filterType,
            sortBy,
            setCurrentPage,
            setSearchTerm,
            setFilterType,
            setSortBy,
            fetchRoomsData
        }}>
            {children}
        </RoomsContext.Provider>
    );
};

export const useRooms = () => {
    const context = useContext(RoomsContext);
    if (context === undefined) {
        throw new Error('useRooms must be used within a RoomsProvider');
    }
    return context;
};
