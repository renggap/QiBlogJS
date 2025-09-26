// components/admin/AdminSidebar.tsx
export function AdminSidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Posts', href: '/admin/posts', icon: '📝' },
    { name: 'Categories', href: '/admin/categories', icon: '📁' },
    { name: 'Pages', href: '/admin/pages', icon: '📄' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside class="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 z-20 shadow-xl">
      <div class="p-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Navigation
        </h3>
        <nav class="space-y-1">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-200 group"
            >
              <span class="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">A</span>
          </div>
          <div>
            <p class="text-sm font-medium text-white">Admin User</p>
            <p class="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}