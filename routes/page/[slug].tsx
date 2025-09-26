// routes/page/[slug].tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../../components/ui/Layout.tsx";
import { SEOHead } from "../../components/seo/SEOHead.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    const slug = ctx.params.slug;
    // TODO: Fetch page data
    return ctx.render({ slug });
  },
};

export default function StaticPage({ data, url }: PageProps<{ slug: string }>) {
  return (
    <Layout>
      <SEOHead 
        title={`Page: ${data.slug}`}
        description={`Static page content for ${data.slug}.`}
        url={url.href}
      />
      <h1 class="text-3xl font-bold mb-6">Static Page: {data.slug}</h1>
      <p>This is a static page. Content coming soon.</p>
    </Layout>
  );
}