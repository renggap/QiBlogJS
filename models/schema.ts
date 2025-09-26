// models/schema.ts

/**
 * Defines the structure for a blog post.
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Defines the structure for a category.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
}

/**
 * Defines the structure for a static page.
 */
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}