"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { hotelService } from '@/services/hotel.service';
import { Room, RoomType, PhysicalRoom, PaginatedResponse } from '@/types/hotel.types';

interface RoomStats {
    total: number;
    available: number;
    occupied: number;
    avgRate: number | null;
}

interface RoomsContextType {
    // Categories (Marketing/Pricing)
    rooms: Room[];
    totalCount: number;

    // Units (Actual Inventory)
    physicalRooms: PhysicalRoom[];
    totalPhysicalCount: number;

    roomStats: RoomStats;

    // Loading states
    isLoading: boolean;
    isRefreshing: boolean;
    isUnitsLoading: boolean;
    statsLoading: boolean;
    error: string | null;

    // Filters & Pagination
    currentPage: number;
    currentUnitPage: number;
    searchTerm: string;
    filterType: RoomType | "all";
    filterCategoryId: string | "all";
    sortBy: string;

    // Actions
    setCurrentPage: (page: number) => void;
    setCurrentUnitPage: (page: number) => void;
    setSearchTerm: (term: string) => void;
    setFilterType: (type: RoomType | "all") => void;
    setFilterCategoryId: (id: string | "all") => void;
    setSortBy: (sort: string) => void;
    fetchRoomsData: (isBackground?: boolean) => Promise<void>;
    fetchPhysicalRoomsData: (isBackground?: boolean) => Promise<void>;
    updatePhysicalRoom: (id: string, data: Partial<PhysicalRoom>) => Promise<void>;
    deletePhysicalRoom: (id: string) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

const PAGE_SIZE = 12;

export const RoomsProvider = ({ children }: { children: ReactNode }) => {
    // Category State
    const [rooms, setRooms] = useState<Room[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Unit State
    const [physicalRooms, setPhysicalRooms] = useState<PhysicalRoom[]>([]);
    const [totalPhysicalCount, setTotalPhysicalCount] = useState(0);

    const [roomStats, setRoomStats] = useState<RoomStats>({ total: 0, available: 0, occupied: 0, avgRate: null });

    // Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [currentUnitPage, setCurrentUnitPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<RoomType | "all">("all");
    const [filterCategoryId, setFilterCategoryId] = useState<string | "all">("all");
    const [sortBy, setSortBy] = useState("newly_added");

    // Loading State
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUnitsLoading, setIsUnitsLoading] = useState(false);
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

    const fetchPhysicalRoomsData = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setIsUnitsLoading(true);
            setError(null);

            const filters: any = { page: currentUnitPage, page_size: PAGE_SIZE };
            if (filterCategoryId !== "all") filters.room_type_id = filterCategoryId;

            const response = await hotelService.getAllPhysicalRooms(filters).catch((err) => {
                console.warn("Failed to fetch physical rooms:", err);
                return { count: 0, results: [], next: null, previous: null };
            });

            // DEBUG CHECK FOR DB MISMATCH
            const expectedSum = dataRef.current.rooms.reduce((sum, r) => sum + (r.total_rooms || 0), 0);
            console.log(`[DEBUG] Physical DB says ${response.count} units. Categories DB sum says ${expectedSum} units.`);

            setPhysicalRooms(response.results || []);
            setTotalPhysicalCount(response.count ?? 0);
        } catch (err: any) {
            console.error("Error fetching physical rooms:", err);
            setError(err.message || "Failed to fetch physical rooms");
        } finally {
            setIsUnitsLoading(false);
        }
    }, [currentUnitPage, filterCategoryId]);

    const updatePhysicalRoom = useCallback(async (id: string, data: Partial<PhysicalRoom>) => {
        try {
            await hotelService.updatePhysicalRoom(id, data);
            // Optimistically update unit data
            setPhysicalRooms(prev => prev.map(unit => unit.id === id ? { ...unit, ...data } : unit));
        } catch (err: any) {
            console.error("Error updating physical room:", err);
            throw err;
        }
    }, []);

    const deletePhysicalRoom = useCallback(async (id: string) => {
        try {
            await hotelService.deletePhysicalRoom(id);
            setPhysicalRooms(prev => prev.filter(unit => unit.id !== id));
        } catch (err: any) {
            console.error("Error deleting physical room:", err);
            throw err;
        }
    }, []);

    // Expose context
    return (
        <RoomsContext.Provider value={{
            rooms,
            totalCount,
            physicalRooms,
            totalPhysicalCount,
            roomStats,
            isLoading,
            isRefreshing,
            isUnitsLoading,
            statsLoading,
            error,
            currentPage,
            currentUnitPage,
            searchTerm,
            filterType,
            filterCategoryId,
            sortBy,
            setCurrentPage,
            setCurrentUnitPage,
            setSearchTerm,
            setFilterType,
            setFilterCategoryId,
            setSortBy,
            fetchRoomsData,
            fetchPhysicalRoomsData,
            updatePhysicalRoom,
            deletePhysicalRoom
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
