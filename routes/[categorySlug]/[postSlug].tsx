// routes/[categorySlug]/[postSlug].tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../../components/ui/Layout.tsx";
import { SEOHead } from "../../components/seo/SEOHead.tsx";
import { db } from "../../services/database.ts";
import { Post, Category } from "../../models/schema.ts";
import { generateArticleSchema } from "../../utils/schema.ts";
import { config } from "../../config/env.ts";

interface PostData {
  post: Post;
  category: Category;
  previousPost?: Post | null;
  nextPost?: Post | null;
}

export const handler: Handlers<PostData> = {
  async GET(req, ctx) {
    const { postSlug } = ctx.params;
    
    const post = await db.getPost(postSlug);
    if (!post || post.status !== 'published') {
      return ctx.renderNotFound();
    }

    const category = await db.getCategoryById(post.categoryId);
    if (!category) {
      // Should not happen if seeding is correct, but handle missing category
      return ctx.renderNotFound();
    }

    // Get previous and next posts
    const [previousPost, nextPost] = await Promise.all([
      db.getPreviousPost(post.categoryId, post.id),
      db.getNextPost(post.categoryId, post.id)
    ]);

    return ctx.render({ post, category, previousPost, nextPost });
  },
};

export default function PostPage({ data, url }: PageProps<PostData>) {
  const { post, category, previousPost, nextPost } = data;
  
  const baseUrl = config.baseUrl || `${url.protocol}//${url.host}`;
  
  const schema = generateArticleSchema(post, category, baseUrl);

  return (
    <Layout>
      <SEOHead
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        url={`${baseUrl}/${category.slug}/${post.slug}`}
        image={post.featuredImage ? `${baseUrl}${post.featuredImage}` : undefined}
        type="article"
        schema={schema}
      />
      <main class="py-6">
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
            <h1 class="text-3xl md:text-4xl font-bold pr-12">{post.title}</h1>
            <div class="check-icon">
              ✓
            </div>
          </div>
          
          <div class="p-6 md:p-8">
            <div class="flex items-center text-gray-500 text-sm mb-6">
              <span class="flex items-center gap-1">
                📅 {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span class="mx-2">•</span>
              <a href={`/category/${category.slug}`} class="text-indigo-600 hover:text-indigo-800 transition-colors">
                {category.name}
              </a>
            </div>
            
            <div class="prose prose-lg max-w-none text-gray-700">
              <p class="text-lg leading-relaxed">{post.content}</p>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center">
                {previousPost && (
                  <a
                    href={`/${category.slug}/${previousPost.slug}`}
                    class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors group"
                  >
                    <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span class="font-medium">Previous: {previousPost.title}</span>
                  </a>
                )}
                
                {nextPost && (
                  <a
                    href={`/${category.slug}/${nextPost.slug}`}
                    class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors group ml-auto"
                  >
                    <span class="font-medium">Next: {nextPost.title}</span>
                    <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}