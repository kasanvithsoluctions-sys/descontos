import type { Metadata } from 'next';
import { isSiteConfigured, siteUrl } from './site';

export function pageMetadata(title: string, description: string, path: string, index = true): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: index && isSiteConfigured, follow: true },
    openGraph: { title, description, url: path, siteName: 'Desconta', locale: 'pt_BR', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}
export function absoluteUrl(path: string) { return new URL(path, siteUrl).href; }
