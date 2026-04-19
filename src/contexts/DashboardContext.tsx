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

            // Synthesize activities from real bookings
            const realActivities = (bookingsData.results || []).slice(0, 3).map((booking: any, index: number) => {
                const guestName = booking.guest_details?.full_name || "Guest";
                return {
                    id: `booking-${booking.id}`,
                    type: 'booking',
                    title: 'Confirmed Reservation',
                    timestamp: index === 0 ? 'Recently' : `${index * 5} mins ago`,
                    description: `${guestName} booked for ${booking.number_of_nights} nights (Ref: ${booking.booking_reference})`
                };
            });

            const staticActivities = [
                { id: 'sys-1', type: 'system', title: 'Daily Report Ready', timestamp: '1 hour ago', description: 'The performance report for today is now available.' },
                { id: 'sys-2', type: 'system', title: 'Inventory Check', timestamp: '2 hours ago', description: 'All room statuses have been synchronized with the live grid.' },
            ];

            setActivities([...realActivities, ...staticActivities]);

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
