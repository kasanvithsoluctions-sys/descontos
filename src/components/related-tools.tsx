import Link from 'next/link';
import { relatedTools } from '@/lib/tools';
import { ToolCard } from './tool-card';
export function RelatedTools({ slug }: { slug: string }) {
  const related = relatedTools(slug);
  return <section className="container portal-section related-tools" aria-labelledby="related-heading">
    <h2 id="related-heading">{related.length ? 'Calculadoras relacionadas' : 'Continue explorando'}</h2>
    {related.length ? <div className="tool-grid">{related.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div> : <p>Você também pode descobrir o percentual e o preço original nas abas desta calculadora. Para entender as contas, consulte as <a href="#formulas">fórmulas de desconto</a>.</p>}
    <Link className="text-link" href="/calculadoras">Ver todas as calculadoras disponíveis →</Link>
  </section>;
}
