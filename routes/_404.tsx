// routes/_404.tsx
import { UnknownPageProps } from "$fresh/server.ts";
import { Layout } from "../components/ui/Layout.tsx";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <Layout>
      <div class="text-center py-16">
        <h1 class="text-6xl font-bold text-red-600">404</h1>
        <p class="text-xl mt-4 text-gray-700">Page not found: {url.pathname}</p>
        <a href="/" class="mt-6 inline-block text-blue-600 hover:underline">Go back home</a>
      </div>
    </Layout>
  );
}