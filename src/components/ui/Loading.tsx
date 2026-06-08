"use client";

import React from "react";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

export default function Loading({ size = "md", text, fullPage = false }: LoadingProps) {
  const sizeMap = {
    xs: { container: "w-5 h-5", circle: "w-3.5 h-3.5", logo: "0px" },
    sm: { container: "w-10 h-10", circle: "w-6 h-6", logo: "8px" },
    md: { container: "w-20 h-20", circle: "w-12 h-12", logo: "16px" },
    lg: { container: "w-32 h-32", circle: "w-20 h-20", logo: "24px" },
  };

  const current = sizeMap[size];

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className={`relative ${current.container}`}>
        {/* Pulsing Glow */}
        <div className="absolute inset-0 rounded-full bg-[#0F75BD]/20 blur-xl animate-pulse" />

        {/* Outer Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#0F75BD] animate-spin" style={{ animationDuration: '1.5s' }} />

        {/* Inner Counter-Rotating Ring */}
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#FCC317] animate-spin-reverse" style={{ animationDuration: '2s' }} />

        {/* Central Logo */}
        {size !== "xs" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`${current.circle} rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden border-2 border-[#0F75BD]/10 animate-bounce-subtle`}
            >
              <img 
                src="/logos/ANDINOH-FAV.jpg" 
                alt="Andinoh Logo"
                className="w-full h-full object-cover p-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Elegant Loading Text */}
      {(text || (size !== "sm" && size !== "xs")) && (
        <div className="flex flex-col items-center animate-fade-in">
          <span className="text-[#002968] font-medium tracking-[0.2em] text-[10px] uppercase">
            {text || "Loading Experience"}
          </span>
          <div className="h-0.5 bg-[#FCC317] mt-2 rounded-full w-12 animate-shimmer-width" />
        </div>
      )}

      <style jsx>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes shimmer-width {
          0%, 100% { width: 10px; opacity: 0.5; }
          50% { width: 48px; opacity: 1; }
        }
        .animate-shimmer-width {
          animation: shimmer-width 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-[9999] animate-fade-in">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
