import { Breadcrumbs } from '@/components/breadcrumbs';
import { ToolCard } from '@/components/tool-card';
import { categories, publishedTools, type Category } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Calculadoras online gratuitas | Desconta', 'Encontre as calculadoras disponíveis no Desconta, organizadas por categoria. Faça suas contas sem cadastro e consulte fórmulas e exemplos.', '/calculadoras');
export default function Catalog() {
  return <main id="conteudo"><Breadcrumbs items={[{ name: 'Início', href: '/' }, { name: 'Calculadoras', href: '/calculadoras' }]} />
    <header className="container catalog-heading"><h1>Calculadoras online</h1><p>Escolha a ferramenta e vá direto ao resultado. Todas são gratuitas e funcionam sem cadastro.</p></header>
    {(Object.keys(categories) as Category[]).map(key => {
      const available = publishedTools.filter(tool => tool.category === key);
      if (!available.length) return null;
      return <section className="container portal-section" key={key}><h2>{categories[key].name}</h2><p>{categories[key].description}</p><div className="tool-grid">{available.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div></section>;
    })}
  </main>;
}
