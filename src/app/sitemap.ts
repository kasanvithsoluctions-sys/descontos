import type { MetadataRoute } from 'next';
import { isContactConfigured, isSiteConfigured } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';
import { publishedTools } from '@/lib/tools';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteConfigured) return [];
  const paths = ['/', '/calculadoras', '/sobre', '/politica-de-privacidade', '/termos', ...(isContactConfigured ? ['/contato'] : []), ...publishedTools.map(tool => `/${tool.slug}`)];
  return paths.map(path => ({ url: absoluteUrl(path) }));
}
