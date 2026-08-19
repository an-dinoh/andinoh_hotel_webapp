"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

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

        {/* 404 Message */}
        <div className="space-y-2">
          <p className="text-xs font-normal text-[#0F75BD] tracking-wider uppercase">
            404 — Page Not Found
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-xs mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold text-white bg-[#0F75BD] hover:bg-[#0D63A0] rounded-xl transition-colors shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
