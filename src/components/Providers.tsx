"use client";

import React from 'react';
import { GlobalErrorBoundary } from "@/components/ui/GlobalErrorBoundary";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GlobalErrorBoundary>
            <CurrencyProvider>
                <NotificationProvider>
                    {children}
                    <Toaster position="top-right" />
                </NotificationProvider>
            </CurrencyProvider>
        </GlobalErrorBoundary>
    );
}
