import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">Gizlilik Politikası</h1>
                        <p className="text-xl text-gray-600">
                            Verilerinizin güvenliği bizim için önemlidir.
                        </p>
                        <p className="text-sm text-gray-500">Son Güncelleme: 05.12.2025</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-6 h-6 text-blue-600" />
                                1. Toplanan Veriler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                Hizmetlerimizi kullanırken aşağıdaki türde bilgileri toplayabiliriz:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Kişisel Bilgiler:</strong> Ad, soyad, e-posta adresi, telefon numarası gibi kayıt sırasında sağladığınız bilgiler.</li>
                                <li><strong>İşletme Bilgileri:</strong> Restoran adı, adresi, menü içerikleri ve fiyat bilgileri.</li>
                                <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar ve kullanım süreleri.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-6 h-6 text-purple-600" />
                                2. Verilerin Kullanımı
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>Topladığımız verileri şu amaçlarla kullanırız:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Hizmetlerimizi sağlamak ve sürdürmek.</li>
                                <li>Hesabınızı yönetmek ve teknik destek sağlamak.</li>
                                <li>Hizmet kalitesini artırmak için analizler yapmak.</li>
                                <li>Yasal yükümlülükleri yerine getirmek.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-6 h-6 text-green-600" />
                                3. Veri Güvenliği
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                Verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz. SSL şifreleme, güvenli sunucu altyapısı ve düzenli güvenlik taramaları ile bilgilerinizi koruyoruz. Ancak, internet üzerinden yapılan hiçbir iletimin %100 güvenli olmadığını unutmayınız.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-orange-600" />
                                4. Çerezler (Cookies)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                Deneyiminizi geliştirmek için çerezler kullanıyoruz. Çerezler, tarayıcınız tarafından cihazınızda saklanan küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz, ancak bu durumda bazı özellikler düzgün çalışmayabilir.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                        <p className="text-gray-700">
                            Gizlilik politikamızla ilgili sorularınız için <a href="mailto:info@qrmenu.com" className="text-blue-600 font-semibold hover:underline">info@qrmenu.com</a> adresinden bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
