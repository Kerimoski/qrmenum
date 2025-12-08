import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, User, ShieldAlert, Scale } from "lucide-react";

export default function KVKKPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">KVKK Aydınlatma Metni</h1>
                        <p className="text-xl text-gray-600">
                            Kişisel Verilerin Korunması Kanunu kapsamında haklarınız ve sorumluluklarımız.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileCheck className="w-6 h-6 text-blue-600" />
                                1. Veri Sorumlusu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz; veri sorumlusu olarak QR Menü tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-6 h-6 text-purple-600" />
                                2. Kişisel Verilerin İşlenme Amacı
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>Toplanan kişisel verileriniz, aşağıdaki amaçlarla işlenmektedir:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması.</li>
                                <li>Şirketimizin ve Şirketimizle iş ilişkisi içerisinde olan ilgili kişilerin hukuki ve ticari güvenliğinin temini.</li>
                                <li>Şirketimizin ticari ve iş stratejilerinin belirlenmesi ve uygulanması.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6 text-orange-600" />
                                3. Kişisel Veri Sahibinin Hakları
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>KVKK&apos;nın 11. maddesi uyarınca veri sahipleri olarak aşağıdaki haklara sahipsiniz:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Kişisel veri işlenip işlenmediğini öğrenme.</li>
                                <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme.</li>
                                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
                                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme.</li>
                                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="w-6 h-6 text-green-600" />
                                4. Başvuru Usulü
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-600">
                            <p>
                                Yukarıda belirtilen haklarınızı kullanmak için kimliğinizi tespit edici gerekli bilgiler ile birlikte talebinizi, yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da bize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresini kullanmak suretiyle <a href="mailto:kvkk@qrmenu.com" className="text-blue-600 font-semibold hover:underline">kvkk@qrmenu.com</a> adresine iletebilirsiniz.
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
