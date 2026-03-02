"use client";

import React from 'react';
import { GlobalErrorBoundary } from "@/components/ui/GlobalErrorBoundary";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GlobalErrorBoundary>
            <CurrencyProvider>
                <DashboardProvider>
                    <NotificationProvider>
                        {children}
                        <Toaster position="top-right" />
                    </NotificationProvider>
                </DashboardProvider>
            </CurrencyProvider>
        </GlobalErrorBoundary>
    );
}
