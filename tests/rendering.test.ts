import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '../src/app/page';
import Catalog from '../src/app/calculadoras/page';
import Discount from '../src/app/calculadora-desconto/page';
import About from '../src/app/sobre/page';
import Contact from '../src/app/contato/page';
import Privacy from '../src/app/politica-de-privacidade/page';
import Terms from '../src/app/termos/page';
import NotFound from '../src/app/not-found';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { isSiteConfigured, isContactConfigured } from '../src/lib/site';
const pages = { '/': Home, '/calculadoras': Catalog, '/calculadora-desconto': Discount, '/sobre': About, '/contato': Contact, '/politica-de-privacidade': Privacy, '/termos': Terms };

test('server HTML has one H1, real internal links and valid structured data', () => {
 for (const [path, Component] of Object.entries(pages)) {
  const html = renderToStaticMarkup(createElement(Component));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
  assert.ok(html.includes('id="conteudo"'), path);
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
   const route = match[1].split(/[?#]/)[0];
   assert.ok(route in pages, `${path} links to ${route}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
   const schema = JSON.parse(match[1]);
   assert.equal(schema['@context'], 'https://schema.org');
  }
 }
});
test('discount renders tool, examples and useful explanations before hydration', () => {
 const html = renderToStaticMarkup(createElement(Discount));
 assert.ok(html.indexOf('id="calculadora"') < html.indexOf('id="como-funciona"'));
 assert.ok(html.includes('R$ 800,00'));
 assert.ok(html.includes('R$ 200,00'));
 for (const id of ['formulas', 'porcentagem', 'preco-original', 'sucessivos', 'perguntas', 'quick-examples-title']) assert.ok(html.includes(`id="${id}"`));
 assert.equal((html.match(/role="tab"/g) || []).length, 4);
 assert.equal((html.match(/<details>/g) || []).length, 7);
 assert.ok(!html.includes('googlesyndication'));
});
test('sitemap and robots omit unconfigured and nonexistent URLs', () => {
 const entries = sitemap();
 if (!isSiteConfigured) assert.deepEqual(entries, []);
 else {
  assert.equal(entries.length, isContactConfigured ? 7 : 6);
  assert.ok(entries.some(entry => new URL(entry.url).pathname === '/calculadora-desconto'));
 }
 for (const entry of entries) {
  const route = new URL(entry.url).pathname;
  assert.ok(route in pages);
  if (!isContactConfigured) assert.notEqual(route, '/contato');
  assert.ok(!entry.url.includes('?'));
 }
 assert.deepEqual(robots().rules, { userAgent: '*', allow: '/' });
});
test('404 renders useful links and one H1', () => {
 const html = renderToStaticMarkup(createElement(NotFound));
 assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
 assert.ok(html.includes('href="/calculadoras"'));
});
