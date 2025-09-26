// components/ui/Layout.tsx
import { ComponentChildren } from "preact";

export function Layout({ children }: { children: ComponentChildren }) {
  return (
    <div class="min-h-screen modern-gradient">
      {/* Floating background elements */}
      <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div class="absolute w-20 h-20 rounded-full bg-white bg-opacity-10 animate-float" style={{ top: "20%", left: "10%", animationDelay: "0s" }}></div>
        <div class="absolute w-16 h-16 rounded-full bg-white bg-opacity-10 animate-float" style={{ top: "60%", right: "15%", animationDelay: "2s" }}></div>
        <div class="absolute w-24 h-24 rounded-full bg-white bg-opacity-10 animate-float" style={{ bottom: "20%", left: "15%", animationDelay: "4s" }}></div>
      </div>

      <div class="max-w-7xl mx-auto p-8">
        <header class="text-center mb-12">
          <h1 class="flex items-center justify-center gap-2 mb-4">
            <a href="/" class="flex items-center gap-2 no-underline text-inherit">
              <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
              <span class="text-white text-2xl font-semibold">QiBlogJS</span>
            </a>
          </h1>
          <p class="text-white text-opacity-80 text-lg">A modern blogging platform powered by Fresh & Deno</p>
        </header>
        
        <main class="py-6">
          {children}
        </main>
        
        <footer class="py-6 text-center text-white text-opacity-70 text-sm mt-12">
          &copy; {new Date().getFullYear()} QiBlogJS. Powered by Fresh & Deno.
        </footer>
      </div>
    </div>
  );
}