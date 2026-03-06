"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, FilePlus, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
    images: File[];
    onChange: (images: File[]) => void;
    error?: string;
    maxFiles?: number;
}

export default function ImageUpload({ images, onChange, error, maxFiles = 10 }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            const remainingSlots = maxFiles - images.length;
            const filesToAdd = files.slice(0, remainingSlots);
            onChange([...images, ...filesToAdd]);
        }
    }, [images, onChange, maxFiles]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const remainingSlots = maxFiles - images.length;
            const filesToAdd = files.slice(0, remainingSlots);
            onChange([...images, ...filesToAdd]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer overflow-hidden transition-all duration-300 rounded-3xl border-2 border-dashed
          ${isDragging
                        ? 'border-[#0F75BD] bg-[#E6EFF6] scale-[0.99]'
                        : 'border-[#C8CFD5] bg-[#FAFAFB] hover:border-[#0F75BD]'
                    }
          flex flex-col items-center justify-center p-12 min-h-[300px]`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {isDragging ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center text-[#0F75BD]"
                        >
                            <MousePointer2 className="w-16 h-16 mb-4 animate-bounce" />
                            <p className="text-xl font-bold">Drop to Upload</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-[#E6EFF6] rounded-2xl flex items-center justify-center mb-6 text-[#0F75BD] group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-10 h-10" />
                            </div>
                            <p className="text-xl font-bold text-gray-800 mb-2">Drag and drop your images</p>
                            <p className="text-sm text-gray-500 max-w-[250px]">
                                Support high-quality photos for your room. You can select up to {maxFiles} images.
                            </p>
                            <div className="mt-8 px-6 py-2.5 bg-[#0F75BD] text-white rounded-xl text-sm font-semibold group-hover:bg-blue-600 transition-colors">
                                Browse Files
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Abstract background elements for a "premium" feel */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ImageIcon className="w-32 h-32 -mr-8 -mt-8 rotate-12" />
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-500 text-sm font-medium px-4"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.div>
            )}

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    <AnimatePresence>
                        {images.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ y: -5 }}
                                className="relative aspect-square rounded-2xl overflow-hidden border border-[#C8CFD5] bg-white group/item"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform scale-0 group-hover/item:scale-100 duration-300 delay-75"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {index === 0 && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-[#0F75BD] text-[10px] font-bold text-white rounded-lg flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        PRIMARY
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
