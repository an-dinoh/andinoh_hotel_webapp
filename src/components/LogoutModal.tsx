"use client";

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
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-[#0B0A07] mb-3">
            Log Out?
          </h2>

          {/* Description */}
          <p className="text-center text-[#5C5B59] text-base mb-8">
            Are you sure you want to log out?
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-full transition-colors text-base"
            >
              Yes Log out
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white hover:bg-gray-50 text-[#0B0A07] font-semibold py-4 px-6 rounded-full border-2 border-[#0B0A07] transition-colors text-base"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
