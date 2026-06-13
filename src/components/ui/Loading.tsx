"use client";

import React from "react";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

/** Number of skeleton rows per size */
const rowsMap = { xs: 1, sm: 2, md: 4, lg: 6 };

/** Width presets to make the skeleton feel natural */
const rowWidths = [
  ["w-3/4", "w-1/2"],
  ["w-full", "w-2/3"],
  ["w-5/6", "w-1/3"],
  ["w-2/3", "w-1/2"],
  ["w-full", "w-3/4"],
  ["w-4/5", "w-2/5"],
];

/** Full-page Andinoh loader — white background, brand cursor */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="flex items-center">
        {/* Brand wordmark */}
        <span
          className="text-[#1A1A1A] font-black text-xl tracking-tight select-none"
          style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}
        >
          andinoh
        </span>
        {/* Blinking brand-blue cursor */}
        <span
          className="inline-block w-[2px] h-[1.1em] bg-[#0F75BD] ml-[3px] translate-y-[1px]"
          style={{ animation: "blink 1.1s step-start infinite" }}
        />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Loading({ size = "md", text, fullPage = false }: LoadingProps) {
  if (fullPage) {
    return <FullPageLoader />;
  }

  const rows = rowsMap[size];

  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {(size === "md" || size === "lg") && (
            <div className="w-9 h-9 rounded-full bg-[#EBEBEB] animate-pulse flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <div
              className={`h-3.5 bg-[#EBEBEB] rounded-[10px] animate-pulse ${rowWidths[i % rowWidths.length][0]}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
            {size !== "xs" && (
              <div
                className={`h-2.5 bg-[#F3F4F6] rounded-[10px] animate-pulse ${rowWidths[i % rowWidths.length][1]}`}
                style={{ animationDelay: `${i * 80 + 40}ms` }}
              />
            )}
          </div>
        </div>
      ))}

      {text && (
        <p className="text-xs font-semibold text-[#8F8E8D] uppercase tracking-widest text-center pt-1">
          {text}
        </p>
      )}
    </div>
  );
}
