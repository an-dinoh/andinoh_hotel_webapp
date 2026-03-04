"use client";

import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0A07]/40 backdrop-blur-[2px] z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Petite Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[32px] border border-gray-100 max-w-[340px] w-full p-6 relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-[#1A1A1A] mb-1.5">
              Confirm Logout
            </h2>
            <p className="text-sm text-[#5C5B59] leading-relaxed mb-6">
              Are you sure you want to end your session? You&apos;ll need to sign in again to access the dashboard.
            </p>
          </div>

          {/* Action Buttons - Petite style */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-[#1A1A1A] text-xs font-bold border border-gray-100 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
