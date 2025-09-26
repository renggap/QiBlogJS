// services/database.ts
import { Post, Category, Page } from "../models/schema.ts";

// Utility function to generate a unique ID (e.g., UUID)
// For simplicity, we'll use a placeholder function here.
// In a real application, you might use a library like 'uuid'.
function generateId(): string {
  return crypto.randomUUID();
}

export class DatabaseService {
  private kv!: Deno.Kv;
  
  /** Initializes the Deno KV connection. */
  async init() {
    // Note: Deno.openKv() without arguments opens the default KV store.
    this.kv = await Deno.openKv();
  }
  
  // --- Post Operations ---
  
  /** Creates a new post and stores it in KV. */
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store by ID (primary key)
    await this.kv.set(["posts", newPost.id], newPost);
    // Store by slug (secondary index for retrieval)
    await this.kv.set(["posts_by_slug", newPost.slug], newPost.id);
    
    return newPost;
  }
  
  /** Retrieves a post by its slug. */
  async getPost(slug: string): Promise<Post | null> {
    const idResult = await this.kv.get<string>(["posts_by_slug", slug]);
    if (!idResult.value) return null;
    
    const postResult = await this.kv.get<Post>(["posts", idResult.value]);
    return postResult.value;
  }
  
  /** Retrieves a post by its ID. */
  async getPostById(id: string): Promise<Post | null> {
    const postResult = await this.kv.get<Post>(["posts", id]);
    return postResult.value;
  }
  
  /** Updates an existing post. */
  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const postResult = await this.kv.get<Post>(["posts", id]);
    if (!postResult.value) return null;
    
    const updatedPost: Post = {
      ...postResult.value,
      ...updates,
      updatedAt: new Date(),
    };
    
    await this.kv.set(["posts", id], updatedPost);
    
    // If slug changed, update the slug index (omitted for simplicity, but required in production)
    
    return updatedPost;
  }
  
  /** Deletes a post by ID. */
  async deletePost(id: string): Promise<void> {
    const postResult = await this.kv.get<Post>(["posts", id]);
    if (postResult.value) {
      // Delete by ID
      await this.kv.delete(["posts", id]);
      // Delete by slug
      await this.kv.delete(["posts_by_slug", postResult.value.slug]);
    }
  }
  
  // --- Category Operations ---
  
  /** Creates a new category. */
  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: new Date(),
    };
    
    await this.kv.set(["categories", newCategory.id], newCategory);
    await this.kv.set(["categories_by_slug", newCategory.slug], newCategory.id);
    
    return newCategory;
  }
  
  /** Retrieves all categories. (Simplified for now, full implementation would handle pagination/indexing) */
  async getCategories(): Promise<Category[]> {
    const entries = this.kv.list<Category>({ prefix: ["categories"] });
    const categories: Category[] = [];
    for await (const entry of entries) {
      if (entry.value) categories.push(entry.value);
    }
    return categories;
  }
  /** Retrieves a category by its ID. */
  async getCategoryById(id: string): Promise<Category | null> {
    const categoryResult = await this.kv.get<Category>(["categories", id]);
    return categoryResult.value;
  }
  
  /** Retrieves a category by its slug. */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const idResult = await this.kv.get<string>(["categories_by_slug", slug]);
    if (!idResult.value) return null;
    
    const categoryResult = await this.kv.get<Category>(["categories", idResult.value]);
    return categoryResult.value;
  }
  
  // --- Page Operations ---
  
  /** Creates a new static page. */
  async createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const newPage: Page = {
      ...page,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await this.kv.set(["pages", newPage.id], newPage);
    await this.kv.set(["pages_by_slug", newPage.slug], newPage.id);
    
    return newPage;
  }
  
  /** Retrieves a static page by its slug. */
  async getPage(slug: string): Promise<Page | null> {
    const idResult = await this.kv.get<string>(["pages_by_slug", slug]);
    if (!idResult.value) return null;
    
    const pageResult = await this.kv.get<Page>(["pages", idResult.value]);
    return pageResult.value;
  }
  
  // --- Utility/Global Operations (Needed for Sitemap/API) ---
  
  /** Retrieves all posts (simplified). */
  async getAllPosts(): Promise<Post[]> {
    const entries = this.kv.list<Post>({ prefix: ["posts"] });
    const posts: Post[] = [];
    for await (const entry of entries) {
      if (entry.value) posts.push(entry.value);
    }
    return posts;
  }
  
  /** Retrieves posts by category with pagination. */
  async getPostsByCategory(categoryId: string, page: number, limit: number): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    const categoryPosts = allPosts
      .filter(post => post.categoryId === categoryId && post.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return categoryPosts.slice(startIndex, endIndex);
  }
  
  /** Gets the total count of published posts in a category. */
  async getPostsCountByCategory(categoryId: string): Promise<number> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(post => post.categoryId === categoryId && post.status === 'published').length;
  }
  
  /** Gets the previous post in the same category. */
  async getPreviousPost(categoryId: string, currentPostId: string): Promise<Post | null> {
    const allPosts = await this.getAllPosts();
    const categoryPosts = allPosts
      .filter(post => post.categoryId === categoryId && post.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const currentIndex = categoryPosts.findIndex(post => post.id === currentPostId);
    if (currentIndex === -1 || currentIndex >= categoryPosts.length - 1) {
      return null;
    }
    
    return categoryPosts[currentIndex + 1];
  }
  
  /** Gets the next post in the same category. */
  async getNextPost(categoryId: string, currentPostId: string): Promise<Post | null> {
    const allPosts = await this.getAllPosts();
    const categoryPosts = allPosts
      .filter(post => post.categoryId === categoryId && post.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const currentIndex = categoryPosts.findIndex(post => post.id === currentPostId);
    if (currentIndex <= 0) {
      return null;
    }
    
    return categoryPosts[currentIndex - 1];
  }
  
  /** Retrieves all pages (simplified). */
  async getAllPages(): Promise<Page[]> {
    const entries = this.kv.list<Page>({ prefix: ["pages"] });
    const pages: Page[] = [];
    for await (const entry of entries) {
      if (entry.value) pages.push(entry.value);
    }
    return pages;
  }
  
  /** Retrieves all categories (alias for getCategories). */
  async getAllCategories(): Promise<Category[]> {
    return this.getCategories();
  }
}

// Export a singleton instance for easy access throughout the application
export const db = new DatabaseService();
await db.init();