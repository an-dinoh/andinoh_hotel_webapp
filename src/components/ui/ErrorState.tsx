"use client";

import React from "react";
import Button from "./Button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorState({
    title = "Unable to load data",
    message = "An error occurred while fetching the information. This could be due to a temporary server issue or network problem.",
    onRetry,
    className = "",
}: ErrorStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 ${className}`}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title}
            </h3>

            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                {message}
            </p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="secondary"
                    className="flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}
