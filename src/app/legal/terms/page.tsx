import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, UserCheck, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">Kullanım Koşulları</h1>
                        <p className="text-xl text-gray-600">
                            Hizmetlerimizi kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz.
                        </p>
                        <p className="text-sm text-gray-500">Son Güncelleme: 05.12.2025</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="w-6 h-6 text-blue-600" />
                                1. Hizmetin Kabulü
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                QR Menü hizmetlerine erişerek veya kullanarak, bu Kullanım Koşulları&apos;nı kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayınız.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="w-6 h-6 text-purple-600" />
                                2. Kullanıcı Sorumlulukları
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Hesap bilgilerinizin güvenliğini sağlamak sizin sorumluluğunuzdadır.</li>
                                <li>Hizmetlerimizi yasalara aykırı amaçlarla kullanamazsınız.</li>
                                <li>Sisteme zarar verecek veya diğer kullanıcıların deneyimini olumsuz etkileyecek faaliyetlerde bulunamazsınız.</li>
                                <li>Sağladığınız içeriklerin (menü öğeleri, görseller vb.) telif haklarına uygun olduğunu garanti edersiniz.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                                3. Hizmet Değişiklikleri ve Fesih
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                QR Menü, herhangi bir zamanda, önceden bildirimde bulunmaksızın hizmetin bir kısmını veya tamamını değiştirme, askıya alma veya sonlandırma hakkını saklı tutar. Ayrıca, bu koşullara uymamanız durumunda hesabınızı askıya alabilir veya kapatabiliriz.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="w-6 h-6 text-green-600" />
                                4. Sorumluluk Reddi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                Hizmetlerimiz &quot;olduğu gibi&quot; sunulmaktadır. QR Menü, hizmetin kesintisiz, hatasız veya tamamen güvenli olacağını garanti etmez. Doğrudan veya dolaylı olarak ortaya çıkabilecek herhangi bir zarardan sorumlu tutulamaz.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 text-center">
                        <p className="text-gray-700">
                            Bu koşullarla ilgili sorularınız için <a href="mailto:legal@qrmenu.com" className="text-blue-600 font-semibold hover:underline">legal@qrmenu.com</a> adresinden bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
