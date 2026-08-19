"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { RoomsProvider } from "@/contexts/RoomsContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <NotificationProvider>
          <CurrencyProvider>
            <RoomsProvider>
              <Toaster position="top-right" />
              {children}
            </RoomsProvider>
          </CurrencyProvider>
        </NotificationProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}
