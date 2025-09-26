// utils/schema.ts
import { Post, Category, Page } from "../models/schema.ts";

/**
 * Generates Schema.org JSON-LD markup for an Article.
 */
export function generateArticleSchema(post: Post, category: Category, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seoTitle || post.title,
    "description": post.seoDescription || post.excerpt,
    "image": post.featuredImage ? `${baseUrl}${post.featuredImage}` : undefined,
    "author": {
      "@type": "Person",
      "name": "QiBlogJS Author" // Placeholder: Should be configurable
    },
    "publisher": {
      "@type": "Organization",
      "name": "QiBlogJS", // Placeholder: Should be configurable
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png` // Placeholder
      }
    },
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "articleSection": category.name,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${category.slug}/${post.slug}`
    },
    "url": `${baseUrl}/${category.slug}/${post.slug}`
  };
}

interface WebPageData {
  title: string;
  description: string;
  url: string;
}

/**
 * Generates Schema.org JSON-LD markup for a WebPage (e.g., static page or homepage).
 */
export function generateWebPageSchema(page: Page | WebPageData, baseUrl: string) {
  const data: WebPageData = 'slug' in page
    ? {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.content.substring(0, 150),
      url: `${baseUrl}/page/${page.slug}`,
    }
    : page;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.description,
    "url": data.url,
  };
}