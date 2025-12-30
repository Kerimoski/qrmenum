import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, CheckCircle2, XCircle } from "lucide-react";
import { MailActions } from "@/components/super-admin/mail-actions";
import { SubscriberRow } from "@/components/super-admin/subscriber-row";

export default async function MailManagementPage() {
  // Tüm newsletter abonelerini getir
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // İstatistikler
  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.isActive).length,
    inactive: subscribers.filter(s => !s.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mail Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Tanıtım mail listesi ve aboneleri yönetin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Abone</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tüm kayıtlı mail adresleri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Aboneler</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Mail almayı kabul edenler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasif Aboneler</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Abonelikten çıkanlar</p>
          </CardContent>
        </Card>
      </div>

      {/* Abone Listesi */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Abone Listesi
              </CardTitle>
              <CardDescription>
                İletişim formundan tanıtım maillerine abone olan kullanıcılar
              </CardDescription>
            </div>
            <MailActions subscribers={subscribers} />
          </div>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">Henüz abone yok</p>
              <p className="text-sm text-muted-foreground mt-1">
                İletişim formundaki checkbox ile kullanıcılar abone olabilir
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscribers.map((subscriber) => (
                <SubscriberRow key={subscriber.id} subscriber={subscriber} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

