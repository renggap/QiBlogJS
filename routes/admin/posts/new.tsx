// routes/admin/posts/new.tsx
import { AdminLayout } from "../../../components/admin/AdminLayout.tsx";
import Editor from "../../../islands/Editor.tsx";
import { useSignal } from "@preact/signals";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";
import { Category } from "../../../models/schema.ts";

interface NewPostData {
  categories: Category[];
}

export const handler: Handlers<NewPostData> = {
  async GET(req, ctx) {
    const categories = await db.getAllCategories();
    return ctx.render({ categories });
  },
  
  async POST(req, ctx) {
    const form = await req.formData();
    const title = form.get("title") as string;
    const content = form.get("content") as string;
    const excerpt = form.get("excerpt") as string;
    const categoryId = form.get("categoryId") as string;
    const status = form.get("status") as string;
    const slug = form.get("slug") as string || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (!title || !content || !categoryId) {
      return new Response("Missing required fields", { status: 400 });
    }
    
    const post = await db.createPost({
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
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/posts",
      },
    });
  },
};

export default function AdminCreatePost({ data }: PageProps<NewPostData>) {
  const { categories } = data;
  const title = useSignal("");
  const content = useSignal("");
  const excerpt = useSignal("");
  const categoryId = useSignal("");
  const status = useSignal("draft");
  const slug = useSignal("");
  const seoTitle = useSignal("");
  const seoDescription = useSignal("");
  const featuredImage = useSignal("");
  const errors = useSignal<Record<string, string>>({});
  
  const generateSlug = () => {
    slug.value = title.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  const generateSEO = () => {
    if (!seoTitle.value && title.value) {
      seoTitle.value = title.value;
    }
    
    if (!seoDescription.value) {
      if (excerpt.value) {
        seoDescription.value = excerpt.value.substring(0, 160);
      } else if (content.value) {
        seoDescription.value = content.value.substring(0, 160);
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.value.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!content.value.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (!categoryId.value) {
      newErrors.categoryId = "Category is required";
    }
    
    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Auto-generate slug if empty
    if (!slug.value) {
      generateSlug();
    }
    
    // Auto-generate SEO fields if empty
    generateSEO();
    
    // Update form fields before submission
    const form = e.target as HTMLFormElement;
    const hiddenSlug = form.querySelector('input[name="slug"]') as HTMLInputElement;
    const hiddenSeoTitle = form.querySelector('input[name="seoTitle"]') as HTMLInputElement;
    const hiddenSeoDescription = form.querySelector('input[name="seoDescription"]') as HTMLInputElement;
    
    if (hiddenSlug) hiddenSlug.value = slug.value;
    if (hiddenSeoTitle) hiddenSeoTitle.value = seoTitle.value;
    if (hiddenSeoDescription) hiddenSeoDescription.value = seoDescription.value;
    
    form.submit();
  };
  
  return (
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p class="text-gray-600">Write and publish your new blog post</p>
      </div>
      
      <form method="POST" onSubmit={handleSubmit} class="space-y-6">
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
                class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.value.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter post title"
              />
              {errors.value.title && (
                <p class="mt-1 text-sm text-red-600">{errors.value.title}</p>
              )}
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
              <div class={`border rounded-lg overflow-hidden ${
                errors.value.content ? 'border-red-500' : 'border-gray-300'
              }`}>
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
              </div>
              <input type="hidden" name="content" value={content.value} />
              {errors.value.content && (
                <p class="mt-1 text-sm text-red-600">{errors.value.content}</p>
              )}
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
                    class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.value.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.value.categoryId && (
                    <p class="mt-1 text-sm text-red-600">{errors.value.categoryId}</p>
                  )}
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
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}