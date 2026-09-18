import type { MetadataRoute } from 'next';
import { isSiteConfigured } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, ...(isSiteConfigured ? { sitemap: absoluteUrl('/sitemap.xml') } : {}) };
}
