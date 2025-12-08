"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Users, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { RestaurantCard } from "@/components/super-admin/restaurant-card";
import { RestaurantDetailsModal } from "@/components/super-admin/restaurant-details-modal";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);

  const loadRestaurants = async () => {
    try {
      const response = await fetch('/api/super-admin/restaurants');
      const data = await response.json();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Restoran yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Restoranlar</h1>
            <p className="text-gray-600">
              Tüm restoranları görüntüleyin ve yönetin
            </p>
          </div>
          <Link href="/super-admin/restaurants/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Restoran
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Restoran</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {restaurants.filter(r => r.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {restaurants.reduce((acc, r) => acc + r._count.views, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurants List */}
        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Henüz restoran yok</h3>
              <p className="text-gray-600 mb-6">İlk restoranınızı oluşturun</p>
              <Link href="/super-admin/restaurants/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Restoran Ekle
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onStatusChange={loadRestaurants}
                onViewDetails={() => setSelectedRestaurant(restaurant)}
                onDelete={loadRestaurants}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detay Modalı */}
      {selectedRestaurant && (
        <RestaurantDetailsModal
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          restaurant={selectedRestaurant}
        />
      )}
    </>
  );
}
