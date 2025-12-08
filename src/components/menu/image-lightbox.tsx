"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div
                className="relative w-full max-w-4xl max-h-[90vh] aspect-square md:aspect-video rounded-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    unoptimized
                />
            </div>
        </div>
    );
}
