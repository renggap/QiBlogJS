// routes/category/[slug].tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../../components/ui/Layout.tsx";
import { SEOHead } from "../../components/seo/SEOHead.tsx";
import { PostList } from "../../components/ui/PostList.tsx";
import BlogInteractions from "../../islands/BlogInteractions.tsx";
import { db } from "../../services/database.ts";
import { Post, Category } from "../../models/schema.ts";
import { config } from "../../config/env.ts";

interface CategoryData {
  category: Category;
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

export const handler: Handlers<CategoryData> = {
  async GET(req, ctx) {
    const slug = ctx.params.slug;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const postsPerPage = 9;
    
    // Get category by slug
    const category = await db.getCategoryBySlug(slug);
    if (!category) {
      return ctx.renderNotFound();
    }

    // Get posts for this category
    const posts = await db.getPostsByCategory(category.id, page, postsPerPage);
    const totalPosts = await db.getPostsCountByCategory(category.id);
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return ctx.render({
      category,
      posts,
      currentPage: page,
      totalPages
    });
  },
};

export default function CategoryPage({ data, url }: PageProps<CategoryData>) {
  const { category, posts, currentPage, totalPages } = data;
  const baseUrl = config.baseUrl || `${url.protocol}//${url.host}`;

  // Add categorySlug to each post for the PostList component
  const postsWithCategory = posts.map(post => ({
    ...post,
    categorySlug: category.slug
  }));

  return (
    <Layout>
      <SEOHead
        title={category.seoTitle || `${category.name} Category`}
        description={category.seoDescription || `Posts in the ${category.name} category.`}
        url={`${baseUrl}/category/${category.slug}`}
      />
      
      <div class="py-6">
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
            <span class="text-lg font-semibold">{category.name}</span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">{category.name}</h2>
          <p class="text-white text-opacity-80 max-w-2xl mx-auto">
            {category.description || `Explore all posts in the ${category.name} category.`}
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <PostList posts={postsWithCategory} categorySlug={category.slug} />
            
            {totalPages > 1 && (
              <div class="pagination">
                <button
                  class="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => window.location.href = `/category/${category.slug}?page=${currentPage - 1}`}
                >
                  ← Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    class={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => window.location.href = `/category/${category.slug}?page=${pageNum}`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  class="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => window.location.href = `/category/${category.slug}?page=${currentPage + 1}`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div class="text-center py-12">
            <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
              <p class="text-gray-600">There are no posts in this category yet.</p>
            </div>
          </div>
        )}
      </div>
      
      <BlogInteractions />
    </Layout>
  );
}