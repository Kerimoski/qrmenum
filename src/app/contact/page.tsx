"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "Satın Alma",
        message: "",
        subscribeNewsletter: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, subject: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
                setFormData({ name: "", email: "", phone: "", subject: "Satın Alma", message: "", subscribeNewsletter: false });
            } else {
                toast.error(data.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir bağlantı hatası oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">

                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">İletişim</h1>
                        <p className="text-xl text-gray-600">
                            Sorularınız, önerileriniz veya iş birliği için bizimle iletişime geçin.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bize Mesaj Gönderin</CardTitle>
                                <CardDescription>
                                    Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ad Soyad</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Adınız Soyadınız"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-posta</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="ornek@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="05XX XXX XX XX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Konu</Label>
                                        <Select value={formData.subject} onValueChange={handleSelectChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Konu seçiniz" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Satın Alma">Satın Alma</SelectItem>
                                                <SelectItem value="Teknik Destek">Teknik Destek</SelectItem>
                                                <SelectItem value="Soru Sor">Soru Sor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mesaj</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Mesajınızı buraya yazın..."
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 bg-gray-50">
                                        <Checkbox
                                            id="newsletter"
                                            checked={formData.subscribeNewsletter}
                                            onCheckedChange={(checked) => 
                                                setFormData(prev => ({ ...prev, subscribeNewsletter: checked as boolean }))
                                            }
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="newsletter"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                Tanıtım ve kampanyalardan haberdar olmak istiyorum
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                Yeni özellikler, özel fiyatlandırma ve kampanyalar hakkında e-posta ile bilgilendirilmek istiyorum.
                                            </p>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Mesajı Gönder
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Ana Sayfaya Dön Butonu */}
                        <div className="mt-8 text-center">
                            <Link href="/">
                                <Button variant="outline" size="lg" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
