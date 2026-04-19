"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

export default function Loading({ size = "md", text, fullPage = false }: LoadingProps) {
  const sizeMap = {
    sm: { container: 40, circle: 24, logo: 12 },
    md: { container: 80, circle: 48, logo: 24 },
    lg: { container: 120, circle: 72, logo: 36 },
  };

  const currentSize = sizeMap[size];

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative" style={{ width: currentSize.container, height: currentSize.container }}>
        {/* Main Pulsing Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer Rotating Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Central Brand Element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden border-2 border-primary/10"
            style={{ width: currentSize.circle, height: currentSize.circle }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.05, 1],
              opacity: 1
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            <motion.img 
              src="/logos/ANDINOH-FAV.jpg" 
              alt="Andinoh Logo"
              className="w-full h-full object-cover p-1"
              animate={{
                filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Elegant Loading Text */}
      {(text || size !== "sm") && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="text-primary-dark font-medium tracking-widest text-xs uppercase">
            {text || "Loading Experience"}
          </span>
          <motion.div 
            className="h-0.5 bg-secondary mt-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-[9999]"
      >
        {loaderContent}
      </motion.div>
    );
  }

  return loaderContent;
}
