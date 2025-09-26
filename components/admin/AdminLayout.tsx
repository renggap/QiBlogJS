// components/admin/AdminLayout.tsx
import { ComponentChildren } from "preact";
import { AdminHeader } from "./AdminHeader.tsx";
import { AdminSidebar } from "./AdminSidebar.tsx";

export function AdminLayout({ children }: { children: ComponentChildren }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminSidebar />
      {/* Main content area, offset by sidebar width (64) and header height (16) */}
      <main class="ml-64 pt-16 p-6">
        <div class="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}