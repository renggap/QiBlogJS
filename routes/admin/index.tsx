// routes/admin/index.tsx
import { AdminLayout } from "../../components/admin/AdminLayout.tsx";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { db } from "../../services/database.ts";

interface DashboardData {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalCategories: number;
  };
  recentPosts: any[];
}

export const handler: Handlers<DashboardData> = {
  async GET(req, ctx) {
    const allPosts = await db.getAllPosts();
    const categories = await db.getAllCategories();
    
    const stats = {
      totalPosts: allPosts.length,
      publishedPosts: allPosts.filter(p => p.status === 'published').length,
      draftPosts: allPosts.filter(p => p.status === 'draft').length,
      totalCategories: categories.length,
    };
    
    const recentPosts = allPosts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    
    return ctx.render({ stats, recentPosts });
  },
};

export default function AdminDashboard({ data }: PageProps<DashboardData>) {
  const { stats, recentPosts } = data;
  
  return (
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p class="text-gray-600">Welcome back! Here's what's happening with your blog.</p>
      </div>
      
      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              📝
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Posts</p>
              <p class="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              ✅
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Published</p>
              <p class="text-2xl font-semibold text-gray-900">{stats.publishedPosts}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              📝
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Drafts</p>
              <p class="text-2xl font-semibold text-gray-900">{stats.draftPosts}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              📁
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Categories</p>
              <p class="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Posts */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Posts</h2>
        </div>
        <div class="p-6">
          {recentPosts.length > 0 ? (
            <div class="space-y-4">
              {recentPosts.map(post => (
                <div key={post.id} class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h3 class="font-medium text-gray-900">{post.title}</h3>
                    <p class="text-sm text-gray-500">
                      {post.status === 'published' ? 'Published' : 'Draft'} • {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <a
                      href={`/admin/posts/${post.id}/edit`}
                      class="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p class="text-gray-500 text-center py-8">No posts yet. Create your first post!</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}