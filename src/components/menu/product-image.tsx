"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ImageLightbox } from "./image-lightbox";

interface ProductImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
    const [hasError, setHasError] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // ESC key to close lightbox
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
        };

        if (lightboxOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [lightboxOpen]);

    if (hasError) {
        return null;
    }

    return (
        <>
            <div className={`relative w-full h-full ${className}`}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxOpen(true)}
                    onError={() => setHasError(true)}
                    unoptimized
                />
            </div>

            <ImageLightbox
                src={src}
                alt={alt}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}
