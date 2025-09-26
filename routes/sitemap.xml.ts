// routes/sitemap.xml.ts
import { Handlers } from "$fresh/server.ts";
import { db } from "../services/database.ts";
import { seoService } from "../services/seo.ts";
import { config } from "../config/env.ts";

/**
 * Utility to determine the base URL, preferring the configured BASE_URL 
 * but falling back to the request URL host.
 */
function getBaseUrl(req: Request): string {
  if (config.baseUrl && config.baseUrl !== 'http://localhost:8000') {
    return config.baseUrl;
  }
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    // Fetch all necessary data
    const posts = await db.getAllPosts();
    const pages = await db.getAllPages();
    const categories = await db.getAllCategories();
    
    const baseUrl = getBaseUrl(req);
    
    // Generate the sitemap XML
    const sitemap = seoService.generateSitemap({
      baseUrl,
      posts,
      pages,
      categories
    });
    
    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
};