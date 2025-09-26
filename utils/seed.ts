// utils/seed.ts
import { db } from "../services/database.ts";
import { Category, Post, Page } from "../models/schema.ts";

/**
 * Seeds the database with initial dummy data if no posts exist.
 */
export async function seedDatabase() {
  const existingPosts = await db.getAllPosts();
  if (existingPosts.length > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Seeding database with dummy data...");

  // 1. Create Category
  const techCategory: Omit<Category, 'id' | 'createdAt'> = {
    name: "Technology",
    slug: "technology",
    description: "Articles about Deno, Fresh, and modern web development.",
    seoTitle: "Technology Blog Posts",
    seoDescription: "Latest tech articles.",
  };
  const category = await db.createCategory(techCategory);
  console.log(`Created category: ${category.name}`);

  // 2. Create Posts
  const post1: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
    title: "Getting Started with Deno KV",
    slug: "getting-started-with-deno-kv",
    content: "This is the full content of the first blog post, detailing how to use Deno KV for persistence in Fresh applications.",
    excerpt: "A quick guide to setting up and using Deno KV, the built-in key-value store.",
    categoryId: category.id,
    status: 'published',
    seoTitle: "Deno KV Tutorial",
    seoDescription: "Learn Deno KV basics.",
    featuredImage: "/static/images/deno-kv.jpg",
  };
  await db.createPost(post1);

  const post2: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
    title: "Building a Minimalist CMS with Fresh",
    slug: "building-a-minimalist-cms-with-fresh",
    content: "The second post covers the architecture and design choices behind QiBlogJS.",
    excerpt: "Exploring the minimalist approach to CMS development using the Fresh framework.",
    categoryId: category.id,
    status: 'published',
    seoTitle: "Fresh CMS Architecture",
    seoDescription: "Minimalist CMS design.",
    featuredImage: "/static/images/fresh-cms.jpg",
  };
  await db.createPost(post2);
  
  // 3. Create Static Page
  const aboutPage: Omit<Page, 'id' | 'createdAt' | 'updatedAt'> = {
    title: "About QiBlogJS",
    slug: "about",
    content: "QiBlogJS is a fast, SEO-friendly, minimalist CMS built on Deno and Fresh.",
    status: 'published',
    seoTitle: "About Us",
    seoDescription: "Learn about the project.",
  };
  await db.createPage(aboutPage);

  console.log("Database seeding complete.");
}