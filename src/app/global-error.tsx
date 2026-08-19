"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-slate-800 font-sans antialiased">
        <div className="w-full max-w-sm text-center space-y-5">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logos/ANDINOH.svg"
              alt="Andinoh Logo"
              width={110}
              height={30}
              className="h-6 w-auto object-contain"
              priority
            />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <p className="text-xs font-normal text-red-600 tracking-wider uppercase">
              System Error
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Critical error
            </h1>
            <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-xs mx-auto">
              A system error occurred. Click below to reload the application.
            </p>
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold text-white bg-[#0F75BD] hover:bg-[#0D63A0] rounded-xl transition-colors shadow-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
