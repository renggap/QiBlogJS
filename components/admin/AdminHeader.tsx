// components/admin/AdminHeader.tsx
export function AdminHeader() {
  return (
    <header class="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg z-10">
      <div class="flex items-center justify-between h-full px-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">Q</span>
          </div>
          <div class="text-xl font-semibold text-white">Admin Dashboard</div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-indigo-200">Admin</span>
          <a
            href="/admin/logout"
            class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md text-sm font-medium transition-all duration-200"
          >
            Logout
          </a>
        </div>
      </div>
    </header>
  );
}