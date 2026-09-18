/** Set the real production origin before publishing. Never invent a domain. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
export const isSiteConfigured = Boolean(configuredUrl && !configuredUrl.includes('seu-dominio'));
export const siteUrl = isSiteConfigured ? new URL(configuredUrl!).origin : 'http://localhost:3000';
export const contactEmail = process.env.CONTACT_EMAIL?.trim();
export const isContactConfigured = Boolean(contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail));
