
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Wifi, Instagram, Facebook, Globe } from "lucide-react";
import { CategoryNavigation } from "@/components/menu/category-navigation";
import { ProductImage } from "@/components/menu/product-image";
import { AutoplayVideo } from "@/components/menu/autoplay-video";
import { useLanguage } from "@/components/menu/language-context";
import { LanguageSwitcher } from "@/components/menu/language-switcher";

interface MenuContentProps {
    restaurant: any; // Type definition can be improved if used commonly
}

export function MenuContent({ restaurant }: MenuContentProps) {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm relative">
                <div className="container mx-auto px-4 py-5">

                    <div className="text-center">
                        <h1 className="text-3xl font-semibold mb-1 text-gray-900">
                            {restaurant.name}
                        </h1>
                        {restaurant.description && (
                            <p className="text-gray-500 text-base">{restaurant.description}</p>
                        )}
                    </div>

                    {/* Category Navigation */}
                    <CategoryNavigation categories={restaurant.categories} />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 min-h-screen">
                {/* Tanıtım Videosu */}
                {restaurant.videoUrl && (
                    <div className="mb-8">
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                            <AutoplayVideo src={restaurant.videoUrl} />
                        </div>
                    </div>
                )}

                {/* Info Bar (WiFi + Language) */}
                {(restaurant.wifiPassword || restaurant.showLanguageOption) && (
                    <div className="mb-8">
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <div className="flex h-16 divide-x divide-gray-100">
                                {/* Left Side: WiFi or Language Info */}
                                <div className={`flex-1 flex items-center px-4 min-w-0 transition-colors ${restaurant.wifiPassword ? 'bg-blue-50/30 text-blue-900' : 'bg-white text-gray-700'}`}>
                                    {restaurant.wifiPassword ? (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                <Wifi className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-[10px] uppercase tracking-wider text-blue-600/70 font-bold mb-0.5">
                                                    {t("WiFi Şifresi", "WiFi Password")}
                                                </div>
                                                <div className="font-bold text-lg leading-none truncate pr-2">
                                                    {restaurant.wifiPassword}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                                                    {t("Dil Seçimi", "Language")}
                                                </div>
                                                <div className="font-semibold text-sm text-gray-900 leading-none">
                                                    {t("Lütfen Dil Seçiniz", "Select Language")}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Language Switcher */}
                                {restaurant.showLanguageOption && (
                                    <div className="w-[110px] sm:w-[140px] flex-shrink-0 bg-white">
                                        <LanguageSwitcher />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Products by Category */}
                {restaurant.products.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <UtensilsCrossed className="h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {t("Menü Hazırlanıyor", "Menu Coming Soon")}
                            </h3>
                            <p className="text-gray-600">
                                {t("Yakında lezzetli ürünlerimizle buradayız!", "We will be here soon with our delicious products!")}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    restaurant.categories.map((category: any) => {
                        const categoryProducts = restaurant.products.filter(
                            (p: any) => p.category.id === category.id
                        );

                        if (categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} id={`category-${category.id}`} className="mb-12 scroll-mt-32">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 inline-block border-b-2 border-gray-300 pb-2">
                                        {t(category.name, category.nameEn)}
                                    </h2>
                                </div>
                                <div className="grid gap-5 mt-6">
                                    {categoryProducts.map((product: any) => (
                                        <Card
                                            key={product.id}
                                            className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden"
                                        >
                                            <CardContent className="p-0">
                                                {/* Her ekranda yatay layout */}
                                                <div className="flex flex-row">
                                                    {/* Ürün Görseli - Sol (Her ekranda) */}
                                                    {product.image ? (
                                                        <div className="relative w-1/3 sm:w-1/4 lg:w-1/5 h-32 sm:h-40 md:h-48 overflow-hidden bg-gray-50 flex-shrink-0">
                                                            <ProductImage
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-1/3 sm:w-1/4 lg:w-1/5 bg-gray-50 flex-shrink-0" />
                                                    )}

                                                    {/* Ürün Bilgileri - Sağ */}
                                                    <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between min-w-0">
                                                        <div>
                                                            <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                                                {t(product.name, product.nameEn)}
                                                            </h3>
                                                            {(product.description || (language === 'en' && product.descriptionEn)) && (
                                                                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 md:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
                                                                    {t(product.description || "", product.descriptionEn)}
                                                                </p>
                                                            )}

                                                            {/* Varyantlar */}
                                                            {Array.isArray(product.variants) &&
                                                                product.variants.length > 0 && (
                                                                    <div className="mb-2 sm:mb-3 md:mb-4">
                                                                        <p className="text-xs font-medium text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide">
                                                                            {t("Seçenekler", "Options")}
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                                                            {product.variants.map(
                                                                                (variant: any) => (
                                                                                    <div
                                                                                        key={variant.id}
                                                                                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-gray-200 hover:border-gray-300 transition-colors text-xs sm:text-sm bg-white hover:bg-gray-50 flex items-center gap-1 sm:gap-2"
                                                                                    >
                                                                                        <span className="font-normal text-gray-700 truncate">
                                                                                            {t(variant.name, variant.nameEn)}
                                                                                        </span>
                                                                                        <span className="text-gray-900 font-medium whitespace-nowrap">
                                                                                            ₺{Number(variant.price).toFixed(2)}
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>

                                                        {/* Fiyat */}
                                                        <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                                            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                                                                ₺{Number(product.price).toFixed(2)}
                                                            </div>
                                                            {product.image && (
                                                                <div className="text-xs text-gray-400 hidden sm:block">
                                                                    {t("Görseli büyütmek için tıklayın", "Click to enlarge image")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            {/* Footer */}
            <footer className="border-t py-8 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center gap-4">
                        {/* Social Media */}
                        {restaurant.socialMedia && (
                            <div className="flex gap-6">
                                {restaurant.socialMedia.instagram && (
                                    <a
                                        href={`https://instagram.com/${restaurant.socialMedia.instagram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        <span>@{restaurant.socialMedia.instagram}</span>
                                    </a>
                                )}
                                {restaurant.socialMedia.facebook && (
                                    <a
                                        href={`https://facebook.com/${restaurant.socialMedia.facebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                                    >
                                        <Facebook className="w-5 h-5" />
                                        <span>{restaurant.socialMedia.facebook}</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Powered By */}
                        <a 
                            href="https://qrmenurestoranim.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Powered by <span className="font-semibold text-foreground">QR Menü</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
