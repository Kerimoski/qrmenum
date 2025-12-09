"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Crown, Info } from "lucide-react";
import Link from "next/link";

interface SubscriptionData {
  plan: string;
  status: string;
  endDate: string;
}

export function SubscriptionBanner() {
  const { data: session } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.restaurantId || session.user.isImpersonating) {
      setLoading(false);
      return;
    }

    fetch(`/api/restaurant/subscription`)
      .then(res => res.json())
      .then(data => {
        if (data.subscription) {
          setSubscriptionData(data.subscription);
        }
      })
      .catch(err => console.error("Subscription fetch error:", err))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading || !subscriptionData) {
    return null;
  }

  const { plan, status, endDate } = subscriptionData;

  const now = new Date();
  const daysLeft = Math.ceil((new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0 || status === "EXPIRED";

  if (isExpired) {
    return null; // Expired durumunda middleware zaten redirect edecek
  }

  const getPlanName = () => {
    switch (plan) {
      case "MONTHLY":
        return "Aylık Paket";
      case "YEARLY":
        return "Yıllık Paket";
      case "ENTERPRISE":
        return "Kurumsal Paket";
      default:
        return plan;
    }
  };

  const getPlanBadge = () => {
    switch (plan) {
      case "MONTHLY":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aylık</Badge>;
      case "YEARLY":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Yıllık</Badge>;
      case "ENTERPRISE":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="w-3 h-3 mr-1 inline" />
          Kurumsal
        </Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  // Uyarı seviyesi
  const isWarning = daysLeft <= 7;
  const isCritical = daysLeft <= 3;

  if (isCritical || isWarning) {
    return (
      <div className={`${isCritical ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-orange-500 to-yellow-500'} text-white px-4 py-3 shadow-md lg:ml-64 z-50 relative`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold">
                {isCritical ? "Dikkat!" : "Uyarı"}
              </span>
              <span className="text-sm opacity-90">
                Paketinizin süresi {daysLeft === 0 ? "bugün" : `${daysLeft} gün içinde`} dolacak
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-orange-600 hover:bg-orange-50 border-white"
            asChild
          >
            <Link href="/dashboard/subscription">
              Paketi Yönet
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Normal durum - bilgilendirme banner
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b px-4 py-2 lg:ml-64 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            {getPlanBadge()}
            <span className="text-gray-700">•</span>
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft} gün kaldı
            </span>
          </div>
        </div>
        <Link href="/dashboard/subscription" className="text-gray-600 hover:text-gray-900 text-xs underline">
          Detaylar
        </Link>
      </div>
    </div>
  );
}

