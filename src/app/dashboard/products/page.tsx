"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, UtensilsCrossed, X, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  name: string;
  nameEn?: string | null;
  price: number;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  price: number;
  isActive: boolean;
  category: Category;
  variants?: ProductVariant[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [variantModalProductId, setVariantModalProductId] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState({
    name: "",
    nameEn: "",
    price: "",
    isActive: true,
  });
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    price: "",
    categoryId: "",
    isActive: true,
    image: "",
  });

  // Verileri yükle
  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Güncelle
        await fetch(`/api/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Yeni ekle
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error("Ürün kaydetme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ürün sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      loadData();
    } catch (error) {
      console.error("Ürün silme hatası:", error);
    }
  };

  // Düzenlemeye başla
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    const productImage = (product as any).image || "";
    setFormData({
      name: product.name,
      nameEn: product.nameEn || "",
      description: product.description || "",
      descriptionEn: product.descriptionEn || "",
      price: product.price.toString(),
      categoryId: product.category.id,
      isActive: product.isActive,
      image: productImage,
    });
    setImagePreview(productImage); // Mevcut görseli önizleme olarak göster
    setShowForm(true);
  };

  // Form sıfırla
  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      price: "",
      categoryId: "",
      isActive: true,
      image: "",
    });
    setImagePreview(null);
    setShowForm(false);
    setEditingId(null);
  };

  const resetVariantForm = () => {
    setVariantForm({
      name: "",
      nameEn: "",
      price: "",
      isActive: true,
    });
    setVariantModalProductId(null);
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantModalProductId) return;

    if (!variantForm.name || !variantForm.price) {
      alert("Lütfen varyant adı ve fiyat girin.");
      return;
    }

    try {
      await fetch("/api/product-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: variantModalProductId,
          name: variantForm.name,
          nameEn: variantForm.nameEn,
          price: variantForm.price,
          isActive: variantForm.isActive,
        }),
      });

      resetVariantForm();
      loadData();
    } catch (error) {
      console.error("Varyant kaydetme hatası:", error);
      alert("Varyant kaydedilemedi.");
    }
  };

  const handleVariantDelete = async (id: string) => {
    if (!confirm("Bu varyantı silmek istediğinizden emin misiniz?")) return;

    try {
      await fetch(`/api/product-variants/${id}`, {
        method: "DELETE",
      });
      loadData();
    } catch (error) {
      console.error("Varyant silme hatası:", error);
      alert("Varyant silinemedi.");
    }
  };

  // Dosya yükleme
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (150MB)
    const maxSize = 150 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("❌ Dosya çok büyük! Maksimum 150MB yükleyebilirsiniz.");
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Sadece resim dosyaları yükleyebilirsiniz (JPG, PNG, GIF, WEBP)");
      return;
    }

    setIsUploading(true);

    try {
      // Önizleme göster
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Dosyayı sunucuya yükle
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Yükleme başarısız");
      }

      const data = await response.json();

      // Form data'ya URL'i kaydet
      setFormData({ ...formData, image: data.url });

      alert("✅ Görsel başarıyla yüklendi!");
    } catch (error: any) {
      alert(`❌ Hata: ${error.message}`);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // AI ile Açıklama Oluştur
  const handleGenerateAI = async () => {
    if (!formData.name || formData.name.length < 2) {
      alert("Lütfen önce geçerli bir ürün adı girin (Türkçe).");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: formData.name }),
      });

      if (!response.ok) {
        throw new Error("AI yanıt veremedi");
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        nameEn: data.nameEn,
        description: data.descriptionTr,
        descriptionEn: data.descriptionEn
      }));

    } catch (error) {
      console.error("AI Hatası:", error);
      alert("AI açıklama oluşturamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Hızlı kategoriler oluştur
  const createQuickCategories = async () => {
    const defaultCategories = [
      { name: "Başlangıçlar", nameEn: "Appetizers", order: 1 },
      { name: "Ana Yemekler", nameEn: "Main Courses", order: 2 },
      { name: "İçecekler", nameEn: "Beverages", order: 3 },
      { name: "Tatlılar", nameEn: "Desserts", order: 4 },
    ];

    try {
      for (const cat of defaultCategories) {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cat),
        });
      }
      alert("✅ Varsayılan kategoriler oluşturuldu!");
      loadData();
    } catch (error) {
      alert("❌ Kategoriler oluşturulurken hata oluştu");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ürünler</h1>
          <p className="text-gray-600">Menü ürünlerinizi yönetin</p>
        </div>
        <Button onClick={() => {
          if (categories.length === 0) {
            window.location.href = '/dashboard/categories';
          } else {
            if (showForm) {
              // Form zaten açıksa kapat
              resetForm();
            } else {
              // Form kapalıysa aç ve temizle
              setFormData({
                name: "",
                nameEn: "",
                description: "",
                descriptionEn: "",
                price: "",
                categoryId: categories.length > 0 ? categories[0].id : "", // İlk kategoriyi seç
                isActive: true,
                image: "",
              });
              setEditingId(null);
              setShowForm(true);
            }
          }
        }}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Formu Kapat" : "Yeni Ürün"}
        </Button>
      </div>

      {/* Kategori uyarısı */}
      {categories.length === 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <UtensilsCrossed className="w-5 h-5" />
              Kategoriye İhtiyacınız Var
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              Ürün ekleyebilmek için önce en az bir kategori oluşturmalısınız.
              Kategoriler menünüzü organize etmenize yardımcı olur.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.location.href = '/dashboard/categories'} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                İlk Kategorimi Oluştur
              </Button>
              <Button variant="outline" onClick={() => {
                // Hızlı kategoriler oluştur
                createQuickCategories();
              }}>
                Hızlı Başlat (Varsayılan Kategoriler)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Ürün Düzenle" : "Yeni Ürün"}</CardTitle>
            <CardDescription>
              Ürün bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Ürün Adı TR */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ürün Adı (Türkçe) *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Izgara Tavuk"
                    required
                  />
                </div>

                {/* Ürün Adı EN */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name (English)
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g: Grilled Chicken"
                  />
                </div>
              </div>

              {/* AI Button */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !formData.name}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sihirli Açıklamalar Yazılıyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI ile Açıklama & Çeviri Oluştur
                    </>
                  )}
                </Button>
              </div>

              {/* Açıklama TR */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Açıklama (Türkçe)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ürün açıklaması..."
                />
              </div>

              {/* Açıklama EN */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (English)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Product description..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Fiyat */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fiyat (₺) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kategori *
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Seçiniz...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ürün Görseli */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ürün Görseli
                </label>

                {/* Dosya Yükleme */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Yükleniyor...</p>
                      </>
                    ) : imagePreview || formData.image ? (
                      <div className="space-y-2">
                        <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-lg border">
                          <Image
                            src={imagePreview || formData.image}
                            alt="Önizleme"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                            setFormData({ ...formData, image: "" });
                          }}
                        >
                          Görseli Kaldır
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UtensilsCrossed className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Görsel Yükle
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, GIF, WEBP - Maks. 150MB
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  💡 İpucu: Yüksek kaliteli ürün görselleri müşterilerin ilgisini çeker!
                </p>
              </div>

              {/* Aktif/Pasif */}
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Ürün aktif (menüde görünsün)
                </label>
              </div>

              {/* Bilgi Notu */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 İpucu:</strong> Ürünlerinize açıklayıcı bilgiler ekleyin.
                  Müşteriler detaylı açıklamaları tercih eder!
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    editingId ? "Güncelle" : "Ürün Ekle"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UtensilsCrossed className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz ürün yok</h3>
            <p className="text-gray-600 mb-6">İlk ürününüzü oluşturun</p>
            {categories.length > 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ürün Ekle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Ürün Görseli */}
                  <div className="flex-shrink-0">
                    {(product as any).image ? (
                      <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                        <Image
                          src={(product as any).image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold truncate">{product.name}</h3>
                          {product.isActive ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Aktif</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Pasif</Badge>
                          )}
                        </div>
                        {product.nameEn && (
                          <p className="text-xs text-gray-500 mb-2">{product.nameEn}</p>
                        )}
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {/* Varyantlar */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-500">Varyantlar</p>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((variant) => (
                            <div
                              key={variant.id}
                              className="flex items-center gap-2 px-2 py-1 rounded-full border text-xs bg-gray-50"
                            >
                              <span className="font-medium text-gray-800">
                                {variant.name}
                              </span>
                              <span className="text-blue-600 font-semibold">
                                ₺{Number(variant.price).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleVariantDelete(variant.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-blue-600 text-xl">
                          ₺{Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                          {product.category.name}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(product)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVariantModalProductId(product.id);
                            setVariantForm({
                              name: "",
                              nameEn: "",
                              price: "",
                              isActive: true,
                            });
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Varyant Ekle
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Varyant ekleme alanı (sayfanın altında basit modal/section gibi) */}
      {variantModalProductId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Yeni Varyant Ekle</h2>
              <button
                type="button"
                onClick={resetVariantForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVariantSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Varyant Adı (TR) *
                  </label>
                  <Input
                    value={variantForm.name}
                    onChange={(e) =>
                      setVariantForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Örn: Küçük, Orta, Büyük"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Variant Name (EN)
                  </label>
                  <Input
                    value={variantForm.nameEn}
                    onChange={(e) =>
                      setVariantForm((prev) => ({ ...prev, nameEn: e.target.value }))
                    }
                    placeholder="e.g. Small, Medium, Large"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fiyat (₺) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variantForm.price}
                  onChange={(e) =>
                    setVariantForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                <input
                  type="checkbox"
                  id="variant-isActive"
                  checked={variantForm.isActive}
                  onChange={(e) =>
                    setVariantForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="variant-isActive" className="text-sm">
                  Varyant aktif (menüde görünsün)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetVariantForm}
                >
                  İptal
                </Button>
                <Button type="submit">
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

