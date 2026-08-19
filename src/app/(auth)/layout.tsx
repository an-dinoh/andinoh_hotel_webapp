"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row overflow-y-auto font-sans antialiased text-slate-900">
      {/* Left side - Off-white decorative space */}
      <div className="hidden lg:block lg:w-1/2 bg-[#F8FAFC]" />

      {/* Right side - Fields and info container */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 bg-[#F8FAFC]">
        <div className="w-full max-w-[360px] sm:max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  );
}
