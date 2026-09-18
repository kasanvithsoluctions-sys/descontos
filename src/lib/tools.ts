export const categories = {
  dinheiro: { name: 'Dinheiro', description: 'Entenda preços e compare opções antes de comprar.' },
  matematica: { name: 'Matemática', description: 'Resolva contas e relações entre números.' },
  datas: { name: 'Datas', description: 'Calcule períodos e diferenças entre datas.' },
  conversores: { name: 'Conversores', description: 'Converta medidas para a unidade que você precisa.' },
} as const;
export type Category = keyof typeof categories;
export type Tool = {
  slug: string;
  name: string;
  description: string;
  title: string;
  metaDescription: string;
  category: Category;
  status: 'published' | 'draft';
  related: readonly string[];
};
/** Register only after implementing the route, calculator, content and tests. */
export const tools: readonly Tool[] = [{
  slug: 'calculadora-desconto',
  name: 'Calculadora de Desconto',
  description: 'Calcule o preço final, a economia, o percentual entre dois preços e o preço original.',
  title: 'Calculadora de Desconto — Preço Final e Economia',
  metaDescription: 'Calcule descontos em segundos. Veja o preço final, quanto você economiza e descubra a porcentagem entre dois preços ou o preço original.',
  category: 'dinheiro',
  status: 'published',
  related: [],
}];
export const publishedTools = tools.filter(tool => tool.status === 'published');
export function relatedTools(slug: string) {
  const tool = publishedTools.find(item => item.slug === slug);
  if (!tool) return [];
  return publishedTools.filter(item => item.slug !== slug && (item.category === tool.category || tool.related.includes(item.slug))).slice(0, 4);
}
