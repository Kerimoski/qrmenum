'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: 'border-2',
                    title: 'font-semibold',
                    description: 'text-sm',
                    success: 'border-green-500 bg-green-50',
                    error: 'border-red-500 bg-red-50',
                    warning: 'border-orange-500 bg-orange-50',
                    info: 'border-blue-500 bg-blue-50',
                },
            }}
        />
    );
}
