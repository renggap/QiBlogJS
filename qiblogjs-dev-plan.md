# QiBlogJS Development Plan
## Minimalist CMS for Blogging with Deno & Fresh

### Project Overview
QiBlogJS is a fast, SEO-friendly, minimalist CMS built on Deno and Fresh framework. It focuses on essential blogging features with automatic SEO optimization and clean URL structure.

### Tech Stack
- **Runtime**: Deno 1.40+
- **Framework**: Fresh 1.6+
- **Database**: Deno KV (built-in) or SQLite
- **Styling**: Tailwind CSS
- **Editor**: TinyMCE or Quill.js for WYSIWYG
- **Validation**: Zod for schema validation
- **SEO**: Built-in meta generation, breadcrumb and schema.org markup

### URL Structure
- `/` - Homepage (latest posts)
- `/{category-slug}` - Category pages
- `/page/{slug}` - Static pages
- `/{category-slug}/{post-slug}` - Blog posts
- `/admin` - Admin dashboard
- `/api/*` - REST API endpoints
- `/sitemap.xml` - Auto-generated sitemap
- `/robots.txt` - SEO robots file

## Phase 1: Foundation & Core Setup (Week 1-2)

### 1.1 Project Initialization
```bash
# Initialize Fresh project
deno run -A -r https://fresh.deno.dev qiblogjs
cd qiblogjs
```

### 1.2 Database Schema Design
```typescript
// models/schema.ts
interface Post {
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
}

interface Page {
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
```

### 1.3 Project Structure
```
qiblogjs/
├── components/
│   ├── admin/
│   ├── seo/
│   └── ui/
├── islands/
│   └── Editor.tsx
├── routes/
│   ├── admin/
│   ├── api/
│   ├── category/
│   └── page/
├── services/
│   ├── database.ts
│   ├── seo.ts
│   └── content.ts
├── utils/
│   ├── slug.ts
│   └── validation.ts
└── static/
    └── admin/
```

## Phase 2: Database & Services Layer (Week 2-3)

### 2.1 Database Service
```typescript
// services/database.ts
export class DatabaseService {
  private kv: Deno.Kv;
  
  async init() {
    this.kv = await Deno.openKv();
  }
  
  // CRUD operations for posts, categories, pages
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {}
  async getPost(slug: string, categorySlug?: string) {}
  async updatePost(id: string, updates: Partial<Post>) {}
  async deletePost(id: string) {}
  
  async createCategory(category: Omit<Category, 'id' | 'createdAt'>) {}
  async getCategories() {}
  
  async createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) {}
  async getPage(slug: string) {}
}
```

### 2.2 SEO Service
```typescript
// services/seo.ts
export class SEOService {
  generateMetaTags(data: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: 'article' | 'website';
  }) {}
  
  generateSchemaMarkup(type: 'Article' | 'WebPage' | 'Category', data: any) {}
  
  generateSitemap(posts: Post[], pages: Page[], categories: Category[]) {}
}
```

## Phase 3: Frontend Routes & Components (Week 3-4)

### 3.1 Public Routes
```typescript
// routes/index.tsx - Homepage
export default function HomePage({ data }: PageProps<{ posts: Post[] }>) {
  return (
    <Layout>
      <SEOHead 
        title="Blog Title"
        description="Blog description"
        url={url}
      />
      <PostList posts={data.posts} />
    </Layout>
  );
}

// routes/category/[slug].tsx - Category pages
// routes/page/[slug].tsx - Static pages  
// routes/category/[categorySlug]/[postSlug].tsx - Blog posts
```

### 3.2 SEO Components
```typescript
// components/seo/SEOHead.tsx
interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'article' | 'website';
  schema?: Record<string, any>;
}

export function SEOHead({ title, description, url, image, type = 'website', schema }: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {schema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
```

## Phase 4: Admin Dashboard (Week 4-5)

### 4.1 Admin Layout & Navigation
```typescript
// components/admin/Layout.tsx
export function AdminLayout({ children }: { children: ComponentChildren }) {
  return (
    <div class="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminSidebar />
      <main class="ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
```

### 4.2 WYSIWYG Editor Island
```typescript
// islands/Editor.tsx
import { useEffect, useRef } from 'preact/hooks';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Initialize TinyMCE or Quill
    // Handle content changes
  }, []);
  
  return (
    <div>
      <textarea ref={editorRef} value={content} />
    </div>
  );
}
```

