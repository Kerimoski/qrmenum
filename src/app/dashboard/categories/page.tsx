"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, FolderTree } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  order: number;
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", nameEn: "" });

  // Kategorileri yükle
  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Kategori yükleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Yeni kategori ekle veya güncelle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Güncelle
        await fetch(`/api/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Yeni ekle
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setFormData({ name: "", nameEn: "" });
      setShowForm(false);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error("Kategori kaydetme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kategori sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      loadCategories();
    } catch (error) {
      console.error("Kategori silme hatası:", error);
    }
  };

  // Düzenlemeye başla
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, nameEn: category.nameEn || "" });
    setShowForm(true);
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
          <h1 className="text-3xl font-bold mb-2">Kategoriler</h1>
          <p className="text-gray-600">Menü kategorilerinizi yönetin</p>
        </div>
        <Button onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: "", nameEn: "" });
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Kategori Düzenle" : "Yeni Kategori"}</CardTitle>
            <CardDescription>
              Kategori bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori Adı (Türkçe) *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Ana Yemekler"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name (English)
                </label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g: Main Courses"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", nameEn: "" });
                  }}
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
                    editingId ? "Güncelle" : "Kategori Ekle"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderTree className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz kategori yok</h3>
            <p className="text-gray-600 mb-6">İlk kategorinizi oluşturun</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Kategori Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    {category.nameEn && (
                      <p className="text-sm text-gray-600">{category.nameEn}</p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {category._count.products} ürün
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(category)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

