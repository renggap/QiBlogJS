// routes/admin/posts/index.tsx
import { AdminLayout } from "../../../components/admin/AdminLayout.tsx";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";
import { Post, Category } from "../../../models/schema.ts";

interface PostsData {
  posts: (Post & { category: Category })[];
  categories: Category[];
}

export const handler: Handlers<PostsData> = {
  async GET(req, ctx) {
    const [allPosts, categories] = await Promise.all([
      db.getAllPosts(),
      db.getAllCategories()
    ]);
    
    // Enrich posts with category data
    const postsWithCategories = await Promise.all(
      allPosts.map(async (post) => {
        const category = await db.getCategoryById(post.categoryId);
        return { ...post, category };
      })
    );
    
    return ctx.render({
      posts: postsWithCategories,
      categories
    });
  },
};

export default function AdminPostsList({ data }: PageProps<PostsData>) {
  const { posts, categories } = data;
  
  return (
    <AdminLayout>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p class="text-gray-600 mt-1">Manage all your blog posts</p>
        </div>
        <a href="/admin/posts/new" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <span>+</span>
          <span>New Post</span>
        </a>
      </div>
      
      {/* Stats Bar */}
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span class="text-gray-600">
              Published: {posts.filter(p => p.status === 'published').length}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span class="text-gray-600">
              Drafts: {posts.filter(p => p.status === 'draft').length}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-gray-500 rounded-full"></span>
            <span class="text-gray-600">
              Total: {posts.length}
            </span>
          </div>
        </div>
      </div>
      
      {/* Posts Table */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {posts.length > 0 ? (
                posts.map(post => (
                  <tr key={post.id} class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div class="text-sm text-gray-500">
                        {post.excerpt?.substring(0, 60)}...
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {post.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <a
                          href={`/admin/posts/${post.id}/edit`}
                          class="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          Edit
                        </a>
                        <a
                          href={`/${post.category?.slug}/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} class="px-6 py-4 text-center text-gray-500">
                    No posts found. Create your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}