### 4.3 Admin Routes
```typescript
// routes/admin/index.tsx - Dashboard
// routes/admin/posts/index.tsx - Posts list
// routes/admin/posts/new.tsx - Create post
// routes/admin/posts/[id]/edit.tsx - Edit post
// routes/admin/categories/index.tsx - Categories
// routes/admin/pages/index.tsx - Pages management
```

## Phase 5: API Endpoints (Week 5-6)

### 5.1 REST API Structure
```typescript
// routes/api/posts/index.ts - GET, POST
// routes/api/posts/[id].ts - GET, PUT, DELETE
// routes/api/categories/index.ts - GET, POST
// routes/api/categories/[id].ts - GET, PUT, DELETE
// routes/api/pages/index.ts - GET, POST
// routes/api/pages/[id].ts - GET, PUT, DELETE
// routes/api/upload.ts - File upload handler
```

### 5.2 Example API Handler
```typescript
// routes/api/posts/index.ts
export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const posts = await db.getPosts({ page, limit });
    return Response.json(posts);
  },
  
  async POST(req, ctx) {
    const postData = await req.json();
    const validatedData = PostSchema.parse(postData);
    const post = await db.createPost(validatedData);
    return Response.json(post, { status: 201 });
  }
};
```

## Phase 6: SEO Features Implementation (Week 6-7)

### 6.1 Auto Sitemap Generation
```typescript
// routes/sitemap.xml.ts
export const handler: Handlers = {
  async GET(req, ctx) {
    const posts = await db.getAllPosts();
    const pages = await db.getAllPages();
    const categories = await db.getAllCategories();
    
    const sitemap = generateSitemap({
      baseUrl: getBaseUrl(req),
      posts,
      pages,
      categories
    });
    
    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
};
```

### 6.2 Schema.org Implementation
```typescript
// utils/schema.ts
export function generateArticleSchema(post: Post, category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": "Author Name"
    },
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "articleSection": category.name,
    "url": `/category/${category.slug}/${post.slug}`
  };
}
```

## Phase 7: Performance Optimization (Week 7-8)

### 7.1 Caching Strategy
```typescript
// services/cache.ts
export class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();
  
  set(key: string, data: any, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item || item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}
```

### 7.2 Image Optimization
```typescript
// utils/images.ts
export async function optimizeImage(file: File, options: {
  width?: number;
  height?: number;
  quality?: number;
}) {
  // Implement image optimization logic
  // Resize, compress, generate WebP variants
}
```

## Phase 8: Testing & Deployment (Week 8)

### 8.1 Testing Strategy
```typescript
// tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── admin/
```

### 8.2 Deployment Configuration
```dockerfile
# Dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 8000

CMD ["deno", "run", "-A", "main.ts"]
```

### 8.3 Environment Configuration
```typescript
// config/env.ts
export const config = {
  port: Deno.env.get('PORT') || '8000',
  databaseUrl: Deno.env.get('DATABASE_URL'),
  baseUrl: Deno.env.get('BASE_URL') || 'http://localhost:8000',
  adminPassword: Deno.env.get('ADMIN_PASSWORD'),
  jwtSecret: Deno.env.get('JWT_SECRET')
};
```

## Key Features Summary

### ✅ Core Features
- CRUD operations for posts, pages, and categories
- WYSIWYG editor integration
- Clean URL structure as specified
- Responsive admin dashboard
- File upload and management

### ✅ SEO Features
- Automatic meta tag generation
- Schema.org markup for all content types
- Auto-generated XML sitemap
- SEO-friendly URLs
- Open Graph and Twitter Cards
- Breadcrumb
- Canonical URL tag

### ✅ Performance Features
- Server-side rendering with Fresh
- Built-in caching layer
- Image optimization
- Minimal bundle size
- Fast navigation with islands architecture

## Deployment Options

1. **Deno Deploy** - Native platform for Deno apps
2. **Docker** - Containerized deployment
3. **VPS** - Traditional server deployment
4. **Edge platforms** - Cloudflare Workers, etc.


This plan provides a solid foundation for building QiBlogJS as a fast, SEO-optimized, minimalist CMS using modern Deno and Fresh technologies.