"use client";

import { useSession } from "next-auth/react";
import { isDemoUser } from "@/lib/demo-check";
import { AlertCircle } from "lucide-react";

export function DemoWarning() {
    const { data: session } = useSession();

    if (!session?.user?.email || !isDemoUser(session.user.email)) {
        return null;
    }

    return (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4 rounded shadow-sm flex items-start role='alert'">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-bold">Demo Modundasınız</p>
                <p className="text-sm">
                    Şu anda demo hesabı ile giriş yaptınız. Yaptığınız değişiklikler (ekleme, düzenleme, silme)
                    <strong> kaydedilmeyebilir veya engellenebilir</strong>.
                    Sadece görüntüleme yetkiniz bulunmaktadır.
                </p>
            </div>
        </div>
    );
}
