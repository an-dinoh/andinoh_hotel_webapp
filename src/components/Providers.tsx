"use client";

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
