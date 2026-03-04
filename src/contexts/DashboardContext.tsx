"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { hotelService } from '@/services/hotel.service';
import { authService } from '@/services/auth.service';
import {
    DashboardStats,
    BookingTrendResponse,
    WalletStats,
    Booking
} from '@/types/hotel.types';

interface DashboardContextType {
    stats: DashboardStats | null;
    trendResponse: BookingTrendResponse | null;
    wallet: WalletStats | null;
    upcomingBookings: Booking[];
    activities: any[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    lastFetched: number | null;
    fetchDashboardData: (isBackground?: boolean) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trendResponse, setTrendResponse] = useState<BookingTrendResponse | null>(null);
    const [wallet, setWallet] = useState<WalletStats | null>(null);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<number | null>(null);

    // Use a ref to store the current stats value without making it a useCallback dependency
    const statsRef = useRef(stats);
    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    const fetchDashboardData = useCallback(async (isBackground = false) => {
        try {
            // If we already have data and it's not a background refresh, we still don't show full loading
            // unless stats is null (initial load).
            // Use the ref to access the current stats value
            if (!isBackground && !statsRef.current) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError(null);

            const [statsData, trendsData, walletData, bookingsData] = await Promise.all([
                hotelService.getDashboardStats().catch(() => null),
                hotelService.getBookingTrends().catch(() => null),
                hotelService.getWalletStats().catch(() => null),
                hotelService.getBookings({ booking_status: 'confirmed' }).catch(() => ({ results: [] })),
            ]);

            if (statsData) setStats(statsData);
            if (trendsData) setTrendResponse(trendsData);
            if (walletData) setWallet(walletData);
            if (bookingsData) setUpcomingBookings(bookingsData.results);

            // Maintain the "real-world" mock activities
            const currentUser = authService.getUser();
            setActivities([
                { id: '1', type: 'booking', title: 'New Booking', timestamp: '2 mins ago', description: 'John Doe booked Deluxe Room for 3 nights.' },
                { id: '2', type: 'payment', title: 'Payment Received', timestamp: '15 mins ago', description: 'Confirmed payment of ₦45,000 for Booking #BK-9021.' },
                { id: '3', type: 'system', title: 'Daily Report Ready', timestamp: '1 hour ago', description: 'The performance report for Feb 28 is now available.' },
                { id: '4', type: currentUser?.role === 'staff' ? 'staff' : 'system', title: 'Room Cleaned', timestamp: '2 hours ago', description: 'Room 204 has been marked as Clean by Housekeeping.' },
            ]);

            setLastFetched(Date.now());
        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            if (!stats) {
                setError(err.message || "Failed to load dashboard statistics");
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    return (
        <DashboardContext.Provider value={{
            stats,
            trendResponse,
            wallet,
            upcomingBookings,
            activities,
            isLoading,
            isRefreshing,
            error,
            lastFetched,
            fetchDashboardData
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
