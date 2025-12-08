"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { SendMailModal } from "./send-mail-modal";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface MailActionsProps {
  subscribers: Subscriber[];
}

export function MailActions({ subscribers }: MailActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // Excel verisi hazırla
      const excelData = subscribers.map((subscriber, index) => ({
        "No": index + 1,
        "Ad Soyad": subscriber.name || "-",
        "E-posta": subscriber.email,
        "Telefon": subscriber.phone || "-",
        "Mesaj": subscriber.message || "-",
        "Durum": subscriber.isActive ? "Aktif" : "Pasif",
        "Kayıt Tarihi": new Date(subscriber.createdAt).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Workbook oluştur
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Sütun genişlikleri
      ws["!cols"] = [
        { wch: 5 },   // No
        { wch: 20 },  // Ad Soyad
        { wch: 30 },  // E-posta
        { wch: 15 },  // Telefon
        { wch: 50 },  // Mesaj
        { wch: 10 },  // Durum
        { wch: 18 },  // Kayıt Tarihi
      ];

      // Worksheet'i workbook'a ekle
      XLSX.utils.book_append_sheet(wb, ws, "Mail Listesi");

      // Dosya adı
      const fileName = `mail-listesi-${new Date().toISOString().split("T")[0]}.xlsx`;

      // İndir
      XLSX.writeFile(wb, fileName);

      toast.success("Excel dosyası başarıyla indirildi!");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Excel dosyası oluşturulurken bir hata oluştu");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setIsSendModalOpen(true)}
          disabled={subscribers.length === 0}
          size="sm"
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Mail Gönder
        </Button>

        <Button
          onClick={handleExportExcel}
          disabled={isExporting || subscribers.length === 0}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              İndiriliyor...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Excel İndir ({subscribers.length})
            </>
          )}
        </Button>
      </div>

      <SendMailModal
        subscribers={subscribers}
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />
    </>
  );
}

