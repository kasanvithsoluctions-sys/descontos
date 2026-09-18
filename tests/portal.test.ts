import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { publishedTools, relatedTools, categories } from '../src/lib/tools';
import { pageMetadata } from '../src/lib/seo';
test('published catalog only references real routes with unique metadata', () => {
 const slugs = new Set<string>();
 const titles = new Set<string>();
 for (const tool of publishedTools) {
  assert.ok(existsSync(`src/app/${tool.slug}/page.tsx`));
  assert.ok(tool.category in categories);
  assert.ok(tool.description.length > 30);
  assert.ok(!slugs.has(tool.slug));
  assert.ok(!titles.has(tool.title));
  slugs.add(tool.slug); titles.add(tool.title);
 }
});
test('related tools exclude the current page and drafts', () => {
 for (const tool of publishedTools) {
  for (const related of relatedTools(tool.slug)) {
   assert.notEqual(tool.slug, related.slug);
   assert.equal(related.status, 'published');
  }
 }
 assert.deepEqual(relatedTools('missing'), []);
});
test('page metadata has canonical and matching social descriptions', () => {
 const metadata = pageMetadata('Título específico', 'Descrição específica', '/calculadora-desconto');
 assert.deepEqual(metadata.title, { absolute: 'Título específico' });
 assert.equal(metadata.alternates?.canonical, '/calculadora-desconto');
 assert.equal(metadata.openGraph?.description, metadata.description);
 assert.equal(metadata.twitter?.description, metadata.description);
});
