"use client";

import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

interface MobilePreviewProps {
    menuUrl: string;
    restaurantName: string;
    flag: string;
}

export function MobilePreview({ menuUrl, restaurantName, flag }: MobilePreviewProps) {
    return (
        <div className="flex flex-col items-center gap-4">
            {/* iPhone-style Frame */}
            <div className="relative">
                {/* Phone Frame */}
                <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10" />

                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                        <iframe
                            src={menuUrl}
                            className="w-full h-full border-0"
                            title={`${restaurantName} Demo Menu`}
                        />
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                </div>
            </div>

            {/* Info */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{flag}</span>
                    <h4 className="text-lg font-bold">{restaurantName}</h4>
                </div>
            </div>
        </div>
    );
}
