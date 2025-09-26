// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../components/ui/Layout.tsx";
import { PostList } from "../components/ui/PostList.tsx";
import { SEOHead } from "../components/seo/SEOHead.tsx";
import BlogInteractions from "../islands/BlogInteractions.tsx";
import { Post } from "../models/schema.ts";
import { db } from "../services/database.ts";
import { config } from "../config/env.ts";

interface PostWithCategorySlug extends Post {
  categorySlug: string;
}

interface HomeData {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

export const handler: Handlers<HomeData> = {
  async GET(req: Request, ctx: any) {
    // Get page number from URL query parameters
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
    const postsPerPage = 9; // Show 9 posts per page (3x3 grid)
    
    // Fetch all posts (simplified, should be paginated and filtered by status='published')
    const allPosts = await db.getAllPosts();
    const publishedPosts = allPosts.filter(p => p.status === 'published');
    
    // Calculate pagination
    const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = publishedPosts.slice(startIndex, endIndex);

    // NOTE: Temporarily hardcoding categorySlug to bypass potential KV lookup issues during development.
    const posts: PostWithCategorySlug[] = paginatedPosts.map(post => {
      return {
        ...post,
        categorySlug: 'technology' // Hardcoded slug for testing links
      };
    });

    // Placeholder for base URL until config is fully implemented
    const baseUrl = config.baseUrl || `${url.protocol}//${url.host}`;

    return ctx.render({
      posts,
      currentPage,
      totalPages
    });
  },
};

export default function HomePage({ data, url }: PageProps<HomeData>) {
  const baseUrl = config.baseUrl || `${url.protocol}//${url.host}`;
  const { posts, currentPage, totalPages } = data;
  
  // Handle card click (for BlogInteractions)
  const handleCardClick = (title: string) => {
    console.log(`Card clicked: ${title}`);
    // In a real app, this might navigate to the post or trigger analytics
  };
  
  // Handle page change (for BlogInteractions)
  const handlePageChange = (page: number) => {
    // Navigate to the new page
    const newUrl = new URL(url);
    newUrl.searchParams.set("page", page.toString());
    window.location.href = newUrl.toString();
  };
  
  return (
    <Layout>
      <SEOHead
        title="QiBlogJS - Minimalist Deno Fresh CMS"
        description="A fast, SEO-friendly, minimalist CMS built on Deno and Fresh framework."
        url={baseUrl}
      />
      
      {/* Floating elements for parallax effect */}
      <div class="floating-elements">
        <div class="floating-circle"></div>
        <div class="floating-circle"></div>
        <div class="floating-circle"></div>
      </div>
      
      {/* Blog posts grid */}
      <PostList posts={posts} />
      
      {/* Pagination component */}
      {totalPages > 1 && (
        <div class="pagination">
          <button
            class="page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              class={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            class="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
      
      {/* Blog interactions island component */}
      <BlogInteractions
        onCardClick={handleCardClick}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </Layout>
  );
}