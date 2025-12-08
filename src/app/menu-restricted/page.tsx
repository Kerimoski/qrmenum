import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Lock } from "lucide-react";

export default function MenuRestrictedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-300 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Erişim Sınırlandırıldı
          </h1>
          
          <p className="text-gray-600 mb-6">
            Bu restoranın menüsüne şu anda erişilemiyor.
          </p>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 text-left">
                <p className="font-semibold mb-1">Olası Sebepler:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Restoran geçici olarak hizmet vermiyor</li>
                  <li>Menü güncelleme yapılıyor</li>
                  <li>Abonelik süresi dolmuş</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Bilgi için restoran yetkilileriyle iletişime geçebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

