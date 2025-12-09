"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function ImpersonationBanner() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  if (!session?.user?.isImpersonating) {
    return null;
  }

  const handleExitImpersonation = async () => {
    setIsExiting(true);
    try {
      // Session'ı güncelle ve impersonation'ı kaldır
      await update({
        isImpersonating: false,
        originalUserId: undefined,
        originalUserName: undefined,
        impersonatedUserId: undefined,
        restaurantId: undefined,
      });

      toast.success("Süper admin moduna geri dönüldü");
      
      // Süper admin paneline yönlendir
      router.push("/super-admin");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg lg:ml-64 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 animate-pulse" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Süper Admin Modu
            </span>
            <span className="text-sm opacity-90">
              • {session.user.originalUserName} olarak {session.user.name} restoranını yönetiyorsunuz
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExitImpersonation}
          disabled={isExiting}
          className="bg-white text-red-600 hover:bg-red-50 border-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isExiting ? "Çıkılıyor..." : "Süper Admin Panele Dön"}
        </Button>
      </div>
    </div>
  );
}

