import { UserNav } from "@/components/auth/user-nav";
import Link from "next/link";
import { Shield, Building2, BarChart3, Settings, Users, Activity, PlusCircle, Receipt, Mail } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="p-6 border-b border-gray-700">
          <Link href="/super-admin" className="flex items-center gap-2">
            <Shield className="w-8 h-8" />
            <div>
              <div className="font-bold text-lg">Super Admin</div>
              <div className="text-xs text-gray-400">Yönetim Paneli</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/super-admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/super-admin/restaurants"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <Building2 className="w-5 h-5" />
            <span>Restoranlar</span>
          </Link>

          <Link
            href="/super-admin/restaurant-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <Receipt className="w-5 h-5" />
            <span>Restoran Yönetimi</span>
          </Link>

          <Link
            href="/super-admin/mail-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <Mail className="w-5 h-5" />
            <span>Mail Yönetimi</span>
          </Link>

          <Link
            href="/super-admin/restaurants/new"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Yeni Restoran</span>
          </Link>

          <Link
            href="/super-admin/system-status"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 hover:shadow-md transition"
          >
            <Activity className="w-5 h-5" />
            <span>Sistem Durumu</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Super Admin Panel</h1>
              <p className="text-sm text-gray-600">Sistem yönetimi</p>
            </div>
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

