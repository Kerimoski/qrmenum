"use client";

import { UtensilsCrossed } from "lucide-react";

interface ProductImageProps {
    src?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
};

const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
};

export function ProductImage({ src, alt, size = 'md' }: ProductImageProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`${sizeClasses[size]} rounded-md object-cover`}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-md flex items-center justify-center`}>
            <UtensilsCrossed className={`${iconSizes[size]} text-gray-600`} />
        </div>
    );
}
