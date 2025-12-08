"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriberRowProps {
  subscriber: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;
  };
}

export function SubscriberRow({ subscriber }: SubscriberRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`${subscriber.email} adresini silmek istediğinize emin misiniz?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/super-admin/newsletter/${subscriber.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Silme işlemi başarısız");
      }

      toast.success("Abone başarıyla silindi");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{subscriber.name || "İsimsiz"}</h3>
          <Badge variant={subscriber.isActive ? "default" : "secondary"}>
            {subscriber.isActive ? "Aktif" : "Pasif"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <a href={`mailto:${subscriber.email}`} className="hover:underline">
              {subscriber.email}
            </a>
          </div>

          {subscriber.phone && (
            <div className="flex items-center gap-1">
              <span>📱</span>
              <a href={`tel:${subscriber.phone}`} className="hover:underline">
                {subscriber.phone}
              </a>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(subscriber.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

