"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Loader2, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriptionManagerProps {
  restaurant: {
    id: string;
    name: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
    lastPaymentDate?: Date | null;
    isPendingPayment?: boolean;
  };
}

export function SubscriptionManager({ restaurant }: SubscriptionManagerProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [plan, setPlan] = useState(restaurant.subscriptionPlan);
  const [startDate, setStartDate] = useState(
    new Date(restaurant.subscriptionStartDate).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(restaurant.subscriptionEndDate).toISOString().split("T")[0]
  );
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleExtend = async (months: number, autoAmount: number) => {
    setIsUpdating(true);
    try {
      const currentEnd = new Date(restaurant.subscriptionEndDate);
      const newEnd = new Date(currentEnd);
      newEnd.setMonth(newEnd.getMonth() + months);

      const response = await fetch(`/api/super-admin/restaurants/${restaurant.id}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extend",
          months,
          newEndDate: newEnd.toISOString(),
          amount: autoAmount,
        }),
      });

      if (!response.ok) throw new Error("Güncelleme başarısız");

      toast.success(`Abonelik ${months === 12 ? '1 yıl' : '1 ay'} uzatıldı! (${autoAmount}₺)`);
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/super-admin/restaurants/${restaurant.id}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "markPaid",
        }),
      });

      if (!response.ok) throw new Error("İşlem başarısız");

      toast.success("Ödeme alındı olarak işaretlendi!");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async () => {
    if (!amount || !startDate || !endDate) {
      toast.error("Tüm alanları doldurun");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/super-admin/restaurants/${restaurant.id}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          plan,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          amount: parseFloat(amount),
          notes,
        }),
      });

      if (!response.ok) throw new Error("Güncelleme başarısız");

      toast.success("Abonelik güncellendi!");
      router.refresh();
      
      // Form'u temizle
      setAmount("");
      setNotes("");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Abonelik İşlemleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ödeme Durumu */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Ödeme Durumu
            </Label>
            {restaurant.isPendingPayment ? (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Bekleyen Ödeme
              </Badge>
            ) : (
              <Badge className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ödeme Alındı
              </Badge>
            )}
          </div>
          
          {restaurant.lastPaymentDate && (
            <p className="text-sm text-muted-foreground">
              Son Ödeme: {new Date(restaurant.lastPaymentDate).toLocaleDateString('tr-TR')}
            </p>
          )}
          
          <Button
            onClick={handleMarkAsPaid}
            disabled={isUpdating || !restaurant.isPendingPayment}
            className="w-full"
            variant={restaurant.isPendingPayment ? "default" : "secondary"}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ödeme Alındı Olarak İşaretle
              </>
            )}
          </Button>
        </div>

        {/* Hızlı Uzatma */}
        <div className="space-y-3 pt-6 border-t">
          <Label className="text-base font-semibold">Hızlı Uzatma</Label>
          <p className="text-sm text-muted-foreground">
            Mevcut bitiş: {new Date(restaurant.subscriptionEndDate).toLocaleDateString('tr-TR')}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleExtend(1, 750)}
              disabled={isUpdating}
              variant="outline"
              className="h-auto py-4 flex-col items-start gap-1"
            >
              <span className="font-semibold">+1 Ay</span>
              <span className="text-xs text-muted-foreground">750₺</span>
            </Button>
            <Button
              onClick={() => handleExtend(12, 3000)}
              disabled={isUpdating}
              variant="outline"
              className="h-auto py-4 flex-col items-start gap-1"
            >
              <span className="font-semibold">+1 Yıl</span>
              <span className="text-xs text-muted-foreground">3.000₺</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <Label className="text-base font-semibold">Manuel Güncelleme</Label>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Paket</Label>
              <Select 
                value={plan} 
                onValueChange={(value) => {
                  setPlan(value);
                  // Pakete göre fiyatı otomatik ayarla
                  if (value === "MONTHLY") {
                    setAmount("750");
                  } else if (value === "YEARLY") {
                    setAmount("3000");
                  } else {
                    setAmount("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Aylık - 750₺/ay</SelectItem>
                  <SelectItem value="YEARLY">Yıllık - 3.000₺/yıl</SelectItem>
                  <SelectItem value="ENTERPRISE">Kurumsal - Özel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tutar (₺)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={plan === "MONTHLY" ? "750" : plan === "YEARLY" ? "3000" : "Özel fiyat"}
              />
            </div>

            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Not (Opsiyonel)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Manuel uzatıldı, Özel indirim uygulandı"
                rows={3}
              />
            </div>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="mt-4 w-full"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              "Güncelle"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

