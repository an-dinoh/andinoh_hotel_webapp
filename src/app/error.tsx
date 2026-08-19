"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-slate-800 font-sans antialiased">
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
          <p className="text-xs font-normal text-amber-600 tracking-wider uppercase">
            Application Error
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-xs mx-auto">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold text-white bg-[#0F75BD] hover:bg-[#0D63A0] rounded-xl transition-colors shadow-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center h-10 px-4 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
