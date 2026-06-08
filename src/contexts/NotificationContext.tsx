"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { webSocketService } from '@/services/websocket.service';
import { hotelService } from '@/services/hotel.service';
import { chatService } from '@/services/chat.service';
import { useCurrency } from './CurrencyContext';
import { useDashboard } from './DashboardContext';

export interface Notification {
    id: string;
    type: 'booking_update' | 'hotel_status_update' | 'new_chat_message' | 'reception_alert' | 'inventory_updated';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    totalUnreadChats: number;
    refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [totalUnreadChats, setTotalUnreadChats] = useState(0);
    const { activities } = useDashboard();
    const isFirstMount = useRef(true);

    // PERSISTENCE: Load from localStorage on initial mount
    useEffect(() => {
        const saved = localStorage.getItem('andinoh_notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed.map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                })));
            } catch (e) {
                console.error('Failed to parse saved notifications:', e);
            }
        }
    }, []);

    // SEEDING: If empty and we have dashboard activities, seed some
    useEffect(() => {
        if (notifications.length === 0 && activities.length > 0) {
            const initialNotifications: Notification[] = activities.map((act: any) => ({
                id: act.id,
                type: act.type === 'booking' ? 'booking_update' : 'reception_alert',
                title: act.title,
                message: act.description,
                timestamp: new Date(),
                read: true, // Seeded are marked as read
            }));
            setNotifications(initialNotifications);
        }
    }, [activities, notifications.length]);

    // PERSISTENCE: Save to localStorage whenever notifications change
    useEffect(() => {
        if (!isFirstMount.current || notifications.length > 0) {
            localStorage.setItem('andinoh_notifications', JSON.stringify(notifications));
        }
        isFirstMount.current = false;
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((payload: any) => {
        // Filter out technical messages (e.g., subscription confirmations or status ok)
        if (!payload.type) {
            console.log('Technical WebSocket message received:', payload);
            return;
        }

        const message = (() => {
            const m = payload.message;
            if (typeof m === 'string') return m;
            // new_chat_message: m = { chat_id, ..., message: {text, sender_type} }
            const inner = m?.message;
            if (typeof inner === 'string') return inner;
            if (typeof inner?.text === 'string') return inner.text;
            // fallback for simple {text: "..."} shape
            if (typeof m?.text === 'string') return m.text;
            return 'New notification received';
        })();

        // SILENCE TECHNICAL MESSAGES: Do not show nor save subscription confirmations
        if (message.toLowerCase().includes('subscribed to')) {
            console.log('Suppressed technical notification:', message);
            return;
        }

        const newNotification: Notification = {
            id: Math.random().toString(36).substring(7),
            type: payload.type,
            title: getTitleByType(payload.type),
            message,
            timestamp: new Date(),
            read: false,
            data: payload.data,
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast for important notifications
        toast(newNotification.message, {
            icon: getIconByType(payload.type),
            duration: 5000,
        });
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const refreshUnreadCount = useCallback(async () => {
        try {
            const response = await chatService.getConversations('active');
            const results = response.results || [];
            const unreadCount = results.filter((c: any) => c.unread_count > 0).length;
            setTotalUnreadChats(unreadCount);
        } catch (err) {
            // Silently catch to avoid Next.js dev overlay popping up for 500 errors
        }
    }, []);

    const [hotelId, setHotelId] = useState<string | null>(null);

    // Monitor authentication status and connect/disconnect WebSocket accordingly
    useEffect(() => {
        let checkInterval: NodeJS.Timeout;
        let isConnected = false;

        const handleConnect = async () => {
            const token = authService.getToken();
            const user = authService.getUser();

            if (token && user && !isConnected) {
                console.log('Connecting WebSocket from NotificationProvider...');
                webSocketService.connect();
                isConnected = true;

                try {
                    const hotel = await hotelService.getMyHotel();
                    if (hotel?.id) {
                        setHotelId(hotel.id);
                    }
                } catch (err: any) {
                    if (err?.response?.status === 404) {
                        console.log('No hotel registered for this account yet.');
                    } else {
                        console.error('Failed to fetch hotel ID for WebSocket subscriptions:', err);
                    }
                }
            } else if (!token && isConnected) {
                console.log('Disconnecting WebSocket (No token)...');
                webSocketService.disconnect();
                isConnected = false;
                setHotelId(null);
            }
        };

        // Check immediately
        handleConnect();

        // Check periodically for login/logout events if they don't trigger a re-render
        checkInterval = setInterval(handleConnect, 2000);

        const removeListener = webSocketService.addListener((data) => {
            addNotification(data);
            // Refresh counts on new messages or alerts
            if (data.type === 'new_chat_message' || data.type === 'reception_alert') {
                refreshUnreadCount();
            }
        });

        return () => {
            clearInterval(checkInterval);
            removeListener();
            webSocketService.disconnect();
        };
    }, [addNotification, refreshUnreadCount]);

    // Initial fetch of unread count when hotelId is ready
    useEffect(() => {
        if (hotelId) {
            refreshUnreadCount();
        }
    }, [hotelId, refreshUnreadCount]);

    // Handle global subscriptions when both connection and hotelId are ready
    useEffect(() => {
        if (hotelId) {
            console.log('Subscribing to hotel-wide events for hotel:', hotelId);
            webSocketService.subscribe('subscribe_inventory', hotelId);
            webSocketService.subscribe('subscribe_hotel_status', hotelId);
            webSocketService.subscribe('subscribe_hotel_reception', hotelId);
        }
    }, [hotelId]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            clearNotifications,
            totalUnreadChats,
            refreshUnreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

function getTitleByType(type: string): string {
    switch (type) {
        case 'booking_update': return 'Booking Update';
        case 'hotel_status_update': return 'Hotel Status';
        case 'new_chat_message': return 'New Message';
        case 'reception_alert': return 'Reception Alert';
        case 'inventory_updated': return 'Inventory Update';
        default: return 'Notification';
    }
}

function getIconByType(type: string): string {
    switch (type) {
        case 'booking_update': return '📅';
        case 'hotel_status_update': return '🏨';
        case 'new_chat_message': return '💬';
        case 'reception_alert': return '🔔';
        case 'inventory_updated': return '📊';
        default: return '🔔';
    }
}
