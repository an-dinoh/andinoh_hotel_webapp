"use client";

import Loading from "@/components/ui/Loading";

export default function MainLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center min-h-[400px]">
      <Loading size="md" text="Loading Page..." />
    </div>
  );
}
