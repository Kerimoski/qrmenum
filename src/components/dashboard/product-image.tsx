"use client";

import { UtensilsCrossed } from "lucide-react";
import Image from "next/image";

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
            <div className={`relative ${sizeClasses[size]} overflow-hidden rounded-md`}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-md flex items-center justify-center`}>
            <UtensilsCrossed className={`${iconSizes[size]} text-gray-600`} />
        </div>
    );
}
