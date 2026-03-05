"use client";

// Global polyfill for crypto.randomUUID in non-secure (HTTP) contexts
if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && !window.crypto.randomUUID) {
    // @ts-ignore
    window.crypto.randomUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}

import React from 'react';
import { GlobalErrorBoundary } from "@/components/ui/GlobalErrorBoundary";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { RoomsProvider } from "@/contexts/RoomsContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GlobalErrorBoundary>
            <CurrencyProvider>
                <DashboardProvider>
                    <NotificationProvider>
                        <RoomsProvider>
                            {children}
                            <Toaster position="top-right" />
                        </RoomsProvider>
                    </NotificationProvider>
                </DashboardProvider>
            </CurrencyProvider>
        </GlobalErrorBoundary>
    );
}
