"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface SendMailModalProps {
  subscribers: Subscriber[];
  isOpen: boolean;
  onClose: () => void;
}

export function SendMailModal({ subscribers, isOpen, onClose }: SendMailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  // Sadece aktif aboneler
  const activeSubscribers = subscribers.filter(s => s.isActive);

  // İlk açılışta tüm aktif aboneleri seç
  useState(() => {
    if (isOpen && selectAll) {
      setSelectedEmails(activeSubscribers.map(s => s.email));
    }
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedEmails(activeSubscribers.map(s => s.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleToggleEmail = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Lütfen konu başlığı girin");
      return;
    }
    if (!message.trim()) {
      toast.error("Lütfen mesaj içeriği girin");
      return;
    }
    if (selectedEmails.length === 0) {
      toast.error("Lütfen en az bir alıcı seçin");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/super-admin/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          recipients: selectedEmails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mail gönderilemedi");
      }

      toast.success(`${selectedEmails.length} kişiye mail gönderildi!`);
      setSubject("");
      setMessage("");
      setSelectedEmails([]);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Mail gönderilirken bir hata oluştu");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Toplu Mail Gönder
          </DialogTitle>
          <DialogDescription>
            Seçili abonelere tanıtım maili gönderin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Konu */}
          <div className="space-y-2">
            <Label htmlFor="subject">Konu</Label>
            <Input
              id="subject"
              placeholder="Örn: Yeni Özellikler ve İndirimler"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Mesaj */}
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              placeholder="Mail içeriğinizi buraya yazın..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            <p className="text-xs text-muted-foreground">
              Mesajınız HTML formatında gönderilecektir
            </p>
          </div>

          {/* Alıcı Seçimi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Alıcılar ({selectedEmails.length}/{activeSubscribers.length})</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  disabled={isSending}
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Tümünü Seç
                </label>
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {activeSubscribers.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Aktif abone yok
                </p>
              ) : (
                activeSubscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      id={subscriber.id}
                      checked={selectedEmails.includes(subscriber.email)}
                      onCheckedChange={() => handleToggleEmail(subscriber.email)}
                      disabled={isSending}
                    />
                    <label
                      htmlFor={subscriber.id}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <div className="font-medium">{subscriber.name || "İsimsiz"}</div>
                      <div className="text-muted-foreground">{subscriber.email}</div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gönder Butonu */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
            >
              İptal
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || selectedEmails.length === 0}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gönder ({selectedEmails.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

