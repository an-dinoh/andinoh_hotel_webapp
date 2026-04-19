"use client";

import Loading from "@/components/ui/Loading";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function LoaderDemo() {
    const [isLoading, setIsLoading] = useState(false);

    const triggerLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-8 flex flex-col items-center justify-center gap-12">
            <h1 className="text-3xl font-bold text-primary-dark">Premium Loader Showcase</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
                <div className="p-8 glass-card rounded-3xl flex flex-col items-center gap-4">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Small</p>
                    <Loading size="sm" />
                </div>
                
                <div className="p-8 glass-card rounded-3xl flex flex-col items-center gap-4">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Medium</p>
                    <Loading size="md" />
                </div>
                
                <div className="p-8 glass-card rounded-3xl flex flex-col items-center gap-4">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Large</p>
                    <Loading size="lg" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <Button text="Test Full Page Experience" onClick={triggerLoading} />
                <p className="text-xs text-neutral-400">Click to see the sexy full-page transition (3s)</p>
            </div>

            {isLoading && <Loading fullPage text="Creating a premium experience..." />}
        </div>
    );
}
