'use client';

import { create } from 'zustand';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    variant: 'default' | 'destructive';
    onConfirm: () => void;
    onCancel: () => void;
}

const useConfirmDialog = create<ConfirmDialogState & {
    openDialog: (config: Partial<ConfirmDialogState>) => void;
    closeDialog: () => void;
}>((set) => ({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Onayla',
    cancelText: 'İptal',
    variant: 'default',
    onConfirm: () => { },
    onCancel: () => { },
    openDialog: (config) => set((state) => ({ ...state, ...config, isOpen: true })),
    closeDialog: () => set({ isOpen: false }),
}));

export function ConfirmDialog() {
    const {
        isOpen,
        title,
        description,
        confirmText,
        cancelText,
        variant,
        onConfirm,
        onCancel,
        closeDialog,
    } = useConfirmDialog();

    const handleConfirm = () => {
        onConfirm();
        closeDialog();
    };

    const handleCancel = () => {
        onCancel();
        closeDialog();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={closeDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={
                            variant === 'destructive'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-900 hover:bg-gray-800'
                        }
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Helper function for easy usage
export function confirm(config: Partial<ConfirmDialogState>): Promise<boolean> {
    return new Promise((resolve) => {
        useConfirmDialog.getState().openDialog({
            ...config,
            onConfirm: () => {
                config.onConfirm?.();
                resolve(true);
            },
            onCancel: () => {
                config.onCancel?.();
                resolve(false);
            },
        });
    });
}
