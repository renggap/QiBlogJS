// services/seo.ts
import { Post, Category, Page } from "../models/schema.ts";

interface MetaData {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'article' | 'website';
}

export class SEOService {
  
  /**
   * Generates meta tag data structure. Actual HTML generation happens in SEOHead component.
   */
  generateMetaTags(data: MetaData): MetaData {
    // In a real scenario, this might handle defaults, sanitization, or truncation.
    return data;
  }
  
  /**
   * Generates Schema.org JSON-LD markup structure.
   */
  generateSchemaMarkup(type: 'Article' | 'WebPage' | 'Category', data: any): Record<string, any> {
    // This is a placeholder. Actual implementation will be in utils/schema.ts (Phase 6.2)
    return {
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    };
  }
  
  /**
   * Generates the XML sitemap content based on posts, pages, and categories.
   */
  generateSitemap({ baseUrl, posts, pages, categories }: {
    baseUrl: string;
    posts: Post[];
    pages: Page[];
    categories: Category[];
  }): string {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    const addUrl = (loc: string, lastmod?: Date) => {
      sitemap += `  <url>
    <loc>${baseUrl}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    };

    // 1. Homepage
    addUrl('/', new Date());

    // 2. Posts
    posts.forEach(post => {
      if (post.status === 'published') {
        addUrl(`/${post.slug}`, post.updatedAt);
      }
    });
    
    // 3. Pages
    pages.forEach(page => {
      if (page.status === 'published') {
        addUrl(`/page/${page.slug}`, page.updatedAt);
      }
    });

    // 4. Categories
    categories.forEach(category => {
      addUrl(`/category/${category.slug}`, category.createdAt);
    });

    sitemap += `</urlset>`;
    return sitemap;
  }
}

export const seoService = new SEOService();