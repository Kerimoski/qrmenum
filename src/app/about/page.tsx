import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users, Globe, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">Hakkımızda</h1>
                        <p className="text-xl text-gray-600">
                            Restoran deneyimini dijitalleştirerek işletmeler ve müşteriler için hayatı kolaylaştırıyoruz.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-blue-600" />
                                    Misyonumuz
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Restoranların dijital dönüşümünü hızlandırarak, kağıt israfını önlemek ve temassız, hijyenik ve modern bir menü deneyimi sunmak. İşletmelerin operasyonel verimliliğini artırırken, müşterilere hızlı ve kolay bir sipariş süreci yaşatmak.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-6 h-6 text-purple-600" />
                                    Vizyonumuz
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Türkiye&apos;nin ve dünyanın önde gelen dijital menü çözümü sağlayıcısı olmak. Teknolojiyi en iyi şekilde kullanarak, restoran sektöründe standartları belirleyen, yenilikçi ve kullanıcı dostu bir platform haline gelmek.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Values */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                                Değerlerimiz
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <span className="text-gray-600"><strong>Yenilikçilik:</strong> Sürekli gelişen teknolojiyi takip eder ve uygularız.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <span className="text-gray-600"><strong>Müşteri Odaklılık:</strong> İşletmelerin ve son kullanıcıların ihtiyaçlarını ön planda tutarız.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <span className="text-gray-600"><strong>Güvenilirlik:</strong> Veri güvenliği ve hizmet sürekliliği bizim için esastır.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <span className="text-gray-600"><strong>Sürdürülebilirlik:</strong> Kağıt kullanımını azaltarak doğaya katkıda bulunuruz.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Story */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <QrCode className="w-8 h-8 text-gray-900" />
                            <h2 className="text-2xl font-bold text-gray-900">Hikayemiz</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            2024 yılında, restoran sektöründeki dijitalleşme ihtiyacını görerek yola çıktık. Geleneksel kağıt menülerin getirdiği maliyet, hijyen sorunları ve güncelleme zorluklarına karşı modern bir çözüm geliştirmek istedik.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Bugün, QR Menü olarak yüzlerce restorana hizmet veriyor, binlerce müşterinin sipariş deneyimini iyileştiriyoruz. Basit, hızlı ve etkili bir arayüz ile restoran sahiplerinin işini kolaylaştırırken, müşterilere de keyifli bir deneyim sunuyoruz.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
