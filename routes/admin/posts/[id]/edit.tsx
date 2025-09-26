// routes/admin/posts/[id]/edit.tsx
import { AdminLayout } from "../../../../components/admin/AdminLayout.tsx";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../services/database.ts";
import { Post, Category } from "../../../../models/schema.ts";
import Editor from "../../../../islands/Editor.tsx";
import { useSignal } from "@preact/signals";

interface EditPostData {
  post: Post;
  categories: Category[];
}

export const handler: Handlers<EditPostData> = {
  async GET(req, ctx) {
    const postId = ctx.params.id;
    
    const [post, categories] = await Promise.all([
      db.getPostById(postId),
      db.getAllCategories()
    ]);
    
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }
    
    return ctx.render({ post, categories });
  },
  
  async POST(req, ctx) {
    const postId = ctx.params.id;
    
    const form = await req.formData();
    const title = form.get("title") as string;
    const content = form.get("content") as string;
    const excerpt = form.get("excerpt") as string;
    const categoryId = form.get("categoryId") as string;
    const status = form.get("status") as string;
    const slug = form.get("slug") as string;
    
    if (!title || !content || !categoryId) {
      return new Response("Missing required fields", { status: 400 });
    }
    
    const updatedPost = await db.updatePost(postId, {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      categoryId,
      status: status as 'draft' | 'published',
      seoTitle: form.get("seoTitle") as string,
      seoDescription: form.get("seoDescription") as string,
      featuredImage: form.get("featuredImage") as string,
    });
    
    if (!updatedPost) {
      return new Response("Failed to update post", { status: 500 });
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/posts",
      },
    });
  },
};

export default function AdminEditPost({ data, params }: PageProps<EditPostData>) {
  const { post, categories } = data;
  const postId = params.id;
  
  const title = useSignal(post.title);
  const content = useSignal(post.content);
  const excerpt = useSignal(post.excerpt || "");
  const categoryId = useSignal(post.categoryId.toString());
  const status = useSignal(post.status);
  const slug = useSignal(post.slug);
  const seoTitle = useSignal(post.seoTitle || "");
  const seoDescription = useSignal(post.seoDescription || "");
  const featuredImage = useSignal(post.featuredImage || "");
  
  const generateSlug = () => {
    slug.value = title.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  return (
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p class="text-gray-600">Update your blog post</p>
      </div>
      
      <form method="POST" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div class="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onInput={(e) => {
                  title.value = e.currentTarget.value;
                  generateSlug();
                }}
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter post title"
              />
            </div>
            
            {/* Slug */}
            <div>
              <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500">/</span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={slug}
                  onInput={(e) => slug.value = e.currentTarget.value}
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="url-slug"
                />
              </div>
            </div>
            
            {/* Content Editor */}
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <Editor
                content={content.value}
                onChange={(c) => {
                  content.value = c;
                  // Update hidden input value
                  const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
                  if (hiddenInput) {
                    hiddenInput.value = c;
                  }
                }}
              />
              <input type="hidden" name="content" value={content.value} />
            </div>
            
            {/* Excerpt */}
            <div>
              <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={excerpt}
                onInput={(e) => excerpt.value = e.currentTarget.value}
                rows={3}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Brief description of the post"
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div class="space-y-6">
            {/* Publish Settings */}
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => status.value = e.currentTarget.value}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <div>
                  <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => categoryId.value = e.currentTarget.value}
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id} selected={category.id === post.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* SEO Settings */}
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="seoTitle" class="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={seoTitle}
                    onInput={(e) => seoTitle.value = e.currentTarget.value}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Custom SEO title (optional)"
                  />
                </div>
                
                <div>
                  <label for="seoDescription" class="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={seoDescription}
                    onInput={(e) => seoDescription.value = e.currentTarget.value}
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="SEO meta description (optional)"
                  />
                </div>
                
                <div>
                  <label for="featuredImage" class="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    id="featuredImage"
                    name="featuredImage"
                    value={featuredImage}
                    onInput={(e) => featuredImage.value = e.currentTarget.value}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Image URL (optional)"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div class="flex flex-col gap-3">
              <button
                type="submit"
                name="status"
                value="draft"
                class="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Save Draft
              </button>
              <button
                type="submit"
                name="status"
                value="published"
                class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Update Post
              </button>
              <a
                href="/admin/posts"
                class="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Cancel
              </a>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}