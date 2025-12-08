"use client";

import { UserNav } from "@/components/auth/user-nav";
import Link from "next/link";
import { QrCode, LayoutDashboard, UtensilsCrossed, FolderTree, Settings, BarChart3, Menu, X, Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DemoWarning } from "@/components/dashboard/demo-warning";
import { ImpersonationBanner } from "@/components/dashboard/impersonation-banner";
import { SubscriptionBanner } from "@/components/dashboard/subscription-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Impersonation Banner */}
      <ImpersonationBanner />
      
      {/* Subscription Banner */}
      <SubscriptionBanner />
      
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          <span className="font-bold">QR Menü</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserNav />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 border-b hidden lg:block">
          <Link href="/dashboard" className="flex items-center gap-2">
            <QrCode className="w-8 h-8" />
            <div>
              <div className="font-bold text-lg">QR Menü</div>
              <div className="text-xs text-gray-500">Restoran Paneli</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2 mt-16 lg:mt-0">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/qr-code"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <QrCode className="w-5 h-5" />
            <span>QR Kod</span>
          </Link>

          <Link
            href="/dashboard/products"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Ürünler</span>
          </Link>

          <Link
            href="/dashboard/categories"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <FolderTree className="w-5 h-5" />
            <span>Kategoriler</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analitik</span>
          </Link>

          <Link
            href="/dashboard/subscription"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Crown className="w-5 h-5" />
            <span>Paketim</span>
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Ayarlar</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hoş Geldiniz</h1>
              <p className="text-sm text-gray-600">Menünüzü yönetin</p>
            </div>
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <DemoWarning />
          {children}
        </main>
      </div>
    </div>
  );
}
