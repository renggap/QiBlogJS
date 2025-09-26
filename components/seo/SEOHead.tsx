// components/seo/SEOHead.tsx
import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'article' | 'website';
  schema?: Record<string, any>;
  children?: ComponentChildren;
}

/**
 * Renders SEO meta tags and JSON-LD schema markup in the document head.
 */
export function SEOHead({ title, description, url, image, type = 'website', schema, children }: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Canonical URL (assuming the current URL is canonical) */}
      <link rel="canonical" href={url} />

      {/* Schema.org JSON-LD Markup */}
      {schema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      
      {children}
    </Head>
  );
}